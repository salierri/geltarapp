import mongoose, { Schema }  from 'mongoose';
import { Room } from '../api';

interface SessionInterface {
  _id: string;
  room: Room;
}
export type SessionDocument = mongoose.Document & SessionInterface;

const sessionSchema = new mongoose.Schema({
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
}, { timestamps: true });

export const Session = mongoose.model<SessionDocument>('Session', sessionSchema);
