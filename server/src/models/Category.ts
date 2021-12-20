import mongoose, { Schema } from 'mongoose';
import { Category as CategoryInterface } from '../api';

export type CategoryDocument = mongoose.Document & CategoryInterface;

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room' },
  template: { type: Boolean, required: false },
  wasTemplate: { type: Boolean, required: false },
}, { timestamps: true });

export const Category = mongoose.model<CategoryDocument>('Category', categorySchema);
