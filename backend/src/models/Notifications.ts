// backend/src/models/Notification.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INotification extends Document {
  user: Types.ObjectId; // reference to the User
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema: Schema<INotification> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<INotification>('Notification', notificationSchema);
