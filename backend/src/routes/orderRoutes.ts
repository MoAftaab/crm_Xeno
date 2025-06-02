import express from 'express';
import { getOrders, getOrderById, createOrder, updateOrder, deleteOrder } from '../controllers/orderController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// Protected routes
router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrderById);
router.post('/', authenticate, createOrder);
router.put('/:id', authenticate, updateOrder);
router.delete('/:id', authenticate, deleteOrder);

export default router;
