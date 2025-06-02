import Customer from '../models/Customer';
import Order from '../models/Order';
import { Types } from 'mongoose';
import { CustomerCsvRow, OrderCsvRow } from '../interfaces/csv';

export async function processCustomerRow(row: CustomerCsvRow, userId: Types.ObjectId) {
  console.log('Processing customer row:', row);
  const { customer_external_id, name, email, phone, location } = row;

  // Build query based on available identifiers
  let query: any = { userId };
  if (customer_external_id) {
    query.externalId = customer_external_id;
  } else {
    query.email = email;
  }

  // Prepare customer data
  const customerData = {
    userId,
    name,
    email,
    phone: phone || undefined,
    location: location || undefined,
    externalId: customer_external_id || undefined,
    created_at: new Date(),
    last_active: new Date(),
    total_spend: 0,
    visit_count: 1
  };

  console.log('Customer data to save:', customerData);

  // Check if customer exists
  const existingCustomer = await Customer.findOne(query);
  if (existingCustomer) {
    // Update existing customer
    console.log('Updating existing customer:', existingCustomer._id);
    Object.assign(existingCustomer, customerData);
    return existingCustomer.save();
  } else {
    // If no external ID but email exists, update by email
    if (!customer_external_id) {
      const emailCheck = await Customer.findOne({ email, userId });
      if (emailCheck) {
        console.log('Found customer by email:', emailCheck._id);
        Object.assign(emailCheck, customerData);
        return emailCheck.save();
      }
    }
    // Create new customer
    console.log('Creating new customer');
    return Customer.create(customerData);
  }
}

// Cache to store customers for faster lookup during order processing
const customerCache = new Map<string, any>();

export async function processOrderRow(row: OrderCsvRow, userId: Types.ObjectId) {
  console.log('Processing order row:', row);
  const { order_external_id, customer_identifier, items_description, total_amount, order_date } = row;

  // Try to get customer from cache first
  let customer = customerCache.get(customer_identifier);
  console.log('Customer from cache:', customer ? `Found with ID ${customer._id}` : 'Not found in cache');

  // If not in cache, look up in database
  if (!customer) {
    console.log('Looking up customer in database by identifier:', customer_identifier);
    const foundCustomer = await Customer.findOne({
      userId,
      $or: [{ email: customer_identifier }, { externalId: customer_identifier }],
    });
    
    if (foundCustomer) {
      console.log('Found customer in database:', foundCustomer._id);
      customer = foundCustomer;
      // Add to cache for future lookups
      customerCache.set(customer_identifier, customer);
      
      // Also cache by email and externalId for alternative lookups
      if (customer.email && customer.email !== customer_identifier) {
        customerCache.set(customer.email, customer);
      }
      if (customer.externalId && customer.externalId !== customer_identifier) {
        customerCache.set(customer.externalId, customer);
      }
    } else {
      console.log('Customer not found in database with identifier:', customer_identifier);
    }
  }

  if (!customer) {
    console.log('Customer not found, skipping order');
    throw new Error(`Customer with identifier ${customer_identifier} not found`);
  }

  // Create order data
  const orderData = {
    userId,
    customerId: customer._id,
    items: items_description ? [items_description] : [],
    amount: parseFloat(total_amount),
    orderDate: new Date(order_date),
    externalId: order_external_id || undefined,
    status: 'pending'
  };

  // Create the order
  return Order.create(orderData);
}

export async function generateCustomerSample() {
  // Sample CSV content
  const headers = ['customer_external_id,name,email,phone,location'];
  const sampleData = [
    'CUST001,John Doe,john@example.com,1234567890,New York',
    'CUST002,Jane Smith,jane@example.com,9876543210,San Francisco',
    'CUST003,Bob Johnson,bob@example.com,5551234567,Chicago'
  ];
  
  return [...headers, ...sampleData].join('\n');
}

export async function generateOrderSample() {
  // Sample CSV content
  const headers = ['order_external_id,customer_identifier,items_description,total_amount,order_date'];
  const sampleData = [
    'ORDER001,john@example.com,"Product A, Product B",150.00,2025-05-01',
    'ORDER002,CUST002,"Service X",75.50,2025-05-15',
    'ORDER003,bob@example.com,"Product C",200.00,2025-05-20'
  ];
  
  return [...headers, ...sampleData].join('\n');
}

/**
 * Validates customer data from CSV row
 * @param row The customer data row from CSV
 * @returns Object with validation result and optional error message
 */
export function validateCustomerRow(row: CustomerCsvRow): { valid: boolean; error?: string } {
  // Check required fields
  if (!row.name || row.name.trim() === '') {
    return { valid: false, error: 'Name is required' };
  }
  
  if (!row.email || row.email.trim() === '') {
    return { valid: false, error: 'Email is required' };
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(row.email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  // Validate phone format if provided
  if (row.phone) {
    const phoneRegex = /^\+?[0-9\s\-\(\)]+$/;
    if (!phoneRegex.test(row.phone)) {
      return { valid: false, error: 'Invalid phone number format' };
    }
  }
  
  return { valid: true };
}

/**
 * Validates order data from CSV row
 * @param row The order data row from CSV
 * @returns Object with validation result and optional error message
 */
export function validateOrderRow(row: OrderCsvRow): { valid: boolean; error?: string } {
  // Check required fields
  if (!row.customer_identifier || row.customer_identifier.trim() === '') {
    return { valid: false, error: 'Customer identifier is required' };
  }
  
  if (!row.total_amount || row.total_amount.trim() === '') {
    return { valid: false, error: 'Total amount is required' };
  }
  
  // Validate amount format
  const amountRegex = /^\d+(\.\d{1,2})?$/;
  if (!amountRegex.test(row.total_amount)) {
    return { valid: false, error: 'Invalid amount format (must be a number with up to 2 decimal places)' };
  }
  
  // Validate date format
  if (!row.order_date || row.order_date.trim() === '') {
    return { valid: false, error: 'Order date is required' };
  }
  
  // Basic date validation (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(row.order_date)) {
    return { valid: false, error: 'Invalid date format (use YYYY-MM-DD)' };
  }
  
  // Check if date is valid
  const date = new Date(row.order_date);
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date' };
  }
  
  return { valid: true };
}
