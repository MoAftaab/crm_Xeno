import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunicationLog extends Document {
  campaignId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  status: 'delivered' | 'failed';
  error?: string;
  timestamp: Date;
}

const CommunicationLogSchema = new Schema({
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  status: {
    type: String,
    enum: ['delivered', 'failed'],
    required: true
  },
  error: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<ICommunicationLog>('CommunicationLog', CommunicationLogSchema);
