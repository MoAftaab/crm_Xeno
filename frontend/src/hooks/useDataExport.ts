import { useMutation } from 'react-query';
import { dataService } from '../services/data-service';
import { toast } from 'react-hot-toast';

export const useDataExport = () => {
  // Export customers to CSV
  const exportCustomers = useMutation(
    () => dataService.exportCustomers(),
    {
      onSuccess: () => {
        toast.success('Customers exported successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to export customers');
      }
    }
  );
  
  // Export orders to CSV
  const exportOrders = useMutation(
    () => dataService.exportOrders(),
    {
      onSuccess: () => {
        toast.success('Orders exported successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to export orders');
      }
    }
  );
  
  return {
    exportCustomers,
    exportOrders
  };
}; 
 