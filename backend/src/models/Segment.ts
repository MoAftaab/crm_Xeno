import mongoose, { Schema, Document } from 'mongoose';

export interface ISegmentCondition {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'greaterThan' | 'lessThan';
  value: any;
}

export interface ISegment extends Document {
  name: string;
  userId: mongoose.Types.ObjectId;
  description?: string;
  conditions: ISegmentCondition[];
  type: 'dynamic' | 'static';
  lastUpdated: Date;
  audienceCount?: number;
  metadata?: Record<string, any>;
}

const SegmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  description: {
    type: String,
    trim: true
  },
  conditions: [{
    field: {
      type: String,
      required: true
    },
    operator: {
      type: String,
      enum: ['equals', 'notEquals', 'contains', 'notContains', 'greaterThan', 'lessThan'],
      required: true
    },
    value: {
      type: Schema.Types.Mixed,
      required: true
    }
  }],
  type: {
    type: String,
    enum: ['dynamic', 'static'],
    default: 'dynamic'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  audienceCount: {
    type: Number,
    default: 0
  },
  metadata: {
    type: Schema.Types.Mixed
  }
});

// Update lastUpdated timestamp before saving
SegmentSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

export default mongoose.model<ISegment>('Segment', SegmentSchema);
