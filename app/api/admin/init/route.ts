import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });

    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: 'Admin already exists' },
        { status: 400 }
      );
    }

    // Create default admin with username: admin, password: password
    const hashedPassword = await bcrypt.hash('password', 10);

    await Admin.create({
      username: 'admin',
      password: hashedPassword,
      loginCount: 0,
    });

    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}