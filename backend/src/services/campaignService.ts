import { ICampaign } from '../models/Campaign';

interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

// Create a separate interface for schedule without required status
interface CampaignSchedule {
  startDate?: Date;
  endDate?: Date;
  frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  status?: 'active' | 'paused' | 'draft' | 'completed' | 'scheduled';
}

interface CampaignData {
  name?: string;
  type?: 'email' | 'sms' | 'push';
  rules?: {
    segment?: string;
    conditions?: Array<{
      field: string;
      operator: string;
      value: any;
    }>;
  };
  schedule?: CampaignSchedule;
  content?: {
    template?: string;
    variables?: Record<string, any>;
  };
  status?: 'active' | 'paused' | 'draft' | 'completed' | 'scheduled';
}

export const validateCampaign = (data: CampaignData): ValidationResult => {
  const errors: string[] = [];

  // Validate required fields
  if (!data.name) {
    errors.push('Campaign name is required');
  }

  if (!data.type) {
    errors.push('Campaign type is required');
  } else if (!['email', 'sms', 'push'].includes(data.type)) {
    errors.push('Invalid campaign type');
  }

  // Validate rules if present
  if (data.rules?.conditions) {
    data.rules.conditions.forEach((condition, index) => {
      if (!condition.field) {
        errors.push(`Condition ${index + 1}: Field is required`);
      }
      if (!condition.operator) {
        errors.push(`Condition ${index + 1}: Operator is required`);
      }
      if (condition.value === undefined || condition.value === null) {
        errors.push(`Condition ${index + 1}: Value is required`);
      }
    });
  }

  // Validate schedule if present
  if (data.schedule) {
    const { startDate, endDate, frequency } = data.schedule;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      errors.push('End date must be after start date');
    }

    if (frequency && !['once', 'daily', 'weekly', 'monthly'].includes(frequency)) {
      errors.push('Invalid frequency');
    }
  }

  // Validate content
  if (!data.content?.template) {
    errors.push('Message template is required');
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
};

export const validateSchedule = (startDate: Date, endDate?: Date): ValidationResult => {
  const errors: string[] = [];
  const now = new Date();

  if (new Date(startDate) < now) {
    errors.push('Start date must be in the future');
  }

  if (endDate && new Date(endDate) <= new Date(startDate)) {
    errors.push('End date must be after start date');
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
};

export const isDeliveryFailed = (status: ICampaign['deliveryStatus']): boolean => {
  return status.status === 'failed';
};

export const isCompleted = (status: ICampaign['deliveryStatus']): boolean => {
  return status.status === 'completed';
};
