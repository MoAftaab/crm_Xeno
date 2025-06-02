import apiClient from '../lib/api-client';

export interface ImportResult {
  success: boolean;
  totalRows: number;
  importedRows: number;
  errors?: {
    row: number;
    message: string;
  }[];
}

export const dataService = {
  importCustomers: async (file: File): Promise<ImportResult> => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await apiClient.post<ImportResult>('/data/import/customers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error importing customers:', error);
      throw error;
    }
  },
  
  importOrders: async (file: File): Promise<ImportResult> => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await apiClient.post<ImportResult>('/data/import/orders', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error importing orders:', error);
      throw error;
    }
  },
  
  getCustomerSampleData: async (): Promise<string> => {
    try {
      const response = await apiClient.get('/data/samples/customer', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      return url;
    } catch (error) {
      console.error('Error getting customer sample data:', error);
      throw error;
    }
  },
  
  getOrderSampleData: async (): Promise<string> => {
    try {
      const response = await apiClient.get('/data/samples/order', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      return url;
    } catch (error) {
      console.error('Error getting order sample data:', error);
      throw error;
    }
  },
  
  exportCustomers: async (): Promise<Blob> => {
    try {
      const response = await apiClient.get('/data/export/customers', {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting customers:', error);
      throw error;
    }
  },
  
  exportOrders: async (): Promise<Blob> => {
    try {
      const response = await apiClient.get('/data/export/orders', {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting orders:', error);
      throw error;
    }
  }
}; 