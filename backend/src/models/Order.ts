import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  customerId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  status: string;
  orderDate: Date;
  items: any[];
}

const OrderSchema: Schema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    orderDate: { type: Date, default: Date.now },
    items: { type: Array, default: [] }
  },
  { timestamps: true }
);



export default mongoose.model<IOrder>('Order', OrderSchema);
