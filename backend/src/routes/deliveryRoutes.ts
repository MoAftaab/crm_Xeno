import express from 'express';
import { handleDeliveryReceipt, getCampaignDeliveryStats } from '../controllers/deliveryController';

// Import the middleware function
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// Protected routes (require authentication)
router.get('/stats/:campaignId', authenticate, getCampaignDeliveryStats);

// Webhook for vendor delivery receipts (public endpoint)
// This endpoint needs to be accessible to the vendor API
router.post('/receipt', handleDeliveryReceipt);

export default router;
