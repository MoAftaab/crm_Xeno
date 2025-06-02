import { Response, Request } from '../types/express';
import { AuthenticatedRequest } from '../interfaces/interfaces';
import Customer from '../models/Customer';
import { Types } from 'mongoose';

/**
 * Create a new customer
 */
export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, phone, address, tags, externalId } = req.body;
    const userId = req.body.userId; // This should be provided in the request body for public route

    if (!userId) {
      res.status(400).json({ message: 'User ID is required' });
      return;
    }

    // Check if customer with same email already exists for this user
    const existingCustomer = await Customer.findOne({ email, userId });
    if (existingCustomer) {
      res.status(400).json({ message: 'Customer with this email already exists' });
      return;
    }

    const customer = await Customer.create({
      firstName,
      lastName,
      email,
      phone,
      address,
      tags: tags || [],
      externalId,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating customer',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCustomers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const customers = await Customer.find({ userId });
    res.json(customers);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching customers',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCustomerById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const customer = await Customer.findOne({ 
      _id: new Types.ObjectId(id), 
      userId: new Types.ObjectId(userId) 
    });
    
    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching customer',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateCustomer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const updates = req.body;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const customer = await Customer.findOneAndUpdate(
      { 
        _id: new Types.ObjectId(id), 
        userId: new Types.ObjectId(userId) 
      },
      updates,
      { new: true }
    );

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating customer',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Search customers by query string
 */
export const searchCustomers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const query = req.query.q as string;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!query || query.length < 2) {
      res.status(400).json({ message: 'Search query must be at least 2 characters' });
      return;
    }

    const searchRegex = new RegExp(query, 'i');

    const customers = await Customer.find({
      userId,
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { 'address.city': searchRegex },
        { 'address.country': searchRegex },
        { tags: searchRegex }
      ]
    }).sort({ createdAt: -1 });

    res.json(customers);
  } catch (error) {
    console.error('Error searching customers:', error);
    res.status(500).json({
      message: 'Error searching customers',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Delete a customer
 */
export const deleteCustomer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const customer = await Customer.findOneAndDelete({ 
      _id: new Types.ObjectId(id), 
      userId: new Types.ObjectId(userId) 
    });

    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting customer',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
