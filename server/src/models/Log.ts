import mongoose from 'mongoose';
import { LogEntry as LogEntryInterface } from '../api';

export type LogDocument = mongoose.Document & LogEntryInterface;

const logSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  time: { type: Date, required: true },
}, { timestamps: true });

export const LogEntry = mongoose.model<LogDocument>('Log', logSchema);
