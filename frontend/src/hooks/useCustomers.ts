import { useQuery, useMutation, useQueryClient } from 'react-query';
import { customerService, Customer, CustomerInput } from '../services/customer-service';

export const useCustomers = () => {
  const queryClient = useQueryClient();

  // Get all customers
  const getCustomers = () => {
    return useQuery('customers', customerService.getCustomers);
  };

  // Get customer by ID
  const getCustomerById = (id: string) => {
    return useQuery(['customer', id], () => customerService.getCustomerById(id), {
      enabled: !!id, // Only run if id is provided
    });
  };

  // Create customer
  const createCustomer = () => {
    return useMutation((newCustomer: CustomerInput) => customerService.createCustomer(newCustomer), {
      onSuccess: () => {
        // Invalidate and refetch customers list
        queryClient.invalidateQueries('customers');
      },
    });
  };

  // Update customer
  const updateCustomer = () => {
    return useMutation(
      ({ id, data }: { id: string; data: Partial<CustomerInput> }) => 
        customerService.updateCustomer(id, data),
      {
        onSuccess: (data) => {
          // Update cache for specific customer and customer list
          queryClient.invalidateQueries('customers');
          queryClient.invalidateQueries(['customer', data.id]);
        },
      }
    );
  };

  // Delete customer
  const deleteCustomer = () => {
    return useMutation((id: string) => customerService.deleteCustomer(id), {
      onSuccess: () => {
        // Invalidate and refetch customers list
        queryClient.invalidateQueries('customers');
      },
    });
  };

  // Search customers
  const searchCustomers = (query: string) => {
    return useQuery(['customers', 'search', query], 
      () => customerService.searchCustomers(query), {
        enabled: query.length > 2, // Only search if query is at least 3 characters
        keepPreviousData: true,
      }
    );
  };

  return {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
  };
}; 