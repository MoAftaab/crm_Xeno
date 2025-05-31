'use client';

import { useState, useEffect } from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Sparkles, Users, Search, ChevronRight, LogOut } from 'lucide-react';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const router = useRouter();
  const { getCustomers, searchCustomers } = useCustomers();
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);
  
  // Use the appropriate query based on search state
  const customersQuery = searchQuery.length > 2 
    ? searchCustomers(searchQuery)
    : getCustomers();

  // If user is not authenticated, don't render the dashboard
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative mr-3">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-lg opacity-75"></div>
                <div className="relative w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <h1 className="text-xl font-bold">EnhancedCRM</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">Welcome, {user.name}</div>
              <button 
                onClick={logout}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Customer Management</h2>
          
          {/* Search and Actions */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg shadow-lg shadow-purple-900/30 transition-all duration-300 flex items-center"
            >
              <Users className="w-5 h-5 mr-2" />
              Add Customer
            </button>
          </div>
          
          {/* Customers Table */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
            {customersQuery.isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-t-blue-500 border-r-purple-500 border-b-cyan-500 border-l-transparent animate-spin"></div>
                </div>
              </div>
            ) : customersQuery.isError ? (
              <div className="p-8 text-center text-red-400">
                <p>Error loading customers. Please try again.</p>
              </div>
            ) : (customersQuery.data?.length || 0) === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <p>No customers found. Add your first customer to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800/50 border-b border-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Company</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {customersQuery.data?.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{customer.name}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{customer.email}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            customer.status === 'active' ? 'bg-green-900/30 text-green-400' : 
                            customer.status === 'inactive' ? 'bg-gray-800 text-gray-400' : 
                            'bg-blue-900/30 text-blue-400'
                          }`}>
                            {customer.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{customer.company || '-'}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                          <button className="text-blue-500 hover:text-blue-400 focus:outline-none">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 