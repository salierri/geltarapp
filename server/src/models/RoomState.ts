import mongoose from 'mongoose';
import { State as RoomStateInterface } from '../api';

export type RoomStateDocument = mongoose.Document & RoomStateInterface;

const roomStateSchema = new mongoose.Schema({
  music: {
    url: String,
    playing: Boolean,
    masterVolume: Number,
    time: {
        start: Number,
        setAt: Date,
        elapsed: Number,
    },
  },
  ambience: {
    url: String,
    playing: Boolean,
    masterVolume: Number,
    time: {
        start: Number,
        setAt: Date,
        elapsed: Number,
    },
  },
}, { timestamps: true });

export const RoomState = mongoose.model<RoomStateDocument>('RoomState', roomStateSchema);
