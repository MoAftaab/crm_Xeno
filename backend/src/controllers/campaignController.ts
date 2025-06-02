import { Response } from '../types/express';
import { AuthenticatedRequest } from '../interfaces/interfaces';
import Campaign from '../models/Campaign';
import { validateCampaign } from '../services/campaignService';

export const createCampaign = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, type, rules, schedule } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Validate campaign data
    const validationResult = validateCampaign(req.body);
    if (!validationResult.isValid) {
      res.status(400).json({ message: validationResult.errors });
      return;
    }

    const campaign = await Campaign.create({
      name,
      type,
      rules,
      schedule,
      userId,
      status: 'draft'
    });

    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating campaign',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCampaigns = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const campaigns = await Campaign.find({ userId });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching campaigns',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCampaignById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const campaign = await Campaign.findOne({ _id: id, userId });
    
    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    res.json(campaign);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching campaign',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateCampaign = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const updates = req.body;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Validate campaign updates
    const validationResult = validateCampaign(updates);
    if (!validationResult.isValid) {
      res.status(400).json({ message: validationResult.errors });
      return;
    }

    const campaign = await Campaign.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true }
    );

    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    res.json(campaign);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating campaign',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteCampaign = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const campaign = await Campaign.findOneAndDelete({ _id: id, userId });

    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting campaign',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Launch a campaign (start delivery/execution)
 */
export const launchCampaign = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const campaign = await Campaign.findOne({ _id: id, userId });

    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    // Update campaign status to active
    campaign.status = 'active';
    await campaign.save();

    // Here you would typically trigger the actual delivery mechanism
    // e.g., send to a message queue, schedule with a job scheduler, etc.

    res.json({
      message: 'Campaign launched successfully',
      campaign
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error launching campaign',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get campaign performance statistics
 */
export const getCampaignStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const campaign = await Campaign.findOne({ _id: id, userId });

    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    // Here you would typically fetch actual campaign stats from your analytics system
    // This is a placeholder implementation
    const stats = {
      sent: 1250,
      delivered: 1200,
      opened: 850,
      clicked: 420,
      converted: 75,
      bounced: 50,
      unsubscribed: 15,
      openRate: 70.8,
      clickRate: 35.0,
      conversionRate: 6.3
    };

    res.json({
      campaignId: id,
      campaignName: campaign.name,
      stats
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving campaign statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
