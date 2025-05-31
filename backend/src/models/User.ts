import mongoose, { Document, Schema } from 'mongoose';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  companyName?: string;
  role: 'admin' | 'user';
  googleId?: string;  // For Google authentication
  picture?: string;   // Profile picture URL
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>({
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
  password: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  googleId: {
    type: String,
    sparse: true,
    index: true
  },
  picture: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Create index on email for faster lookups
userSchema.index({ email: 1 });

export default mongoose.model<UserDocument>('User', userSchema); 