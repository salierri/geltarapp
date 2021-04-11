import mongoose from 'mongoose';

export interface LogEntry {
  _id: string;
  name: string;
  value: string;
  time: Date;
}

export type LogDocument = mongoose.Document & LogEntry;

const logSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  time: { type: Date, required: true },
}, { timestamps: true });

export const LogEntry = mongoose.model<LogDocument>('Log', logSchema);
