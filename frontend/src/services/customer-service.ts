import apiClient from '../lib/api-client';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'active' | 'inactive' | 'lead';
  source?: string;
  notes?: string;
  tags?: string[];
  lastOrderDate?: string;
  totalSpent?: number;
  orderCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'active' | 'inactive' | 'lead';
  source?: string;
  notes?: string;
  tags?: string[];
}

export const customerService = {
  getCustomers: async (): Promise<Customer[]> => {
    try {
      const response = await apiClient.get<Customer[]>('/data/customers');
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  getCustomerById: async (id: string): Promise<Customer> => {
    try {
      const response = await apiClient.get<Customer>(`/data/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      throw error;
    }
  },

  createCustomer: async (customer: CustomerInput): Promise<Customer> => {
    try {
      const response = await apiClient.post<Customer>('/data/customers', customer);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  updateCustomer: async (id: string, customer: Partial<CustomerInput>): Promise<Customer> => {
    try {
      const response = await apiClient.put<Customer>(`/data/customers/${id}`, customer);
      return response.data;
    } catch (error) {
      console.error(`Error updating customer ${id}:`, error);
      throw error;
    }
  },

  deleteCustomer: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/data/customers/${id}`);
    } catch (error) {
      console.error(`Error deleting customer ${id}:`, error);
      throw error;
    }
  },
  
  searchCustomers: async (query: string): Promise<Customer[]> => {
    try {
      const response = await apiClient.get<Customer[]>(`/data/customers/search?q=${query}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching customers with query '${query}':`, error);
      throw error;
    }
  }
}; 