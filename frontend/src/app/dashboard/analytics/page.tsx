'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  LineChart, 
  PieChart,
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Activity,
  ChevronDown,
  Calendar,
  CalendarDays,
  DownloadIcon,
  ChevronUp,
  Loader2
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data for the analytics
const mockMetrics = {
  totalCustomers: 4826,
  newCustomers: 126,
  customerGrowth: 12.4,
  totalOrders: 3142,
  newOrders: 68,
  orderGrowth: -2.8,
  totalRevenue: 284692,
  newRevenue: 12480,
  revenueGrowth: 8.7,
  averageOrderValue: 90.61,
  conversionRate: 3.2,
  conversionGrowth: 0.6
};

// Mock data for charts
const mockChartData = {
  revenue: [
    { date: 'Jan', amount: 18500 },
    { date: 'Feb', amount: 21300 },
    { date: 'Mar', amount: 19800 },
    { date: 'Apr', amount: 24600 },
    { date: 'May', amount: 27200 },
    { date: 'Jun', amount: 25100 },
    { date: 'Jul', amount: 28400 },
    { date: 'Aug', amount: 30100 },
    { date: 'Sep', amount: 32500 },
    { date: 'Oct', amount: 28900 },
    { date: 'Nov', amount: 26700 },
    { date: 'Dec', amount: 31600 }
  ],
  customers: [
    { date: 'Jan', count: 312 },
    { date: 'Feb', count: 348 },
    { date: 'Mar', count: 376 },
    { date: 'Apr', count: 402 },
    { date: 'May', count: 436 },
    { date: 'Jun', count: 458 },
    { date: 'Jul', count: 492 },
    { date: 'Aug', count: 518 },
    { date: 'Sep', count: 546 },
    { date: 'Oct', count: 582 },
    { date: 'Nov', count: 614 },
    { date: 'Dec', count: 642 }
  ],
  customerSegments: [
    { name: 'High Value', value: 18, color: '#3B82F6' },
    { name: 'Regular', value: 42, color: '#8B5CF6' },
    { name: 'Occasional', value: 27, color: '#EC4899' },
    { name: 'New', value: 13, color: '#60A5FA' }
  ],
  topProducts: [
    { name: 'Premium Headphones', sales: 432, revenue: 38880 },
    { name: 'Wireless Earbuds', sales: 386, revenue: 23160 },
    { name: 'Smartwatch Pro', sales: 294, revenue: 41160 },
    { name: 'Bluetooth Speaker', sales: 258, revenue: 12900 },
    { name: 'Fitness Tracker', sales: 196, revenue: 9800 }
  ],
  conversionFunnel: [
    { stage: 'Site Visitors', value: 15800 },
    { stage: 'Product Views', value: 8960 },
    { stage: 'Add to Cart', value: 3720 },
    { stage: 'Checkouts', value: 2140 },
    { stage: 'Purchases', value: 1680 }
  ],
  dailyActivity: [
    { day: 'Monday', orders: 126, revenue: 10850 },
    { day: 'Tuesday', orders: 143, revenue: 12760 },
    { day: 'Wednesday', orders: 168, revenue: 15420 },
    { day: 'Thursday', orders: 182, revenue: 16490 },
    { day: 'Friday', orders: 246, revenue: 22140 },
    { day: 'Saturday', orders: 208, revenue: 18720 },
    { day: 'Sunday', orders: 174, revenue: 14960 }
  ]
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: number | string;
  change: number;
  icon: React.ElementType;
  prefix?: string;
}

const MetricCard = ({ title, value, change, icon: Icon, prefix = '' }: MetricCardProps) => {
  const isPositive = change >= 0;
  
  return (
    <div className="rounded-xl p-5 bg-white border border-[#dbdbdb]">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-[#737373]">{title}</p>
          <p className="text-2xl font-bold mt-2 text-[#141414]">
            {prefix}{typeof value === 'number' && !prefix ? value.toLocaleString() : value}
          </p>
          <div className={`flex items-center mt-3 text-sm ${
            isPositive ? 'text-[#078807]' : 'text-red-600'
          }`}>
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 mr-1" />
            )}
            <span>{Math.abs(change)}%</span>
            <span className="ml-2 text-gray-500">vs last period</span>
          </div>
        </div>
        <div className="p-3 rounded-lg h-fit bg-[#ededed]">
          <Icon className="w-5 h-5 text-[#141414]" />
        </div>
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('Jan 20, 2023 - Feb 09, 2023');
  const [showDateRangeDropdown, setShowDateRangeDropdown] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Predefined date ranges
  const dateRanges = [
    'Jan 20, 2023 - Feb 09, 2023',
    'Last 7 days',
    'Last 30 days',
    'Last 90 days',
    'This year'
  ];
  
  const handleDateRangeChange = (range: string) => {
    setTimeRange(range);
    setShowDateRangeDropdown(false);
  };
  
  // Handle export functionality
  const handleExport = () => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      // Create a mock CSV content
      const csvContent = 'data:text/csv;charset=utf-8,Date,Revenue,Customers\n' +
        '2023-01-01,18500,312\n' +
        '2023-02-01,21300,348\n' +
        '2023-03-01,19800,376\n' +
        '2023-04-01,24600,402\n';
      
      // Create an invisible link and trigger download
      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(csvContent));
      link.setAttribute('download', `analytics-export-${timeRange.replace(/\s/g, '-')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
    }, 1500);
  };
  
  return (
    <div className="space-y-6 text-[#141414]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#141414]">Analytics</h1>
          <p className="text-sm text-[#737373] mt-1">
            Monitor your business performance and customer insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowDateRangeDropdown(!showDateRangeDropdown)}
              className="px-4 py-2 rounded-md flex items-center gap-2 border border-[#dbdbdb] bg-white text-[#737373] hover:bg-[#f3f3f3]"
            >
              <CalendarDays className="w-4 h-4" />
              <span className="text-sm">{timeRange}</span>
              {showDateRangeDropdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {showDateRangeDropdown && (
              <div className="absolute right-0 z-10 mt-2 w-60 rounded-md shadow-lg bg-white border border-[#dbdbdb] overflow-hidden">
                <div className="py-1">
                  {dateRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => handleDateRangeChange(range)}
                      className={`w-full text-left px-4 py-2 hover:bg-[#ededed] ${
                        range === timeRange ? 'bg-[#ededed] text-[#141414]' : 'text-[#737373]'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 rounded-md flex items-center gap-2 bg-black text-white hover:bg-gray-800 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <DownloadIcon className="w-4 h-4" />
                <span>Export</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Customers" 
          value={mockMetrics.totalCustomers}
          change={mockMetrics.customerGrowth}
          icon={Users}
        />
        <MetricCard 
          title="Total Orders" 
          value={mockMetrics.totalOrders}
          change={mockMetrics.orderGrowth}
          icon={ShoppingBag}
        />
        <MetricCard 
          title="Total Revenue" 
          value={mockMetrics.totalRevenue}
          change={mockMetrics.revenueGrowth}
          icon={DollarSign}
          prefix="$"
        />
        <MetricCard 
          title="Conversion Rate" 
          value={`${mockMetrics.conversionRate}%`}
          change={mockMetrics.conversionGrowth}
          icon={Activity}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="rounded-xl p-6 bg-white border border-[#dbdbdb]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-[#141414]">
                Revenue Overview
              </h2>
              <p className="text-sm text-[#737373]">
                Monthly revenue for the year
              </p>
            </div>
            <div className="p-2 rounded-lg bg-[#ededed]">
              <BarChart3 className="w-5 h-5 text-[#141414]" />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockChartData.revenue}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" stroke="#737373" />
                <YAxis stroke="#737373" />
                <Tooltip
                  formatter={(value) => [`$${value}`, 'Revenue']}
                  contentStyle={{ 
                    backgroundColor: "#ffffff",
                    borderColor: "#dbdbdb",
                    color: "#141414"
                  }}
                />
                <Bar dataKey="amount" name="Revenue" fill="#000000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Customer Segments */}
        <div className="rounded-xl p-6 bg-white border border-[#dbdbdb]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-[#141414]">
                Customer Segments
              </h2>
              <p className="text-sm text-[#737373]">
                Distribution of customer types
              </p>
            </div>
            <div className="p-2 rounded-lg bg-[#ededed]">
              <PieChart className="w-5 h-5 text-[#141414]" />
            </div>
          </div>
          <div className="h-64 flex items-center">
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={mockChartData.customerSegments}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {mockChartData.customerSegments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentage']}
                    contentStyle={{ 
                      backgroundColor: "#ffffff",
                      borderColor: "#dbdbdb",
                      color: "#141414"
                    }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Growth */}
        <div className="rounded-xl p-6 bg-white border border-[#dbdbdb]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-[#141414]">
                Customer Growth
              </h2>
              <p className="text-sm text-[#737373]">
                Monthly customer acquisition
              </p>
            </div>
            <div className="p-2 rounded-lg bg-[#ededed]">
              <LineChart className="w-5 h-5 text-[#141414]" />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart
                data={mockChartData.customers}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" stroke="#737373" />
                <YAxis stroke="#737373" />
                <Tooltip
                  formatter={(value) => [`${value}`, 'Customers']}
                  contentStyle={{ 
                    backgroundColor: "#ffffff",
                    borderColor: "#dbdbdb",
                    color: "#141414"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="Customers"
                  stroke="#000000" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                  dot={{ stroke: "#000000", strokeWidth: 2, r: 4, fill: "#ededed" }}
                />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Daily Activity */}
        <div className="rounded-xl p-6 bg-white border border-[#dbdbdb]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium text-[#141414]">
                Daily Activity
              </h2>
              <p className="text-sm text-[#737373]">
                Orders and revenue by day of week
              </p>
            </div>
            <div className="p-2 rounded-lg bg-[#ededed]">
              <BarChart3 className="w-5 h-5 text-[#141414]" />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockChartData.dailyActivity}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="day" stroke="#737373" />
                <YAxis yAxisId="left" orientation="left" stroke="#737373" />
                <YAxis yAxisId="right" orientation="right" stroke="#737373" />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: "#ffffff",
                    borderColor: "#dbdbdb",
                    color: "#141414"
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="orders" name="Orders" fill="#000000" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="revenue" name="Revenue ($)" fill="#737373" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Top Products Table */}
      <div className="rounded-xl p-6 bg-white border border-[#dbdbdb]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-[#141414]">
              Top Products
            </h2>
            <p className="text-sm text-[#737373]">
              Best performing products by sales and revenue
            </p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#ededed]">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#141414]">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#141414]">Sales</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#141414]">Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#141414]">Avg. Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dbdbdb]">
              {mockChartData.topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-[#f3f3f3]">
                  <td className="px-4 py-4 whitespace-nowrap text-[#141414]">{product.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-[#141414]">{product.sales}</td>
                  <td className="px-4 py-4 whitespace-nowrap font-medium text-[#141414]">${product.revenue.toLocaleString()}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-[#141414]">${(product.revenue / product.sales).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
 