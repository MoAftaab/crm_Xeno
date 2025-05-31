import express from 'express';
import { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customerController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// Public routes
router.post('/', createCustomer);

// Protected routes
router.get('/', authenticate, getCustomers);
router.get('/:id', authenticate, getCustomerById);
router.put('/:id', authenticate, updateCustomer);
router.delete('/:id', authenticate, deleteCustomer);

export default router; 