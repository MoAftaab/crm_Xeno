import { useMutation, useQuery, useQueryClient } from 'react-query';
import { dataService } from '../services/data-service';

export const useDataImport = () => {
  const queryClient = useQueryClient();
  
  // Import customers from CSV
  const importCustomers = useMutation(
    (file: File) => dataService.importCustomers(file),
    {
      onSuccess: () => {
        // Invalidate customer data queries
        queryClient.invalidateQueries('customers');
      }
    }
  );
  
  // Import orders from CSV
  const importOrders = useMutation(
    (file: File) => dataService.importOrders(file),
    {
      onSuccess: () => {
        // Invalidate any relevant queries
        queryClient.invalidateQueries('orders');
      }
    }
  );
  
  // Get customer sample data
  const getCustomerSample = () => {
    return useQuery('customerSample', dataService.getCustomerSampleData, {
      enabled: false, // Only run when explicitly requested
      cacheTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
  };
  
  // Get order sample data
  const getOrderSample = () => {
    return useQuery('orderSample', dataService.getOrderSampleData, {
      enabled: false, // Only run when explicitly requested
      cacheTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
  };
  
  return {
    importCustomers,
    importOrders,
    getCustomerSample,
    getOrderSample,
  };
}; 