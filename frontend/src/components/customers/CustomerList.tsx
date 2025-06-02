import React from 'react';
import { Customer } from '@/services/customer-service';
import { MoreHorizontal, Mail, Phone } from 'lucide-react';

interface CustomerListProps {
  customers?: Customer[];
  segmentId?: string;
  isLoading?: boolean;
  emptyMessage?: string;
}

import { useSegments } from '@/hooks/useSegments';

const CustomerList = ({ 
  customers: propCustomers, 
  segmentId,
  isLoading: propIsLoading = false, 
  emptyMessage = "No customers found" 
}: CustomerListProps) => {
  // If segmentId is provided, fetch customers for that segment
  const { getCustomersInSegment } = useSegments();
  const segmentCustomersQuery = segmentId ? getCustomersInSegment(segmentId) : null;
  
  // Use provided customers or ones from the query
  const customers = propCustomers || (segmentCustomersQuery?.data || []);
  const isLoading = propIsLoading || (segmentId && segmentCustomersQuery?.isLoading);
  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Last Order
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-white">{customer.name}</div>
                    <div className="text-sm text-gray-400">{customer.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center text-sm text-gray-300">
                    <Mail className="h-4 w-4 mr-2" /> {customer.email}
                  </div>
                  {customer.phone && (
                    <div className="flex items-center text-sm text-gray-300">
                      <Phone className="h-4 w-4 mr-2" /> {customer.phone}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'Never'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-gray-400 hover:text-white">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
