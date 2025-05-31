import mongoose, { Document, Schema } from 'mongoose';

export interface ISegment extends Document {
  name: string;
  description: string;
  rules: any;
  audience_size: number;
  created_at: Date;
  created_by: string;
}

const SegmentSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    rules: { type: Schema.Types.Mixed, required: true },
    audience_size: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    created_by: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<ISegment>('Segment', SegmentSchema); 