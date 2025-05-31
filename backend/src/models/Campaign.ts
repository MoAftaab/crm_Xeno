import mongoose, { Document, Schema } from 'mongoose';

export interface ICampaign extends Document {
  segment_id: mongoose.Types.ObjectId;
  name: string;
  message_template: string;
  created_at: Date;
  created_by: string;
  sent_count: number;
  failed_count: number;
  audience_size: number;
  status: string;
  scheduledAt: Date;
  deliveryStatus?: {
    sent?: number;
    failed?: number;
  };
}

const CampaignSchema: Schema = new Schema(
  {
    segment_id: { type: Schema.Types.ObjectId, ref: 'Segment', required: true },
    name: { type: String, required: true },
    message_template: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    created_by: { type: String },
    sent_count: { type: Number, default: 0 },
    failed_count: { type: Number, default: 0 },
    audience_size: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'scheduled', 'active', 'completed', 'failed'], default: 'draft' },
    scheduledAt: { type: Date },
    deliveryStatus: {
      sent: { type: Number, default: 0 },
      failed: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

export default mongoose.model<ICampaign>('Campaign', CampaignSchema); 