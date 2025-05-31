import express from 'express';
import { authenticate } from '../middlewares/auth';
import { 
  getCampaignSuggestion, 
  getCustomerAnalysis, 
  generateAIMessage, 
  analyzeSegmentWithAI 
} from '../controllers/aiController';

const router = express.Router();

// AI routes protected by authentication middleware
router.get('/campaign-suggestion/:segmentId', authenticate, getCampaignSuggestion);
router.get('/customer-analysis', authenticate, getCustomerAnalysis);
router.post('/generate-message', authenticate, generateAIMessage);
router.post('/analyze-segment', authenticate, analyzeSegmentWithAI);

export default router; 