import express from 'express';
import { Request, Response } from '../types/express';
import { 
  importCustomers, 
  importOrders, 
  generateSampleData as getCustomerSampleData, 
  generateOrderSampleData as getOrderSampleData 
} from '../controllers/uploadController';

import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers
} from '../controllers/customerController';

import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
} from '../controllers/orderController';

// Import Customer model for the test route
import Customer from '../models/Customer';

// Import authentication middleware
import { authenticate } from '../middleware/auth';

const router = express.Router();

// CSV Import/Export routes - protected with authentication
router.post('/import/customers', authenticate, importCustomers);
router.post('/import/orders', authenticate, importOrders);
router.get('/sample/customer', getCustomerSampleData);
router.get('/sample/order', getOrderSampleData);

// Customer routes - public test route (TEMPORARY for debugging)
router.get('/test/customers', async (req: Request, res: Response) => {
  try {
    const customers = await Customer.find({}).limit(10);
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching test customers', error });
  }
});

// Customer routes - protected with authentication
router.get('/customers', authenticate, getCustomers);
router.get('/customers/search', authenticate, searchCustomers);
router.get('/customers/:id', authenticate, getCustomerById);
router.post('/customers', authenticate, createCustomer);
router.put('/customers/:id', authenticate, updateCustomer);
router.delete('/customers/:id', authenticate, deleteCustomer);

// Order routes - protected with authentication
router.get('/orders', authenticate, getOrders);
router.get('/orders/:id', authenticate, getOrderById);
router.post('/orders', authenticate, createOrder);
router.put('/orders/:id', authenticate, updateOrder);
router.delete('/orders/:id', authenticate, deleteOrder);

export default router;
