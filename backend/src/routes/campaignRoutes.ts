import express from 'express';
import { 
  getCampaigns, 
  getCampaignById, 
  createCampaign, 
  updateCampaign, 
  deleteCampaign,
  launchCampaign,
  getCampaignStats
} from '../controllers/campaignController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// All campaign routes are protected by authentication
router.get('/', authenticate, getCampaigns);
router.get('/:id', authenticate, getCampaignById);
router.post('/', authenticate, createCampaign);
router.put('/:id', authenticate, updateCampaign);
router.delete('/:id', authenticate, deleteCampaign);

// Additional campaign endpoints
router.post('/:id/launch', authenticate, launchCampaign);
router.get('/:id/stats', authenticate, getCampaignStats);

export default router; 