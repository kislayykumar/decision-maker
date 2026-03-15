import mongoose, { Schema, Document } from 'mongoose';

export interface IDecision extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  createdAt: Date;
}

const DecisionSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a decision title'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Decision || mongoose.model<IDecision>('Decision', DecisionSchema);