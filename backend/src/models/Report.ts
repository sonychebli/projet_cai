import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  crimeType: string;
  title: string;
  description: string;
  location: string;
  date: Date;
  time?: string;
  urgency: 'low' | 'medium' | 'high';
  isAnonymous: boolean;
  images: string[];
  status: 'submitted' | 'in_review' | 'resolved';
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const reportSchema: Schema<IReport> = new Schema({
  crimeType: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String },
  urgency: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  isAnonymous: { type: Boolean, default: false },
  images: [{ type: String }],
  status: { type: String, enum: ['submitted', 'in_review', 'resolved'], default: 'submitted' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IReport>('Report', reportSchema);
