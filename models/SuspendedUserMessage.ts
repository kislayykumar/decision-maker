import mongoose, { Schema, Document } from 'mongoose';

export interface ISuspendedUserMessage extends Document {
  userEmail: string;
  userName: string;
  message: string;
  suspensionReason: string;
  createdAt: Date;
  isRead: boolean;
}

const SuspendedUserMessageSchema = new Schema<ISuspendedUserMessage>(
  {
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    suspensionReason: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const SuspendedUserMessage =
  mongoose.models.SuspendedUserMessage ||
  mongoose.model<ISuspendedUserMessage>('SuspendedUserMessage', SuspendedUserMessageSchema);

export default SuspendedUserMessage;