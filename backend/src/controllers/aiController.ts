import { Request, Response } from 'express';
import { aiService, MessageGenerationParams } from '../services/aiService';
import Segment from '../models/Segment';
import Customer from '../models/Customer';

// Generate campaign suggestion
export const getCampaignSuggestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const segmentId = req.params.segmentId;
    
    // Find segment and a sample customer
    const segment = await Segment.findById(segmentId);
    if (!segment) {
      res.status(404).json({ message: 'Segment not found' });
      return;
    }
    
    // Find customers in this segment (assuming customers are stored separately)
    const customers = await Customer.find({ segmentId: segmentId }).limit(1);
    
    // Get AI suggestion
    const suggestion = await aiService.generateCampaignMessage({
      campaignName: `Campaign for ${segment.name || 'Unnamed Segment'}`,
      description: segment.description || '',
      segmentInfo: segment.name || 'Unnamed Segment'
    });
    
    res.json({ success: true, data: suggestion });
  } catch (error) {
    console.error('Error getting campaign suggestion:', error);
    res.status(500).json({ message: 'Error getting campaign suggestion', error });
  }
};

// Analyze customer data
export const getCustomerAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get sample customers for analysis
    const customers = await Customer.find().limit(20);
    
    // Get segment data
    const segment = {
      name: "Sample Customer Group",
      conditions: [
        { field: "totalSpent", operator: ">", value: "100" }
      ],
      customerCount: customers.length
    };
    
    const analysis = await aiService.analyzeSegment(segment);
    
    res.json({ success: true, data: analysis });
  } catch (error) {
    console.error('Error analyzing customer data:', error);
    res.status(500).json({ message: 'Error analyzing customer data', error });
  }
};

/**
 * Generate AI campaign message
 * @route   POST /api/ai/generate-message
 */
export const generateAIMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const params: MessageGenerationParams = req.body;
    
    // Validate required fields
    if (!params.campaignName) {
      res.status(400).json({ 
        success: false, 
        message: 'Campaign name is required' 
      });
      return;
    }
    
    const message = await aiService.generateCampaignMessage(params);
    
    res.json({
      success: true,
      data: { message }
    });
  } catch (error: any) {
    console.error('Error in AI message generation:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate message'
    });
  }
};

/**
 * Analyze customer segment with AI
 * @route   POST /api/ai/analyze-segment
 */
export const analyzeSegmentWithAI = async (req: Request, res: Response): Promise<void> => {
  try {
    const segmentData = req.body;
    
    // Validate segment data
    if (!segmentData.name || !segmentData.conditions) {
      res.status(400).json({
        success: false,
        message: 'Valid segment data is required'
      });
      return;
    }
    
    const analysis = await aiService.analyzeSegment(segmentData);
    
    res.json({
      success: true,
      data: { analysis }
    });
  } catch (error: any) {
    console.error('Error in AI segment analysis:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze segment'
    });
  }
}; 