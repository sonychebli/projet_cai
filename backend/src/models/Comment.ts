import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  reportId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const commentSchema: Schema<IComment> = new Schema({
  reportId: { type: Schema.Types.ObjectId, ref: 'Report', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IComment>('Comment', commentSchema);
