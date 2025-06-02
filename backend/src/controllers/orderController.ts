import express from 'express';
import { Types } from 'mongoose';
import { AuthenticatedRequest } from '../interfaces/interfaces';
import Order from '../models/Order';
import Customer from '../models/Customer';

// Get all orders
export const getOrders = async (req: AuthenticatedRequest, res: express.Response): Promise<void> => {
  try {
    // Get userId from authenticated request
    const userId = req.user?.id;
    
    // If userId is available, filter by it
    const query = userId ? { userId: userId } : {};
    
    const orders = await Order.find(query).sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// Get single order by ID
export const getOrderById = async (req: AuthenticatedRequest, res: express.Response): Promise<void> => {
  try {
    // Get userId from authenticated request
    const userId = req.user?.id;
    
    // If userId is available, filter by it
    const query = userId ? { userId: userId, _id: req.params.id } : { _id: req.params.id };
    
    const order = await Order.findOne(query);
    
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

// Create new order
export const createOrder = async (req: AuthenticatedRequest, res: express.Response): Promise<void> => {
  try {
    const { customerId, items, amount, orderDate } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    // Check if customer exists
    const customer = await Customer.findOne({ _id: customerId, userId });
    if (!customer) {
      res.status(400).json({ message: 'Customer not found' });
      return;
    }
    
    const order = new Order({
      userId: new Types.ObjectId(userId),
      customerId,
      items,
      amount,
      orderDate: orderDate || new Date(),
      status: 'pending'
    });
    
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

// Update order
export const updateOrder = async (req: AuthenticatedRequest, res: express.Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    const order = await Order.findOne({ _id: req.params.id, userId });
    
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    
    const { items, amount, status, orderDate } = req.body;
    
    if (items) order.items = items;
    if (amount) order.amount = amount;
    if (status) order.status = status;
    if (orderDate) order.orderDate = orderDate;
    
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
};

// Delete order
export const deleteOrder = async (req: AuthenticatedRequest, res: express.Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    const order = await Order.findOne({ _id: req.params.id, userId });
    
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    
    await Order.deleteOne({ _id: req.params.id, userId });
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
};
