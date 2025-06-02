import mongoose from 'mongoose';
import CommunicationLog from '../models/CommunicationLog';
import Campaign from '../models/Campaign';

// In-memory store for batching delivery updates
// In a production environment, this would be replaced with a proper queue system like Redis
interface BatchEntry {
  messageIds: string[];
  campaignId: string;
  createdAt: Date;
  lastProcessed: Date;
  pendingUpdates: {
    messageId: string;
    status: 'delivered' | 'failed';
  }[];
}

// Store batches in memory (in production, use Redis or a similar service)
const batchStore: Record<string, BatchEntry> = {};

/**
 * Create a new batch for delivery receipts
 */
export const createDeliveryBatch = async (campaignId: string): Promise<string> => {
  const batchId = new mongoose.Types.ObjectId().toString();
  
  batchStore[batchId] = {
    messageIds: [],
    campaignId,
    createdAt: new Date(),
    lastProcessed: new Date(),
    pendingUpdates: []
  };
  
  // Start the batch processing timer
  setTimeout(() => processBatch(batchId), 5000); // Process every 5 seconds
  
  return batchId;
};

/**
 * Add a message to a delivery batch
 */
export const addToDeliveryBatch = async (batchId: string, messageId: string): Promise<void> => {
  if (!batchStore[batchId]) {
    throw new Error(`Batch not found: ${batchId}`);
  }
  
  batchStore[batchId].messageIds.push(messageId);
};

/**
 * Add a delivery status update to a batch
 */
export const addDeliveryStatusToBatch = async (
  batchId: string,
  messageId: string,
  status: 'delivered' | 'failed'
): Promise<void> => {
  if (!batchStore[batchId]) {
    throw new Error(`Batch not found: ${batchId}`);
  }
  
  // Add the update to the pending updates list
  batchStore[batchId].pendingUpdates.push({
    messageId,
    status
  });
  
  // If we have enough updates or it's been a while since the last processing,
  // trigger immediate processing
  const batch = batchStore[batchId];
  const timeSinceLastProcess = new Date().getTime() - batch.lastProcessed.getTime();
  
  if (batch.pendingUpdates.length >= 10 || timeSinceLastProcess > 10000) {
    await processBatch(batchId);
  }
};

/**
 * Process a batch of delivery updates
 */
const processBatch = async (batchId: string): Promise<void> => {
  try {
    const batch = batchStore[batchId];
    if (!batch || batch.pendingUpdates.length === 0) {
      // Schedule the next processing if the batch still exists
      if (batch) {
        setTimeout(() => processBatch(batchId), 5000);
      }
      return;
    }
    
    console.log(`Processing batch ${batchId} with ${batch.pendingUpdates.length} updates`);
    
    // Group updates by status for efficient bulk update
    const deliveredIds: string[] = [];
    const failedIds: string[] = [];
    
    batch.pendingUpdates.forEach(update => {
      if (update.status === 'delivered') {
        deliveredIds.push(update.messageId);
      } else {
        failedIds.push(update.messageId);
      }
    });
    
    // Update communication logs in bulk
    if (deliveredIds.length > 0) {
      await CommunicationLog.updateMany(
        { _id: { $in: deliveredIds.map(id => new mongoose.Types.ObjectId(id)) } },
        { $set: { status: 'delivered', updated_at: new Date() } }
      );
    }
    
    if (failedIds.length > 0) {
      await CommunicationLog.updateMany(
        { _id: { $in: failedIds.map(id => new mongoose.Types.ObjectId(id)) } },
        { $set: { status: 'failed', updated_at: new Date() } }
      );
    }
    
    // Update campaign statistics
    const campaign = await Campaign.findById(batch.campaignId);
    if (campaign) {
      // Update delivery status counters
      const deliveryStatus = campaign.deliveryStatus || { sent: 0, failed: 0 };
      
      if (deliveredIds.length > 0) {
        deliveryStatus.sent = (deliveryStatus.sent || 0) + deliveredIds.length;
      }
      
      if (failedIds.length > 0) {
        deliveryStatus.failed = (deliveryStatus.failed || 0) + failedIds.length;
      }
      
      campaign.deliveryStatus = deliveryStatus;
      await campaign.save();
    }
    
    // Clear the processed updates
    batch.pendingUpdates = [];
    batch.lastProcessed = new Date();
    
    // Schedule the next processing
    setTimeout(() => processBatch(batchId), 5000);
    
    console.log(`Batch ${batchId} processed successfully`);
  } catch (error) {
    console.error(`Error processing batch ${batchId}:`, error);
    
    // Retry processing after a delay
    setTimeout(() => processBatch(batchId), 10000);
  }
};

export default {
  createDeliveryBatch,
  addToDeliveryBatch,
  addDeliveryStatusToBatch
};
