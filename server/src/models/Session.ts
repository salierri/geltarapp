import mongoose, { Schema }  from 'mongoose';
import { Room } from '../api';

interface SessionInterface {
  _id: string;
  room: Room;
  master: boolean;
}
export type SessionDocument = mongoose.Document & SessionInterface;

const sessionSchema = new mongoose.Schema({
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  master: { type: Boolean, required: true },
}, { timestamps: true });

export const Session = mongoose.model<SessionDocument>('Session', sessionSchema);
