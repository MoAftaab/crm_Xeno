import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  customer_id: mongoose.Types.ObjectId;
  amount: number;
  status: string;
  created_at: Date;
  items: any[];
}

const OrderSchema: Schema = new Schema(
  {
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    created_at: { type: Date, default: Date.now },
    items: { type: Array, default: [] }
  },
  { timestamps: true }
);



export default mongoose.model<IOrder>('Order', OrderSchema); 