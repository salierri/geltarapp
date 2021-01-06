import mongoose from 'mongoose';
import { Room as RoomInterface } from '../api';

export type RoomDocument = mongoose.Document & RoomInterface;

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  visibility: { type: String, required: true },
  password: { type: String, required: false },
  masterPassword: { type: String, required: false },
}, { timestamps: true });

export const Room = mongoose.model<RoomDocument>('Room', roomSchema);
