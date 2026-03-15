import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  userId: mongoose.Types.ObjectId;
  decisionId: mongoose.Types.ObjectId;
  optionChosen: string;
  rating: 'positive' | 'negative';
  createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  decisionId: {
    type: Schema.Types.ObjectId,
    ref: 'Decision',
    required: true,
  },
  optionChosen: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    enum: ['positive', 'negative'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);