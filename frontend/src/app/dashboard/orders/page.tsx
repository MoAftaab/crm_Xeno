'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingCart,
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  Calendar,
  Tag,
  DollarSign,
  Package,
  Truck,
  CheckCircle,
  Clock,
  ChevronRight,
  Upload,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDataExport } from '@/hooks/useDataExport';
import { useOrders } from '@/hooks/useOrders';
import toast from 'react-hot-toast';

// Order interface for type safety
interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: string;
  total: string;
  items: number;
  paymentMethod: string;
  source: string;
  [key: string]: any; // Index signature to allow string indexing
}

// Mock orders data that mixes with imported data
const mockOrders: Order[] = [
  { 
    id: 'ORD-2025-001', 
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    date: '2025-05-15',
    status: 'delivered',
    total: '$245.00',
    items: 3,
    paymentMethod: 'Credit Card',
    source: 'mock'
  },
  { 
    id: 'ORD-2025-002', 
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@example.com',
    date: '2025-05-28',
    status: 'processing',
    total: '$782.50',
    items: 5,
    paymentMethod: 'PayPal',
    source: 'mock'
  },
  { 
    id: 'ORD-2025-003', 
    customerName: 'Michael Brown',
    customerEmail: 'michael.brown@example.com',
    date: '2025-05-20',
    status: 'shipped',
    total: '$67.25',
    items: 1,
    paymentMethod: 'Credit Card',
    source: 'mock'
  },
  { 
    id: 'ORD-2025-004', 
    customerName: 'Emily Johnson',
    customerEmail: 'emily.johnson@example.com',
    date: '2025-06-01',
    status: 'delivered',
    total: '$198.75',
    items: 2,
    paymentMethod: 'Store Credit',
    source: 'mock'
  },
  { 
    id: 'ORD-2025-005', 
    customerName: 'David Lee',
    customerEmail: 'david.lee@example.com',
    date: '2025-05-25',
    status: 'cancelled',
    total: '$45.00',
    items: 1,
    paymentMethod: 'PayPal',
    source: 'mock'
  },
  { 
    id: 'ORD-2025-006', 
    customerName: 'Maria Garcia',
    customerEmail: 'maria.garcia@example.com',
    date: '2025-05-29',
    status: 'delivered',
    total: '$175.50',
    items: 3,
    paymentMethod: 'Credit Card',
    source: 'mock'
  },
  { 
    id: 'ORD-2025-007', 
    customerName: 'James Smith',
    customerEmail: 'james.smith@example.com',
    date: '2025-05-18',
    status: 'processing',
    total: '$350.25',
    items: 4,
    paymentMethod: 'PayPal',
    source: 'mock'
  },
  { 
    id: 'ORD-2025-008', 
    customerName: 'Patricia Miller',
    customerEmail: 'patricia.miller@example.com',
    date: '2025-05-27',
    status: 'shipped',
    total: '$82.50',
    items: 1,
    paymentMethod: 'Credit Card',
    source: 'mock'
  },
  { 
    id: 'ORD-2025-009', 
    customerName: 'Robert Taylor',
    customerEmail: 'robert.taylor@example.com',
    date: '2025-05-30',
    status: 'delivered',
    total: '$567.00',
    items: 6,
    paymentMethod: 'Store Credit',
    source: 'mock'
  },
  { 
    id: 'ORD-2025-010', 
    customerName: 'Jennifer White',
    customerEmail: 'jennifer.white@example.com',
    date: '2025-05-31',
    status: 'processing',
    total: '$120.75',
    items: 2,
    paymentMethod: 'PayPal',
    source: 'import-csv'
  },
];

export default function OrdersPage() {
  const router = useRouter();
  const { exportOrders } = useDataExport();
  const { getOrders } = useOrders();
  const ordersQuery = getOrders();
  
  // Always show mock data mixed with API data
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  
  // Update orders when API data is loaded
  useEffect(() => {
    if (ordersQuery.data) {
      // Combine API data with mock data (marked as 'import-csv')
      const apiData = ordersQuery.data.map(order => ({
        ...order,
        source: 'import-csv'
      }));
      
      // Filter out duplicate order IDs (prefer API data over mock)
      const apiIds = new Set(apiData.map(o => o.id));
      const filteredMockData = mockOrders.filter(o => !apiIds.has(o.id));
      
      // Cast to Order[] to ensure type safety
      setOrders([...filteredMockData, ...apiData] as Order[]);
    }
  }, [ordersQuery.data]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  
  // Handle sort change
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      // Apply status filter
      if (selectedStatus && order.status !== selectedStatus) return false;
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          (order.id?.toLowerCase() || '').includes(query) ||
          (order.customerName?.toLowerCase() || '').includes(query) ||
          (order.customerEmail?.toLowerCase() || '').includes(query)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by date in descending order by default
      if (sortField === 'date') {
        const dateA = new Date(a.date || '').getTime();
        const dateB = new Date(b.date || '').getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      // For other fields, sort as strings
      const aValue = String(a[sortField] || '');
      const bValue = String(b[sortField] || '');
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    });

  const handleExport = () => {
    exportOrders.mutate();
  };

  const handleImport = () => {
    router.push('/dashboard/import?from=orders&type=orders');
  };

  return (
    <div className="space-y-6 text-[#141414]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#141414]">Orders</h1>
          <p className="text-sm text-[#737373] mt-1">Manage and view customer orders</p>
        </div>
        <div className="flex flex-wrap gap-3">
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
            disabled={exportOrders.isLoading}
          >
            {exportOrders.isLoading ? (
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
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#dbdbdb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#141414] focus:border-transparent transition-all duration-300 text-[#141414]"
          />
        </div>
        
        <div className="relative">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#dbdbdb] rounded-lg hover:bg-[#f3f3f3] transition-colors text-[#141414]"
          >
            <Filter className="h-4 w-4" />
            <span>Status</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          {/* Dropdown would go here in a real implementation */}
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-white border border-[#dbdbdb] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#ededed]">
                <th className="px-4 py-3 text-left">
                  <button 
                    className="flex items-center text-xs font-medium text-[#141414] uppercase tracking-wider hover:text-black"
                    onClick={() => handleSort('id')}
                  >
                    Order ID
                    {sortField === 'id' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button 
                    className="flex items-center text-xs font-medium text-[#141414] uppercase tracking-wider hover:text-black"
                    onClick={() => handleSort('customerName')}
                  >
                    Customer
                    {sortField === 'customerName' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button 
                    className="flex items-center text-xs font-medium text-[#141414] uppercase tracking-wider hover:text-black"
                    onClick={() => handleSort('date')}
                  >
                    Date
                    {sortField === 'date' && (
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
                    onClick={() => handleSort('total')}
                  >
                    Total
                    {sortField === 'total' && (
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
              {filteredOrders.map((order: Order) => (
                <tr key={order.id} className="hover:bg-[#f3f3f3] transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-[#ededed] text-[#141414] border border-[#dbdbdb]">
                        <ShoppingCart size={16} />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">{order.id}</div>
                        <div className="text-xs text-[#737373] mt-1">{order.items} items</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-xs text-[#737373]">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center text-[#737373]">
                      <Calendar className="w-4 h-4 text-[#141414] mr-2" />
                      {order.date}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit ${
                      order.status === 'delivered' ? 'bg-[#ededed] text-[#141414] border border-[#dbdbdb]' : 
                      order.status === 'shipped' ? 'bg-[#ededed] text-[#141414] border border-[#dbdbdb]' : 
                      order.status === 'processing' ? 'bg-[#ededed] text-[#141414] border border-[#dbdbdb]' : 
                      'bg-[#ededed] text-[#141414] border border-[#dbdbdb]'
                    }`}>
                      {order.status === 'delivered' && <CheckCircle size={12} className="mr-1" />}
                      {order.status === 'shipped' && <Truck size={12} className="mr-1" />}
                      {order.status === 'processing' && <Clock size={12} className="mr-1" />}
                      {order.status === 'cancelled' && <Tag size={12} className="mr-1" />}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center font-medium">
                      <DollarSign className="w-4 h-4 text-[#141414] mr-1" />
                      {order.total}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="p-2 text-[#141414] hover:text-[#737373] hover:bg-[#f3f3f3] rounded-lg transition-colors">
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
            Showing <span className="font-medium text-[#141414]">{filteredOrders.length}</span> of <span className="font-medium text-[#141414]">{orders.length}</span> orders
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 rounded-md bg-[#ededed] text-[#141414] hover:bg-[#f3f3f3] hover:text-[#737373] transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 rounded-md bg-[#ededed] text-[#141414]">
              1
            </button>
            <button className="px-3 py-1 rounded-md bg-[#ededed] text-[#141414] hover:bg-[#f3f3f3] hover:text-[#737373] transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 