import apiClient from '../lib/api-client';

export interface Order {
  id: string;
  customerId: string;
  customerName?: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  items?: OrderItem[];
  externalId?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderInput {
  customerId: string;
  orderNumber?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  totalAmount: number;
  items?: Omit<OrderItem, 'id'>[];
  externalId?: string;
}

export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    try {
      const response = await apiClient.get<Order[]>('/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  getOrderById: async (id: string): Promise<Order> => {
    try {
      const response = await apiClient.get<Order>(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  },

  createOrder: async (orderData: OrderInput): Promise<Order> => {
    try {
      const response = await apiClient.post<Order>('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  updateOrder: async (id: string, orderData: Partial<OrderInput>): Promise<Order> => {
    try {
      const response = await apiClient.put<Order>(`/orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${id}:`, error);
      throw error;
    }
  },

  deleteOrder: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/orders/${id}`);
    } catch (error) {
      console.error(`Error deleting order ${id}:`, error);
      throw error;
    }
  },

  // Additional methods can be added here as needed
};
