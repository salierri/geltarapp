import mongoose, { Schema } from 'mongoose';
import { CategoryDocument } from './Category';

export type PresetDocument = mongoose.Document & {
  name: string;
  url: string;
  title: string;
  length: number;
  category: CategoryDocument['_id'];
};

const presetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  title: { type: String, required: true },
  length: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
}, { timestamps: true });

export const Preset = mongoose.model<PresetDocument>('Preset', presetSchema);
