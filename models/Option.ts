import mongoose, { Schema, Document } from 'mongoose';

export interface IOption extends Document {
  decisionId: mongoose.Types.ObjectId;
  optionName: string;
  tags: string[];
}

const OptionSchema: Schema = new Schema({
  decisionId: {
    type: Schema.Types.ObjectId,
    ref: 'Decision',
    required: true,
  },
  optionName: {
    type: String,
    required: [true, 'Please provide an option name'],
  },
  tags: {
    type: [String],
    default: [],
  },
});

export default mongoose.models.Option || mongoose.model<IOption>('Option', OptionSchema);