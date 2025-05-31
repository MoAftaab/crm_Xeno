import { Request, Response } from 'express';
import Customer, { ICustomer } from '../models/Customer';

// Get all customers
export const getCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const customers = await Customer.find().sort({ created_at: -1 });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error });
  }
};

// Get single customer by ID
export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }
    
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error });
  }
};

// Create new customer
export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone } = req.body;
    
    // Check if customer with email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      res.status(400).json({ message: 'Customer with this email already exists' });
      return;
    }
    
    const customer = new Customer({
      name,
      email,
      phone,
      created_at: new Date(),
      last_active: new Date(),
      total_spend: 0,
      visit_count: 1
    });
    
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer', error });
  }
};

// Update customer
export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }
    
    const { name, email, phone } = req.body;
    
    // If email is being changed, check if new email is already in use
    if (email && email !== customer.email) {
      const existingCustomer = await Customer.findOne({ email });
      if (existingCustomer) {
        res.status(400).json({ message: 'Email already in use by another customer' });
        return;
      }
    }
    
    customer.name = name || customer.name;
    customer.email = email || customer.email;
    customer.phone = phone || customer.phone;
    customer.last_active = new Date();
    
    await customer.save();
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error });
  }
};

// Delete customer
export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      res.status(404).json({ message: 'Customer not found' });
      return;
    }
    
    await Customer.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error });
  }
}; 