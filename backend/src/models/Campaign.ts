import mongoose, { Schema, Document } from 'mongoose';

export interface ICampaign extends Document {
  name: string;
  type: 'email' | 'sms' | 'push';
  userId: mongoose.Types.ObjectId;
  segment_id?: string;
  audience_size?: number;
  message_template: string; // Changed to required
  failed_count: number;
  deliveryStatus: {
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    sent?: number;
    failed?: number;
  };
  status: 'active' | 'paused' | 'draft' | 'completed' | 'scheduled' | 'failed';
  scheduledAt?: Date;
  rules: {
    segment?: string;
    conditions?: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
  };
  schedule: {
    startDate?: Date;
    endDate?: Date;
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
    status: 'active' | 'paused' | 'draft' | 'completed' | 'scheduled';
  };
  content: {
    template: string;
    variables?: Record<string, any>;
  };
  metadata?: {
    createdAt: Date;
    updatedAt: Date;
    lastRun?: Date;
    stats?: {
      sent: number;
      delivered: number;
      failed: number;
    };
  };
}

const CampaignSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['email', 'sms', 'push']
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  segment_id: String,
  audience_size: Number,
  message_template: {
    type: String,
    required: true
  },
  failed_count: {
    type: Number,
    default: 0
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'failed'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'draft', 'completed', 'scheduled'],
    default: 'draft'
  },
  scheduledAt: Date,
  rules: {
    segment: String,
    conditions: [{
      field: String,
      operator: String,
      value: Schema.Types.Mixed
    }]
  },
  schedule: {
    startDate: Date,
    endDate: Date,
    frequency: {
      type: String,
      enum: ['once', 'daily', 'weekly', 'monthly']
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'draft', 'completed', 'scheduled'],
      default: 'draft'
    }
  },
  content: {
    template: {
      type: String,
      required: true
    },
    variables: Schema.Types.Mixed
  },
  metadata: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    lastRun: Date,
    stats: {
      sent: {
        type: Number,
        default: 0
      },
      delivered: {
        type: Number,
        default: 0
      },
      failed: {
        type: Number,
        default: 0
      }
    }
  }
});

// Update the updatedAt timestamp before saving
CampaignSchema.pre('save', function(next) {
  if (this.metadata) {
    this.metadata.updatedAt = new Date();
  }
  next();
});

export default mongoose.model<ICampaign>('Campaign', CampaignSchema);
