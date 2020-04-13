import mongoose from 'mongoose';
import { VideoRole } from '../api';

export type CategoryDocument = mongoose.Document & {
  name: string;
  role: VideoRole;
};

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
}, { timestamps: true });

export const Category = mongoose.model<CategoryDocument>('Category', categorySchema);
