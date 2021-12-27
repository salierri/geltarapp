import mongoose, { Schema } from 'mongoose';
import { CategoryDocument } from './Category';
import { Preset as PresetInterface } from '../api';

export type PresetDocument = mongoose.Document & PresetInterface & {
  category: CategoryDocument['_id'];
};

const presetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  title: { type: String, required: true },
  length: { type: Number, required: true },
  wasTemplate: { type: Boolean, required: false },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
}, { timestamps: true });

export const Preset = mongoose.model<PresetDocument>('Preset', presetSchema);
