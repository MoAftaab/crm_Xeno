import { useQuery, useMutation, useQueryClient } from 'react-query';
import { orderService, Order, OrderInput } from '../services/order-service';

export const useOrders = () => {
  const queryClient = useQueryClient();

  // Get all orders
  const getOrders = () => {
    return useQuery('orders', orderService.getOrders);
  };

  // Get order by ID
  const getOrderById = (id: string) => {
    return useQuery(['order', id], () => orderService.getOrderById(id), {
      enabled: !!id, // Only run if id is provided
    });
  };

  // Create order
  const createOrder = () => {
    return useMutation((newOrder: OrderInput) => orderService.createOrder(newOrder), {
      onSuccess: () => {
        // Invalidate and refetch orders list
        queryClient.invalidateQueries('orders');
      },
    });
  };

  // Update order
  const updateOrder = () => {
    return useMutation(
      ({ id, data }: { id: string; data: Partial<OrderInput> }) => 
        orderService.updateOrder(id, data),
      {
        onSuccess: (data) => {
          // Update cache for specific order and order list
          queryClient.invalidateQueries('orders');
          queryClient.invalidateQueries(['order', data.id]);
        },
      }
    );
  };

  // Delete order
  const deleteOrder = () => {
    return useMutation((id: string) => orderService.deleteOrder(id), {
      onSuccess: () => {
        // Invalidate and refetch orders list
        queryClient.invalidateQueries('orders');
      },
    });
  };

  // Search orders
  const searchOrders = (query: string) => {
    return useQuery(['orders', 'search', query], () => {
      // For now, we'll just filter the cached orders
      // In a real app, you'd likely have a dedicated search endpoint
      return queryClient.getQueryData<Order[]>('orders')?.filter(order => 
        order.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(query.toLowerCase())
      ) || [];
    }, {
      // Only run this query if we have orders in the cache
      enabled: !!queryClient.getQueryData('orders') && query.length > 0,
    });
  };

  return {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    searchOrders,
  };
};
