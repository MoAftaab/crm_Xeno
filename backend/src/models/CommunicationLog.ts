import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunicationLog extends Document {
  campaign_id: mongoose.Types.ObjectId;
  customer_id: mongoose.Types.ObjectId;
  message: string;
  status: string;
  sent_at: Date;
  updated_at: Date;
}

const CommunicationLogSchema: Schema = new Schema(
  {
    campaign_id: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['sent', 'delivered', 'failed'], default: 'sent' },
    sent_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model<ICommunicationLog>('CommunicationLog', CommunicationLogSchema); 