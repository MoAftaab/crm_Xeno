'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Plus, 
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Mail,
  Phone,
  Building,
  Calendar,
  Loader2,
  UserPlus,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDataExport } from '@/hooks/useDataExport';
import { useCustomers } from '@/hooks/useCustomers';
import toast from 'react-hot-toast';

// Customer interface for type safety
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  lastOrder: string;
  totalSpend: string;
  orders: number;
  source: string;
  [key: string]: any; // Index signature to allow string indexing
}

// Mock customer data that mixes with imported data
const mockCustomers: Customer[] = [
  { 
    id: '1', 
    name: 'John Doe', 
    email: 'john.doe@example.com', 
    phone: '+1 (555) 123-4567',
    company: 'Acme Inc.', 
    status: 'active',
    lastOrder: '2025-05-15',
    totalSpend: '$1,245.00',
    orders: 8,
    source: 'mock'
  },
  { 
    id: '2', 
    name: 'Sarah Wilson', 
    email: 'sarah.wilson@example.com', 
    phone: '+1 (555) 987-6543',
    company: 'XYZ Corp', 
    status: 'active',
    lastOrder: '2025-05-25',
    totalSpend: '$3,782.50',
    orders: 12,
    source: 'mock'
  },
  { 
    id: '3', 
    name: 'Michael Brown', 
    email: 'michael.brown@example.com', 
    phone: '+1 (555) 456-7890',
    company: 'Tech Solutions', 
    status: 'inactive',
    lastOrder: '2025-04-22',
    totalSpend: '$567.25',
    orders: 3,
    source: 'mock'
  },
  { 
    id: '4', 
    name: 'Emily Johnson', 
    email: 'emily.johnson@example.com', 
    phone: '+1 (555) 234-5678',
    company: 'Global Industries', 
    status: 'active',
    lastOrder: '2025-06-01',
    totalSpend: '$2,198.75',
    orders: 7,
    source: 'mock'
  },
  { 
    id: '5', 
    name: 'David Lee', 
    email: 'david.lee@example.com', 
    phone: '+1 (555) 876-5432',
    company: 'Innovative Designs', 
    status: 'pending',
    lastOrder: '2025-05-21',
    totalSpend: '$845.00',
    orders: 4,
    source: 'mock'
  },
  { 
    id: '6', 
    name: 'Maria Garcia', 
    email: 'maria.garcia@example.com', 
    phone: '+1 (555) 789-0123',
    company: 'Style Boutique', 
    status: 'active',
    lastOrder: '2025-05-29',
    totalSpend: '$1,875.50',
    orders: 9,
    source: 'mock'
  },
  { 
    id: '7', 
    name: 'James Smith', 
    email: 'james.smith@example.com', 
    phone: '+1 (555) 345-6789',
    company: 'Fitness First', 
    status: 'active',
    lastOrder: '2025-05-18',
    totalSpend: '$3,450.25',
    orders: 15,
    source: 'mock'
  },
  { 
    id: '8', 
    name: 'Patricia Miller', 
    email: 'patricia.miller@example.com', 
    phone: '+1 (555) 654-3210',
    company: 'Home Decor Co.', 
    status: 'inactive',
    lastOrder: '2025-03-12',
    totalSpend: '$782.50',
    orders: 5,
    source: 'mock'
  },
  { 
    id: '9', 
    name: 'Robert Taylor', 
    email: 'robert.taylor@example.com', 
    phone: '+1 (555) 321-7654',
    company: 'Auto Parts Inc.', 
    status: 'active',
    lastOrder: '2025-05-27',
    totalSpend: '$2,567.00',
    orders: 11,
    source: 'mock'
  },
  { 
    id: '10', 
    name: 'Jennifer White', 
    email: 'jennifer.white@example.com', 
    phone: '+1 (555) 987-1234',
    company: 'Beauty Essentials', 
    status: 'pending',
    lastOrder: '2025-05-31',
    totalSpend: '$1,120.75',
    orders: 6,
    source: 'import-csv'
  },
];

export default function CustomersPage() {
  const router = useRouter();
  const { exportCustomers } = useDataExport();
  const { getCustomers, createCustomer, deleteCustomer } = useCustomers();
  const customersQuery = getCustomers();
  
  // Always show mock data mixed with API data
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  
  // Update customers when API data is loaded
  useEffect(() => {
    if (customersQuery.data) {
      // Combine API data with mock data (marked as 'import-csv')
      const apiData = customersQuery.data.map(customer => ({
        ...customer,
        source: 'import-csv'
      }));
      
      // Filter out duplicate emails (prefer API data over mock)
      const apiEmails = new Set(apiData.map(c => c.email));
      const filteredMockData = mockCustomers.filter(c => !apiEmails.has(c.email));
      
      setCustomers([...filteredMockData, ...apiData]);
    }
  }, [customersQuery.data]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'active' as const,
  });
  const [customers, setCustomers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // Create mutation
  const createCustomerMutation = createCustomer();
  // Delete mutation
  const deleteCustomerMutation = deleteCustomer();
  
  // Load customers from API
  useEffect(() => {
    if (customersQuery.data) {
      setCustomers(customersQuery.data);
    } else if (customersQuery.error) {
      toast.error('Failed to load customers. Using fallback data.');
      setCustomers(fallbackCustomers);
    }
  }, [customersQuery.data, customersQuery.error]);
  
  // Status options
  const statusOptions = ['active', 'inactive', 'pending', 'all'];

  // Handle status filter change
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status === 'all' ? null : status);
    setShowStatusDropdown(false);
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  // Handle sort change
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Apply filters, search, and sorting
  const filteredCustomers = customers.filter(customer => {
    // Apply status filter if selected
    if (selectedStatus && customer.status !== selectedStatus) return false;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (customer.name?.toLowerCase() || '').includes(query) ||
        (customer.email?.toLowerCase() || '').includes(query) ||
        (customer.company?.toLowerCase() || '').includes(query) ||
        (customer.phone?.toLowerCase() || '').includes(query)
      );
    }
    
    return true;
  }).sort((a, b) => {
    // Apply sorting
    const fieldA = a[sortField] || '';
    const fieldB = b[sortField] || '';
    
    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return sortDirection === 'asc' 
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    }
    
    return sortDirection === 'asc' ? (fieldA - fieldB) : (fieldB - fieldA);
  });
  
  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const fieldA = a[sortField as keyof typeof a];
    const fieldB = b[sortField as keyof typeof b];
    
    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      if (sortDirection === 'asc') {
        return fieldA.localeCompare(fieldB);
      } else {
        return fieldB.localeCompare(fieldA);
      }
    }
    
    return 0;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCustomers.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination handlers
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const handleExport = () => {
    exportCustomers.mutate();
  };

  const handleImport = () => {
    router.push('/dashboard/import?from=customers&type=customers');
  };

  const handleAddCustomer = () => {
    setShowAddModal(true);
  };

  const handleSaveCustomer = () => {
    // Validate the form
    if (!newCustomer.name || !newCustomer.email) {
      toast.error('Name and email are required');
      return;
    }
    
    // Use the create customer mutation
    createCustomerMutation.mutate(newCustomer, {
      onSuccess: () => {
        toast.success('Customer created successfully');
        // Clear the form and close the modal
        setShowAddModal(false);
        setNewCustomer({
          name: '',
          email: '',
          phone: '',
          company: '',
          status: 'active' as const,
        });
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Failed to create customer');
      }
    });
  };

  return (
    <div className="space-y-6 text-[#141414]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#141414]">Customers</h1>
          <p className="text-sm text-[#737373] mt-1">Manage and view your customer database</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            onClick={handleAddCustomer}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Customer
          </button>
          <button 
            className="bg-white hover:bg-[#f3f3f3] text-[#141414] px-4 py-2 rounded-lg transition-colors flex items-center border border-[#dbdbdb]"
            onClick={handleImport}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </button>
          <button 
            className="bg-white hover:bg-[#f3f3f3] text-[#141414] px-4 py-2 rounded-lg transition-colors flex items-center border border-[#dbdbdb]"
            onClick={handleExport}
            disabled={exportCustomers.isLoading}
          >
            {exportCustomers.isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#737373]" />
          </div>
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#dbdbdb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#141414] focus:border-transparent transition-all duration-300 text-[#141414]"
          />
        </div>
        
        <div className="relative">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#dbdbdb] rounded-lg hover:bg-[#f3f3f3] transition-colors text-[#141414]"
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          >
            <Filter className="h-4 w-4" />
            <span>Status: {selectedStatus || 'All'}</span>
            {showStatusDropdown ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {showStatusDropdown && (
            <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white border border-[#dbdbdb] overflow-hidden">
              <div className="py-1">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`w-full text-left px-4 py-2 hover:bg-[#ededed] ${
                      (status === 'all' && selectedStatus === null) || status === selectedStatus
                        ? 'bg-[#ededed] text-[#141414]'
                        : 'text-[#737373]'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Customers Table */}
      <div className="bg-white border border-[#dbdbdb] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#ededed]">
                <th className="px-4 py-3 text-left">
                  <button 
                    className="flex items-center text-xs font-medium text-[#141414] uppercase tracking-wider hover:text-black"
                    onClick={() => handleSort('name')}
                  >
                    Customer
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button 
                    className="flex items-center text-xs font-medium text-[#141414] uppercase tracking-wider hover:text-black"
                    onClick={() => handleSort('company')}
                  >
                    Company
                    {sortField === 'company' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button 
                    className="flex items-center text-xs font-medium text-[#141414] uppercase tracking-wider hover:text-black"
                    onClick={() => handleSort('status')}
                  >
                    Status
                    {sortField === 'status' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button 
                    className="flex items-center text-xs font-medium text-[#141414] uppercase tracking-wider hover:text-black"
                    onClick={() => handleSort('lastOrder')}
                  >
                    Last Order
                    {sortField === 'lastOrder' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button 
                    className="flex items-center text-xs font-medium text-[#141414] uppercase tracking-wider hover:text-black"
                    onClick={() => handleSort('totalSpend')}
                  >
                    Total Spend
                    {sortField === 'totalSpend' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <span className="text-xs font-medium text-[#141414] uppercase tracking-wider">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dbdbdb]">
              {currentItems.map((customer) => (
                <tr key={customer.id} className="hover:bg-[#ededed] transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-[#ededed] flex items-center justify-center text-[#141414] font-medium">
                        {customer.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="font-medium text-[#141414]">{customer.name}</div>
                        <div className="text-sm text-[#737373] flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {customer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 text-[#737373] mr-2" />
                      <span className="text-[#737373]">{customer.company}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.status === 'active' ? 'bg-purple-900 text-white border border-purple-600' : 
                      customer.status === 'inactive' ? 'bg-gray-800 text-white border border-gray-600' : 
                      customer.status === 'pending' ? 'bg-orange-900 text-white border border-orange-600' :
                      'bg-pink-900 text-white border border-pink-600'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center text-[#737373]">
                      <Calendar className="w-4 h-4 text-[#737373] mr-2" />
                      {customer.lastOrder}
                    </div>
                  </td>
                  <td className="px-4 py-4 font-medium text-[#141414]">{customer.totalSpend}</td>
                  <td className="px-4 py-4 text-right">
                    <button className="p-2 text-[#737373] hover:text-[#141414] hover:bg-[#ededed] rounded-lg transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 bg-[#ededed] border-t border-[#dbdbdb] flex items-center justify-between">
          <div className="text-sm text-[#737373]">
            Showing <span className="font-medium text-[#141414]">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedCustomers.length)}</span> of <span className="font-medium text-[#141414]">{sortedCustomers.length}</span> customers
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={goToPreviousPage} 
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1 
                  ? 'bg-[#ededed]/60 text-[#141414]' 
                  : 'bg-[#ededed] text-[#737373] hover:bg-[#dbdbdb] hover:text-[#141414]'
              } transition-colors`}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNumber = i + 1;
              return (
                <button 
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)} 
                  className={`px-3 py-1 rounded-md ${
                    pageNumber === currentPage 
                      ? 'bg-[#141414] text-white' 
                      : 'bg-[#ededed] text-[#737373] hover:bg-[#dbdbdb] hover:text-[#141414]'
                  } transition-colors`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button 
              onClick={goToNextPage} 
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages 
                  ? 'bg-[#ededed]/60 text-[#141414]' 
                  : 'bg-[#ededed] text-[#737373] hover:bg-[#dbdbdb] hover:text-[#141414]'
              } transition-colors`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white border border-[#dbdbdb] rounded-xl p-6 shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#141414]">Add New Customer</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-[#ededed]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#737373] mb-1">Name</label>
                <input 
                  type="text"
                  className="w-full px-3 py-2 bg-white border border-[#dbdbdb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#141414] text-[#141414]"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#737373] mb-1">Email</label>
                <input 
                  type="email"
                  className="w-full px-3 py-2 bg-white border border-[#dbdbdb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#141414] text-[#141414]"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#737373] mb-1">Phone</label>
                <input 
                  type="text"
                  className="w-full px-3 py-2 bg-white border border-[#dbdbdb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#141414] text-[#141414]"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#737373] mb-1">Company</label>
                <input 
                  type="text"
                  className="w-full px-3 py-2 bg-white border border-[#dbdbdb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#141414] text-[#141414]"
                  value={newCustomer.company}
                  onChange={(e) => setNewCustomer({...newCustomer, company: e.target.value})}
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 mr-2 border border-[#dbdbdb] rounded-lg hover:bg-[#ededed] transition-colors text-[#141414]"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleSaveCustomer();
                }}
                className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors"
              >
                Save Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 