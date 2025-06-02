import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  userId: mongoose.Types.ObjectId;
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  externalId?: string;
  created_at: Date;
  last_active?: Date;
  total_spend?: number;
  visit_count?: number;
  metadata?: Record<string, any>;
}

const CustomerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  externalId: {
    type: String,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  last_active: Date,
  total_spend: {
    type: Number,
    default: 0
  },
  visit_count: {
    type: Number,
    default: 0
  },
  metadata: Schema.Types.Mixed
});

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
