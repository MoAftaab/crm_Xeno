import { Request, Response } from 'express';
import Campaign from '../models/Campaign';

// Get all campaigns
export const getCampaigns = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ message: 'Failed to fetch campaigns' });
  }
};

// Get campaign by ID
export const getCampaignById = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }
    
    res.json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ message: 'Failed to fetch campaign' });
  }
};

// Create new campaign
export const createCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const newCampaign = new Campaign(req.body);
    const savedCampaign = await newCampaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ message: 'Failed to create campaign' });
  }
};

// Update campaign
export const updateCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedCampaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }
    
    res.json(updatedCampaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ message: 'Failed to update campaign' });
  }
};

// Delete campaign
export const deleteCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedCampaign = await Campaign.findByIdAndDelete(req.params.id);
    
    if (!deletedCampaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }
    
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ message: 'Failed to delete campaign' });
  }
};

// Launch campaign
export const launchCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }
    
    // Update campaign status to active
    campaign.status = 'active';
    
    // Set launch time to now if not already scheduled
    if (!campaign.scheduledAt) {
      campaign.scheduledAt = new Date();
    }
    
    await campaign.save();
    
    // Here you would typically trigger the actual message sending process,
    // which could use a message queue or other async process
    
    res.json(campaign);
  } catch (error) {
    console.error('Error launching campaign:', error);
    res.status(500).json({ message: 'Failed to launch campaign' });
  }
};

// Get campaign statistics
export const getCampaignStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }
    
    // In a real application, you would fetch actual stats from your database
    // This is just a placeholder
    const stats = {
      sent: campaign.deliveryStatus?.sent || 0,
      delivered: (campaign.deliveryStatus?.sent || 0) - (campaign.deliveryStatus?.failed || 0),
      failed: campaign.deliveryStatus?.failed || 0,
      opened: Math.floor((campaign.deliveryStatus?.sent || 0) * 0.7), // Dummy data: 70% open rate
      clicked: Math.floor((campaign.deliveryStatus?.sent || 0) * 0.3), // Dummy data: 30% click rate
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching campaign stats:', error);
    res.status(500).json({ message: 'Failed to fetch campaign statistics' });
  }
}; 