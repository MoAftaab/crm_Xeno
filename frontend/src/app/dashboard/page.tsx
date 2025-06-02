'use client';

import { useState, useEffect } from 'react';
import { useCustomers } from '@/hooks/useCustomers';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Download, DollarSign, Users, ShoppingCart, Activity, LineChart as LineChartIcon, ArrowUp, Calendar, ChevronDown } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';

export default function Dashboard() {
  const customersHook = useCustomers();
  const { logout } = useAuth();
  const router = useRouter();
  const [dateRange, setDateRange] = useState({ start: 'Jan 20, 2025', end: 'Feb 09, 2025' });
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  
  // Predefined date ranges
  const dateRanges = [
    { start: 'Jan 20, 2025', end: 'Feb 09, 2025' },
    { start: 'Jan 01, 2025', end: 'Jan 31, 2025' },
    { start: 'Feb 01, 2025', end: 'Feb 28, 2025' },
    { start: 'Mar 01, 2025', end: 'Mar 31, 2025' },
    { start: 'Apr 01, 2025', end: 'Apr 30, 2025' }
  ];
  
  const handleDateRangeChange = (range: { start: string; end: string }) => {
    setDateRange(range);
    setShowDateDropdown(false);
  };
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Chart data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const values = [4500, 1800, 5000, 7000, 1500, 3000, 2800, 1500, 5800, 1200, 2000, 6800];
  
  // Format data for recharts
  const chartData = months.map((month, index) => ({
    name: month,
    revenue: values[index],
    profit: Math.floor(values[index] * 0.4)
  }));

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = () => {
      // Check for token in both formats to ensure compatibility
      const token = localStorage.getItem('crm-token') || localStorage.getItem('token');
      const userData = localStorage.getItem('crm-user');
      
      if (!token || !userData) {
        console.log('No auth token found, redirecting to login...');
        router.push('/login');
        return false;
      }
      
      console.log('Auth token found, user is authenticated');
      return true;
    };
    
    const isAuth = checkAuth();
    setIsAuthenticated(isAuth);
    
    // Only set loading to false if authenticated
    if (isAuth) {
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [router]);
  
  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-[#141414]">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#f5f5f5] text-[#141414] min-h-screen">
      {/* Main Content */}
      <div className="w-full">
        <div className="p-6">
          {/* Header with Date Range and Download */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#141414]">Dashboard</h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={() => setShowDateDropdown(!showDateDropdown)}
                  className="flex items-center gap-2 px-3 py-2 border border-[#dbdbdb] rounded-md bg-white text-[#141414] text-sm">
                  <Calendar className="w-4 h-4 text-[#737373]" />
                  <span>{dateRange.start} - {dateRange.end}</span>
                  <ChevronDown className="w-4 h-4 text-[#737373]" />
                </button>
                
                {showDateDropdown && (
                  <div className="absolute right-0 top-11 w-64 p-2 bg-white border border-[#dbdbdb] rounded-md shadow-md z-10">
                    {dateRanges.map((range, index) => (
                      <div 
                        key={index}
                        onClick={() => handleDateRangeChange(range)}
                        className={`px-3 py-2 rounded text-sm cursor-pointer hover:bg-[#f5f5f5] ${JSON.stringify(dateRange) === JSON.stringify(range) ? 'bg-[#f5f5f5]' : ''}`}
                      >
                        {range.start} - {range.end}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button className="bg-black py-1.5 px-3 rounded flex items-center gap-1 text-sm text-white">
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </div>
          
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Revenue Card */}
            <div className="rounded-xl p-5 bg-white border border-[#dbdbdb]">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-[#737373]">Total Revenue</p>
                  <p className="text-2xl font-bold mt-2 text-[#141414]">$45,231.89</p>
                  <div className="flex items-center mt-3 text-sm text-[#078807]">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span>20.1%</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg h-fit bg-[#ededed]">
                  <DollarSign className="w-5 h-5 text-[#141414]" />
                </div>
              </div>
            </div>
            
            {/* Subscriptions Card */}
            <div className="rounded-xl p-5 bg-white border border-[#dbdbdb]">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-[#737373]">Subscriptions</p>
                  <p className="text-2xl font-bold mt-2 text-[#141414]">+2350</p>
                  <div className="flex items-center mt-3 text-sm text-[#078807]">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span>180.1%</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg h-fit bg-[#ededed]">
                  <Users className="w-5 h-5 text-[#141414]" />
                </div>
              </div>
            </div>
            
            {/* Sales Card */}
            <div className="rounded-xl p-5 bg-white border border-[#dbdbdb]">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-[#737373]">Sales</p>
                  <p className="text-2xl font-bold mt-2 text-[#141414]">+12,234</p>
                  <div className="flex items-center mt-3 text-sm text-[#078807]">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span>19%</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg h-fit bg-[#ededed]">
                  <ShoppingCart className="w-5 h-5 text-[#141414]" />
                </div>
              </div>
            </div>
            
            {/* Active Now Card */}
            <div className="rounded-xl p-5 bg-white border border-[#dbdbdb]">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-[#737373]">Active Now</p>
                  <p className="text-2xl font-bold mt-2 text-[#141414]">573</p>
                  <div className="flex items-center mt-3 text-sm text-[#078807]">
                    <ArrowUp className="w-4 h-4 mr-1" />
                    <span>201 since last hour</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg h-fit bg-[#ededed]">
                  <Activity className="w-5 h-5 text-[#141414]" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Charts and Recent Sales */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Monthly Revenue Chart */}
            <div className="lg:col-span-3 rounded-xl p-5 bg-white border border-[#dbdbdb]">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-sm font-medium text-[#141414]">Overview</h2>
                  <p className="text-xs text-[#737373]">Monthly revenue for the year</p>
                </div>
                <LineChartIcon className="w-4 h-4 text-[#737373]" />
              </div>
              
              <div className="h-72 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#000" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#000" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#078807" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#078807" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbdbdb" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#737373' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#737373' }}
                      tickFormatter={(value) => `$${value/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#141414', 
                        border: 'none',
                        borderRadius: '4px',
                        color: '#fff'
                      }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value) => [`$${value.toLocaleString()}`, '']}
                      labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#000" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                      strokeWidth={2}
                      name="Revenue"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#078807" 
                      fillOpacity={0.5} 
                      fill="url(#colorProfit)" 
                      strokeWidth={2}
                      name="Profit"
                    />
                    <Legend 
                      iconType="circle" 
                      wrapperStyle={{ 
                        paddingTop: 15, 
                        fontSize: 12, 
                        color: '#737373' 
                      }} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Recent Sales */}
            <div className="rounded-xl p-5 bg-white border border-[#dbdbdb]">
              <div className="flex flex-col mb-4">
                <h2 className="text-sm font-medium text-[#141414]">Recent Sales</h2>
                <p className="text-xs text-[#737373]">You made 265 sales this month</p>
              </div>
              
              <div className="space-y-4">
                {/* Sale Item 1 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-[#ededed] rounded-full flex items-center justify-center text-xs text-[#141414]">O</div>
                    <div>
                      <p className="text-xs font-medium text-[#141414]">Olivia Martin</p>
                      <p className="text-xs text-[#737373]">olivia.martin@gmail.com</p>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-[#078807]">+$1,999.00</p>
                </div>
                
                {/* Sale Item 2 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-[#ededed] rounded-full flex items-center justify-center text-xs text-[#141414]">J</div>
                    <div>
                      <p className="text-xs font-medium text-[#141414]">Jackson Lee</p>
                      <p className="text-xs text-[#737373]">jackson.lee@gmail.com</p>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-[#078807]">+$39.00</p>
                </div>
                
                {/* Sale Item 3 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-[#ededed] rounded-full flex items-center justify-center text-xs text-[#141414]">I</div>
                    <div>
                      <p className="text-xs font-medium text-[#141414]">Isabella Nguyen</p>
                      <p className="text-xs text-[#737373]">isabella.nguyen@gmail.com</p>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-[#078807]">+$299.00</p>
                </div>
                
                {/* Sale Item 4 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-[#ededed] rounded-full flex items-center justify-center text-xs text-[#141414]">W</div>
                    <div>
                      <p className="text-xs font-medium text-[#141414]">William Kim</p>
                      <p className="text-xs text-[#737373]">will@gmail.com</p>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-[#078807]">+$99.00</p>
                </div>
                
                {/* Sale Item 5 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-[#ededed] rounded-full flex items-center justify-center text-xs text-[#141414]">S</div>
                    <div>
                      <p className="text-xs font-medium text-[#141414]">Sofia Davis</p>
                      <p className="text-xs text-[#737373]">sofia.davis@gmail.com</p>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-[#078807]">+$39.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
