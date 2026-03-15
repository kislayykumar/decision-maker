import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  bio?: string;
  isAdmin?: boolean;
  isSuspended?: boolean;
  suspendedReason?: string;
  suspendedAt?: Date;
  suspensionMessageCount?: number;
  lastLoginAt?: Date;
  loginCount?: number;
  preferences?: {
    defaultEnergyLevel?: string;
    defaultGoal?: string;
    defaultTimeAvailable?: string;
    interests?: string[];
    lifestyle?: string;
    workSchedule?: string;
  };
  createdAt: Date;
  updatedAt?: Date;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    select: false,
  },
  bio: {
    type: String,
    default: '',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isSuspended: {
    type: Boolean,
    default: false,
  },
  suspendedReason: {
    type: String,
    default: '',
  },
  suspendedAt: {
    type: Date,
  },
  suspensionMessageCount: {
    type: Number,
    default: 0,
  },
  lastLoginAt: {
    type: Date,
  },
  loginCount: {
    type: Number,
    default: 0,
  },
  preferences: {
    defaultEnergyLevel: { type: String, default: '' },
    defaultGoal: { type: String, default: '' },
    defaultTimeAvailable: { type: String, default: '' },
    interests: { type: [String], default: [] },
    lifestyle: { type: String, default: '' },
    workSchedule: { type: String, default: '' },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);