import Campaign from '../models/Campaign';
import { processCampaignDelivery } from './messageDeliveryService';

/**
 * Campaign Scheduler Service
 * Checks for and processes scheduled campaigns that are ready to be sent
 */

/**
 * Process scheduled campaigns that are ready to be sent
 * This should be called periodically by a timer or cron job
 */
export const processScheduledCampaigns = async (): Promise<void> => {
  try {
    console.log('[Scheduler] Checking for scheduled campaigns...');
    
    // Find campaigns that are scheduled and ready to be sent
    const currentTime = new Date();
    const scheduledCampaigns = await Campaign.find({
      status: 'scheduled',
      scheduledAt: { $lte: currentTime }
    });
    
    if (scheduledCampaigns.length === 0) {
      console.log('[Scheduler] No campaigns ready for delivery');
      return;
    }
    
    console.log(`[Scheduler] Found ${scheduledCampaigns.length} campaigns ready for delivery`);
    
    // Process each campaign
    for (const campaign of scheduledCampaigns) {
      try {
        // Update status to active
        campaign.status = 'active';
        await campaign.save();
        
        console.log(`[Scheduler] Initiating delivery for campaign: ${campaign._id}`);
        
        // Initiate campaign delivery
        const campaignId = campaign._id?.toString();
        if (campaignId) {
          await processCampaignDelivery(campaignId);
        }
      } catch (error) {
        console.error(`[Scheduler] Error processing campaign ${campaign._id}:`, error);
        
        // Update campaign status to failed
        campaign.status = 'failed';
        await campaign.save();
      }
    }
  } catch (error) {
    console.error('[Scheduler] Error processing scheduled campaigns:', error);
  }
};

/**
 * Initialize the campaign scheduler
 * Sets up an interval to check for scheduled campaigns
 */
export const initCampaignScheduler = (): NodeJS.Timeout => {
  console.log('[Scheduler] Initializing campaign scheduler');
  
  // Check for scheduled campaigns every minute
  const schedulerInterval = setInterval(async () => {
    await processScheduledCampaigns();
  }, 60000); // 1 minute
  
  return schedulerInterval;
};

export default {
  processScheduledCampaigns,
  initCampaignScheduler
};
