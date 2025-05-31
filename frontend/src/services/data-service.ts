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
    
    const response = await apiClient.post<ImportResult>('/data/import/customers', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  },
  
  importOrders: async (file: File): Promise<ImportResult> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<ImportResult>('/data/import/orders', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  },
  
  getCustomerSampleData: async (): Promise<string> => {
    const response = await apiClient.get('/data/samples/customer', {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    return url;
  },
  
  getOrderSampleData: async (): Promise<string> => {
    const response = await apiClient.get('/data/samples/order', {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    return url;
  }
}; 