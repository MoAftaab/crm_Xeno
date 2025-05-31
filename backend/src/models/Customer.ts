import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email: string;
  phone: string;
  created_at: Date;
  last_active: Date;
  total_spend: number;
  visit_count: number;
}

const CustomerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    created_at: { type: Date, default: Date.now },
    last_active: { type: Date, default: Date.now },
    total_spend: { type: Number, default: 0 },
    visit_count: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model<ICustomer>('Customer', CustomerSchema); 