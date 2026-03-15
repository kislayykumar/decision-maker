import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Admin from '@/models/Admin';
import mongoose from 'mongoose';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        isAdmin: { label: 'Is Admin', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide email and password');
        }

        await connectDB();

        // Check if this is an admin login
        if (credentials.isAdmin === 'true') {
          const admin = await Admin.findOne({ username: credentials.email }).select('+password');
          
          if (!admin) {
            throw new Error('Invalid admin credentials');
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, admin.password);
          
          if (!isPasswordValid) {
            throw new Error('Invalid admin credentials');
          }

          // Update admin login stats
          await Admin.findByIdAndUpdate(admin._id, {
            lastLoginAt: new Date(),
            $inc: { loginCount: 1 },
          });

          return {
            id: admin._id.toString(),
            email: admin.username,
            name: 'Admin',
            isAdmin: true,
          };
        }

        // Regular user login - First find user
        const user = await User.findOne({ email: credentials.email }).select('+password');
        
        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        // Query suspension status directly from MongoDB (bypass Mongoose select issues)
        const userDoc = await mongoose.connection.db?.collection('users').findOne(
          { _id: user._id }
        );

        console.log('Login attempt for:', user.email);
        console.log('Suspension check from MongoDB:', {
          isSuspended: userDoc?.isSuspended,
          suspendedReason: userDoc?.suspendedReason
        });

        // Check if user is suspended using direct MongoDB query
        if (userDoc?.isSuspended === true) {
          const reason = userDoc.suspendedReason || 'Violation of terms of service';
          throw new Error(`ACCOUNT_SUSPENDED:${reason}`);
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        
        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        // Update user login stats
        await User.findByIdAndUpdate(user._id, {
          lastLoginAt: new Date(),
          $inc: { loginCount: 1 },
        });

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin || false,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            lastLoginAt: new Date(),
            loginCount: 1,
          });
        } else {
          // Query suspension status directly from MongoDB
          const userDoc = await mongoose.connection.db?.collection('users').findOne(
            { _id: existingUser._id }
          );

          // Check if user is suspended
          if (userDoc?.isSuspended === true) {
            return false; // Prevent sign in
          }
          
          // Update login stats
          await User.findByIdAndUpdate(existingUser._id, {
            lastLoginAt: new Date(),
            $inc: { loginCount: 1 },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = (user as any).isAdmin || false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).isAdmin = token.isAdmin || false;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };