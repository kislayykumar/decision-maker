import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  loginCount: number;
}

const AdminSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastLoginAt: {
    type: Date,
  },
  loginCount: {
    type: Number,
    default: 0,
  },
});

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);