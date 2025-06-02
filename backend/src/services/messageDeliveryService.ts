import { Types, Document } from 'mongoose';
import Campaign, { ICampaign } from '../models/Campaign';
import Customer, { ICustomer } from '../models/Customer';
import CommunicationLog, { ICommunicationLog } from '../models/CommunicationLog';
import { isDeliveryFailed, isCompleted } from './campaignService';

const BATCH_SIZE = 100;
const MAX_RETRIES = 3;

interface MessageResult {
  success: boolean;
  error?: string;
}

// Exclude Document keys from ICommunicationLog for data creation
type CommunicationLogData = {
  campaignId: Types.ObjectId;
  customerId: Types.ObjectId;
  status: 'delivered' | 'failed';
  error?: string;
  timestamp: Date;
};

export async function processCampaignDelivery(campaignId: string): Promise<void> {
  const campaign = await Campaign.findById(campaignId);

  if (!campaign) {
    throw new Error('Campaign not found');
  }

  try {
    // Get target audience
    const customers = await getTargetAudience(campaign);
    
    // Process in batches
    for (let i = 0; i < customers.length; i += BATCH_SIZE) {
      const batch = customers.slice(i, i + BATCH_SIZE);
      await processBatch(batch, campaign);
    }

    // Update campaign status
    await updateCampaignStatus(campaign);
  } catch (error) {
    console.error(`Error processing campaign ${campaignId}:`, error);
    throw error;
  }
}

async function getTargetAudience(campaign: ICampaign) {
  const query: any = { userId: campaign.userId };

  // Add segmentation rules
  if (campaign.segment_id) {
    // Apply segment rules
    const segment = await getSegment(campaign.segment_id);
    Object.assign(query, segment.rules);
  }

  return Customer.find(query).limit(1000); // Add proper pagination
}

async function getSegment(segmentId: string) {
  // Placeholder: Implement segment retrieval
  return {
    rules: {}
  };
}

async function processBatch(customers: ICustomer[], campaign: ICampaign) {
  const logs: Omit<CommunicationLogData, 'campaignId' | 'customerId'>[] = [];

  for (const customer of customers) {
    try {
      const result = await sendMessage(campaign.message_template, customer);
      logs.push({
        status: result.success ? 'delivered' : 'failed',
        error: result.error,
        timestamp: new Date()
      });
    } catch (error) {
      logs.push({
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
    }
  }

  // Add IDs and create complete log entries
  const logEntries = logs.map((log, index) => {
    // Ensure we have a valid campaign ID
    const campaignId = campaign._id instanceof Types.ObjectId 
      ? campaign._id 
      : new Types.ObjectId(String(campaign._id));
    
    // Ensure we have a valid customer ID
    const customerId = customers[index]._id instanceof Types.ObjectId 
      ? customers[index]._id 
      : new Types.ObjectId(String(customers[index]._id));
    
    return {
      ...log,
      campaignId,
      customerId,
    };
  });

  // Bulk insert logs
  await CommunicationLog.insertMany(logEntries);

  // Update campaign metrics
  // Ensure we have a valid campaign ID
  const campaignId = campaign._id instanceof Types.ObjectId 
    ? campaign._id 
    : new Types.ObjectId(String(campaign._id));
  
  await updateCampaignMetrics(campaignId, logEntries);
}

async function updateCampaignMetrics(
  campaignId: Types.ObjectId,
  logs: CommunicationLogData[]
) {
  const deliveryStats = logs.reduce(
    (acc: Record<string, number>, log) => {
      acc[log.status] = (acc[log.status] || 0) + 1;
      return acc;
    },
    {}
  );

  await Campaign.findByIdAndUpdate(campaignId, {
    $inc: {
      'metadata.stats.delivered': deliveryStats.delivered || 0,
      'metadata.stats.failed': deliveryStats.failed || 0
    }
  });
}

async function updateCampaignStatus(campaign: ICampaign) {
  // Check if all messages are processed
  if (isDeliveryFailed(campaign.deliveryStatus)) {
    // If max retries reached, mark as failed
    if (campaign.failed_count >= MAX_RETRIES) {
      await Campaign.findByIdAndUpdate(campaign._id, {
        deliveryStatus: 'failed'
      });
    }
  } else if (isCompleted(campaign.deliveryStatus)) {
    // Update campaign completion status
    await Campaign.findByIdAndUpdate(campaign._id, {
      status: 'completed',
      'metadata.lastRun': new Date()
    });
  }
}

async function sendMessage(template: string, customer: ICustomer): Promise<MessageResult> {
  // Placeholder: Implement actual message sending logic
  return { success: true };
}

export async function scheduleCampaign(campaignId: string, scheduledAt: Date): Promise<void> {
  const campaignObjectId = new Types.ObjectId(campaignId);
  await Campaign.findByIdAndUpdate(campaignObjectId, {
    scheduledAt,
    status: 'scheduled'
  });
}
