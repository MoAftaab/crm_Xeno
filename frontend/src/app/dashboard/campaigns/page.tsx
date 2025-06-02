'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import { useAuth } from '@/hooks/useAuth';
import { useCampaigns } from '@/hooks/useCampaigns';
import { Campaign, campaignService } from '@/services/campaign-service';
import { Segment } from '@/services/segment-service';
import { 
  PlusCircle, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  Check, 
  Send, 
  Filter, 
  ChevronDown, 
  Users,
  MessageSquare,
  BarChart3,
  Pencil,
  X,
  Info,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Activity,
  Loader2,
  Sparkles,
  Trash2
} from 'lucide-react';

// Define a type that can handle both real API campaigns and mock data
interface MockCampaign {
  id: string;
  name: string;
  description: string;
  status: string;
  segment: { name: string; count: number };
  schedule: { startDate: string | null; endDate: string | null };
  performance: { sent: number; opened: number; clicked: number };
  createdAt: string;
}

// Combined type that can be either a Campaign from API or a MockCampaign
type CombinedCampaign = Campaign | MockCampaign;

// Type guards to check which type of campaign we're dealing with
function isMockCampaign(campaign: CombinedCampaign): campaign is MockCampaign {
  return 'schedule' in campaign && 'performance' in campaign;
}

function isApiCampaign(campaign: CombinedCampaign): campaign is Campaign {
  return 'scheduledAt' in campaign;
}

export default function CampaignsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  // Get campaign functions but don't call them inside component body
  const { getCampaigns, launchCampaign, deleteCampaign } = useCampaigns();
  
  // Use stale time and cache time to prevent excessive refetching
  const campaignsQuery = useQuery('campaigns', campaignService.getCampaigns, {
    staleTime: 30000, // 30 seconds
    cacheTime: 300000, // 5 minutes
    refetchOnWindowFocus: false
  });
  
  // State for expanded campaign details
  const [expandedCampaignId, setExpandedCampaignId] = useState<string | null>(null);
  
  // State for modals
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCampaignForLaunch, setSelectedCampaignForLaunch] = useState<string | null>(null);
  const [selectedCampaignForDelete, setSelectedCampaignForDelete] = useState<string | null>(null);
  
  // Toggle campaign expansion
  const toggleCampaignExpansion = (id: string) => {
    if (expandedCampaignId === id) {
      setExpandedCampaignId(null);
    } else {
      setExpandedCampaignId(id);
    }
  };
  
  // Load saved campaigns from localStorage if available
  const [localCampaigns, setLocalCampaigns] = useState<MockCampaign[]>([]);

  // Load any campaigns saved in localStorage on component mount
  useEffect(() => {
    try {
      const savedCampaigns = localStorage.getItem('mockCampaigns');
      if (savedCampaigns) {
        const parsedCampaigns = JSON.parse(savedCampaigns);
        // Convert any API format campaigns to mock format if needed
        const formattedCampaigns = parsedCampaigns.map((campaign: any) => {
          if (campaign.segment && campaign.schedule && campaign.performance) {
            // Already in mock format
            return campaign;
          } else {
            // Get a random but fixed segment count (instead of random every time)
            const segmentId = campaign.segmentId || '';
            const fixedCount = parseInt(segmentId.replace(/\D/g, '') || '0') * 37 + 110;
            
            // Get proper segment name based on ID or use a default
            let segmentName = 'All Customers';
            if (segmentId === 'seg1') {
              segmentName = 'High-Value Customers';
            } else if (segmentId === 'seg2') {
              segmentName = 'Recent Purchasers';
            } else if (segmentId === 'seg3') {
              segmentName = 'Cart Abandoners';
            } else if (segmentId) {
              segmentName = `Segment ${segmentId.replace('seg', '')}`;
            }
            
            // Generate realistic campaign metrics based on campaign name and ID
            const idHash = campaign.id ? campaign.id.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0) : 0;
            const nameHash = campaign.name ? campaign.name.length * 17 : 0;
            const totalHash = (idHash + nameHash) % 1000;
            
            const sent = fixedCount;
            const opened = Math.floor(sent * (0.3 + (totalHash % 40) / 100)); // 30-70% open rate
            const clicked = Math.floor(opened * (0.2 + (totalHash % 30) / 100)); // 20-50% click rate
            
            // Convert API format to mock format with better data
            return {
              id: campaign.id || `local-${Date.now()}`,
              name: campaign.name,
              description: campaign.description || '',
              status: campaign.status || 'draft',
              segment: { 
                name: segmentName, 
                count: fixedCount
              },
              schedule: { 
                startDate: campaign.scheduledAt || null, 
                endDate: campaign.scheduledAt ? new Date(new Date(campaign.scheduledAt).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() : null 
              },
              performance: { 
                sent: campaign.status === 'active' || campaign.status === 'completed' ? sent : 0, 
                opened: campaign.status === 'active' || campaign.status === 'completed' ? opened : 0, 
                clicked: campaign.status === 'active' || campaign.status === 'completed' ? clicked : 0 
              },
              createdAt: campaign.createdAt || new Date().toISOString()
            };
          }
        });
        setLocalCampaigns(formattedCampaigns);
      }
    } catch (error) {
      console.error('Error loading campaigns from localStorage:', error);
    }
  }, []);

  // Combine local campaigns with default mock campaigns
  const mockCampaigns: MockCampaign[] = [
    ...localCampaigns,
    {
      id: 'camp1',
      name: 'Summer Sale 2025',
      description: 'Promotional campaign for our summer collection with 30% off',
      status: 'active',
      segment: { name: 'High-Value Customers', count: 142 },
      schedule: { startDate: '2025-06-01', endDate: '2025-06-30' },
      performance: { sent: 142, opened: 98, clicked: 64 },
      createdAt: '2025-05-20T14:30:00Z'
    },
    {
      id: 'camp2',
      name: 'New Product Launch',
      description: 'Introducing our latest product line to loyal customers',
      status: 'scheduled',
      segment: { name: 'Recent Purchasers', count: 278 },
      schedule: { startDate: '2025-06-15', endDate: '2025-06-22' },
      performance: { sent: 0, opened: 0, clicked: 0 },
      createdAt: '2025-05-25T10:15:00Z'
    },
    {
      id: 'camp3',
      name: 'Abandoned Cart Recovery',
      description: 'Follow-up with customers who left items in their cart',
      status: 'draft',
      segment: { name: 'Cart Abandoners', count: 351 },
      schedule: { startDate: null, endDate: null },
      performance: { sent: 0, opened: 0, clicked: 0 },
      createdAt: '2025-05-28T09:45:00Z'
    },
    {
      id: 'camp4',
      name: 'Customer Loyalty Program',
      description: 'Exclusive rewards for our most loyal customers',
      status: 'active',
      segment: { name: 'Repeat Customers', count: 215 },
      schedule: { startDate: '2025-05-15', endDate: '2025-07-15' },
      performance: { sent: 215, opened: 187, clicked: 132 },
      createdAt: '2025-05-10T11:30:00Z'
    },
    {
      id: 'camp5',
      name: 'Back in Stock Notification',
      description: 'Alert customers when their favorited items are back in stock',
      status: 'completed',
      segment: { name: 'Waitlist Customers', count: 98 },
      schedule: { startDate: '2025-05-01', endDate: '2025-05-15' },
      performance: { sent: 98, opened: 92, clicked: 76 },
      createdAt: '2025-04-28T16:20:00Z'
    },
    {
      id: 'camp6',
      name: 'Flash Sale Weekend',
      description: '48-hour flash sale with exclusive discounts',
      status: 'completed',
      segment: { name: 'All Customers', count: 950 },
      schedule: { startDate: '2025-05-04', endDate: '2025-05-06' },
      performance: { sent: 950, opened: 732, clicked: 508 },
      createdAt: '2025-05-01T09:00:00Z'
    },
    {
      id: 'camp7',
      name: 'Product Feedback Survey',
      description: 'Collect feedback from recent purchasers',
      status: 'draft',
      segment: { name: 'Recent Purchasers', count: 278 },
      schedule: { startDate: null, endDate: null },
      performance: { sent: 0, opened: 0, clicked: 0 },
      createdAt: '2025-06-01T10:45:00Z'
    }
  ];
  
  // Use a ref to track if we've already loaded campaigns to prevent infinite loops
  const campaignsLoadedRef = React.useRef(false);
  
  // Redirect if not authenticated and load campaigns just once
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Only load campaigns once to prevent infinite loops
    if (!campaignsLoadedRef.current) {
      campaignsLoadedRef.current = true;
      
      // Load localStorage campaigns
      try {
        const savedCampaigns = localStorage.getItem('mockCampaigns');
        if (savedCampaigns) {
          const parsedCampaigns = JSON.parse(savedCampaigns);
          // Format and set local campaigns
          const formattedCampaigns = parsedCampaigns.map((campaign: any) => {
            if (campaign.segment && campaign.schedule && campaign.performance) {
              return campaign;
            } else {
              return {
                id: campaign.id || `local-${Date.now()}`,
                name: campaign.name,
                description: campaign.description || '',
                status: campaign.status || 'draft',
                segment: { 
                  name: campaign.segmentId ? `Segment ${campaign.segmentId}` : 'All Customers', 
                  count: 110 // Use a fixed count instead of random to prevent rerenders
                },
                schedule: { 
                  startDate: campaign.scheduledAt || null, 
                  endDate: campaign.scheduledAt ? new Date(new Date(campaign.scheduledAt).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() : null 
                },
                performance: { sent: 0, opened: 0, clicked: 0 },
                createdAt: campaign.createdAt || new Date().toISOString()
              };
            }
          });
          setLocalCampaigns(formattedCampaigns);
        }
      } catch (error) {
        console.error('Error loading campaigns from localStorage:', error);
      }
    }
  }, [user, router]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Filter campaigns based on search query and selected status
  const filteredCampaigns = useMemo(() => {
    let campaigns = [];
    
    // Use API data if available, otherwise use mock data
    if (campaignsQuery.data && campaignsQuery.data.length > 0) {
      campaigns = campaignsQuery.data;
    } else {
      campaigns = mockCampaigns;
    }
    
    return campaigns.filter(campaign => {
      const matchesSearch = !searchQuery || 
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (campaign.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [campaignsQuery.data, mockCampaigns, searchQuery, statusFilter]);
  
  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  
  // Get current page items
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCampaigns.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCampaigns, currentPage, itemsPerPage]);

  // Handle campaign launch button click
  const handleLaunchClick = (id: string) => {
    setSelectedCampaignForLaunch(id);
    setIsLaunchModalOpen(true);
  };
  
  // Handle delete button click
  const handleDeleteClick = (id: string) => {
    setSelectedCampaignForDelete(id);
    setIsDeleteModalOpen(true);
  };
  
  // Handle campaign launch confirmation
  const handleLaunchCampaign = () => {
    if (selectedCampaignForLaunch && launchCampaign) {
      const launchMutation = launchCampaign();
      launchMutation.mutate(selectedCampaignForLaunch);
      setIsLaunchModalOpen(false);
      setSelectedCampaignForLaunch(null);
    }
  };
  
  // Handle campaign delete confirmation
  const handleDeleteCampaign = () => {
    if (!selectedCampaignForDelete) return;
    
    // Try to find if this campaign is in localStorage
    try {
      const localCampaigns = JSON.parse(localStorage.getItem('mockCampaigns') || '[]');
      const localIndex = localCampaigns.findIndex((c: any) => c.id === selectedCampaignForDelete);
      
      // If found in localStorage, delete it from there
      if (localIndex >= 0) {
        localCampaigns.splice(localIndex, 1);
        localStorage.setItem('mockCampaigns', JSON.stringify(localCampaigns));
        
        // Show deletion notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center';
        notification.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Campaign deleted successfully</span>
        `;
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
          notification.style.opacity = '0';
          notification.style.transition = 'opacity 0.5s ease-out';
          setTimeout(() => document.body.removeChild(notification), 500);
        }, 3000);
        
        // Update UI immediately
        setLocalCampaigns(localCampaigns);
      } else {
        // If not in localStorage, try to delete via API
        if (deleteCampaign) {
          const deleteMutation = deleteCampaign();
          deleteMutation.mutate(selectedCampaignForDelete);
        }
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      // Fall back to API delete if localStorage manipulation fails
      if (deleteCampaign) {
        const deleteMutation = deleteCampaign();
        deleteMutation.mutate(selectedCampaignForDelete);
      }
    }
    
    // Close modal and reset selection
    setIsDeleteModalOpen(false);
    setSelectedCampaignForDelete(null);
  };
  
  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-gray-500">Draft</span>
          </div>
        );
      case 'scheduled':
        return (
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-blue-500">Scheduled</span>
          </div>
        );
      case 'active':
        return (
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500">Active</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-700 mr-1" />
            <span className="text-green-700">Completed</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-red-500">Failed</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <Activity className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-gray-500">{status}</span>
          </div>
        );
    }
  };
  
  // Loading state - only show if we're loading and don't have mock data to display
  if (campaignsQuery.isLoading && mockCampaigns.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-[#141414] animate-spin" />
        <span className="ml-2 text-[#141414]">Loading campaigns...</span>
      </div>
    );
  }

  // Error state - don't show error if we have mock data to display
  if (campaignsQuery.isError && mockCampaigns.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24">
        <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
        <h2 className="text-xl font-medium text-[#141414]">Failed to load campaigns</h2>
        <p className="text-[#737373]">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#141414]">
      <main>
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#141414]">Campaigns</h1>
            <p className="text-sm text-[#737373] mt-1">Create and manage your email campaigns</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/campaigns/create')}
            className="px-4 py-2 bg-[#141414] text-white rounded-lg flex items-center self-start"
            type="button"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Campaign
          </button>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          <div className="relative w-full md:w-auto md:flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border border-[#dbdbdb] py-2 pl-10 pr-4 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
          />
        </div>
        
        <div className="relative">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#dbdbdb] rounded-lg"
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            type="button"
          >
            <span className="text-sm font-medium">{statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
            <ChevronDown className="w-4 h-4 text-[#737373]" />
          </button>
          
          {showStatusDropdown && (
            <div className="absolute z-10 mt-1 w-36 rounded-lg bg-white border border-[#dbdbdb] shadow-lg">
              <div className="p-1">
                <button 
                  onClick={() => { setStatusFilter('all'); setShowStatusDropdown(false); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                  type="button"
                >
                  All Status
                </button>
                <button 
                  onClick={() => { setStatusFilter('draft'); setShowStatusDropdown(false); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                  type="button"
                >
                  Draft
                </button>
                <button 
                  onClick={() => { setStatusFilter('scheduled'); setShowStatusDropdown(false); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                  type="button"
                >
                  Scheduled
                </button>
                <button 
                  onClick={() => { setStatusFilter('active'); setShowStatusDropdown(false); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100"
                  type="button"
                >
                  Active
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Campaigns Table */}
      {filteredCampaigns.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center bg-white rounded-lg border border-[#dbdbdb]">
          <Sparkles className="w-10 h-10 text-gray-300 mb-2" />
          <h3 className="text-lg font-medium text-[#141414]">No campaigns found</h3>
          <p className="text-[#737373] mt-1 text-center max-w-sm">
            {searchQuery || statusFilter !== 'all'
              ? "Try adjusting your search or filters to find what you're looking for"
              : 'Get started by creating your first campaign'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <button
              onClick={() => router.push('/dashboard/campaigns/create')}
              className="mt-4 px-4 py-2 bg-black text-white rounded-lg flex items-center"
              type="button"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Campaign
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-[#dbdbdb] rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 px-4 py-3 bg-gray-50 text-xs uppercase font-medium text-[#737373] border-b border-[#dbdbdb]">
            <div className="col-span-4 flex items-center">
              <span className="w-6 mr-2">#</span>
              <span>CAMPAIGN</span>
            </div>
            <div className="col-span-1 text-center">STATUS</div>
            <div className="col-span-2">AUDIENCE</div>
            <div className="col-span-2">SCHEDULE</div>
            <div className="col-span-2">PERFORMANCE</div>
            <div className="col-span-1 text-center">ACTIONS</div>
          </div>
          
          {/* Campaigns Rows */}
          <div className="divide-y divide-[#dbdbdb]">
            {currentItems.map((campaign: CombinedCampaign, index: number) => (
              <React.Fragment key={campaign.id}>
                <div className="grid grid-cols-12 px-4 py-4 items-center hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleCampaignExpansion(campaign.id)}>
                  <div className="col-span-4 flex items-center space-x-3">
                    <span className="text-sm font-medium text-[#737373] w-6">{index + 1}</span>
                    <div>
                      <h3 className="font-medium text-[#141414] hover:underline">                    
                        {campaign.name}
                      </h3>
                      <p className="text-sm text-[#737373]">{campaign.description || 'No description'}</p>
                    </div>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    {getStatusBadge(campaign.status)}
                  </div>
                  <div className="col-span-2">
                    {isMockCampaign(campaign) ? (
                      <span className="text-[#141414]">{campaign.segment.name}</span>
                    ) : (
                      <span className="text-[#141414]">
                        {isApiCampaign(campaign) && campaign.segment ? 
                          campaign.segment.name : 'N/A'}
                      </span>
                    )}
                  </div>
                  <div className="col-span-2">
                    {isMockCampaign(campaign) ? (
                      <span className="text-[#141414]">
                        {campaign.schedule.startDate ? new Date(campaign.schedule.startDate).toLocaleDateString() : 'Not scheduled'}
                      </span>
                    ) : (
                      <span className="text-[#141414]">
                        {isApiCampaign(campaign) && campaign.scheduledAt ? 
                          new Date(campaign.scheduledAt).toLocaleDateString() : 'Not scheduled'}
                      </span>
                    )}
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded font-medium">
                        {isMockCampaign(campaign) ? (campaign.performance.sent || 0) : 
                          (isApiCampaign(campaign) ? campaign.sentCount || 0 : 0)} sent
                      </span>
                      <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-medium">
                        {isMockCampaign(campaign) ? (campaign.performance.opened || 0) : 
                          (isApiCampaign(campaign) && campaign.openRate ? 
                            `${campaign.openRate}%` : '0')} opened
                      </span>
                      <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-medium">
                        {isMockCampaign(campaign) ? (campaign.performance.clicked || 0) : '0'} clicks
                      </span>
                    </div>
                    {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                      <div className="mt-1 text-xs text-[#737373] flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {campaign.status === 'scheduled' ? 'Pending delivery' : 'Ready to launch'}
                      </div>
                    )}
                  </div>
                  <div className="col-span-1 flex items-center justify-center space-x-1">
                    {campaign.status === 'draft' && (
                      <button 
                        className="p-1.5 text-[#141414] hover:bg-gray-100 rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLaunchClick(campaign.id);
                        }}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      className="p-1.5 text-[#141414] hover:bg-gray-100 rounded-full transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/campaigns/edit/${campaign.id}`);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-1.5 text-red-500 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(campaign.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Expanded Campaign Details */}
                {expandedCampaignId === campaign.id && (
                  <div className="col-span-12 px-8 py-6 bg-gray-50 border-t border-[#dbdbdb]">
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-12 lg:col-span-7">
                        <div className="bg-white rounded-lg border border-[#dbdbdb] p-4 h-full">
                          <h4 className="font-medium mb-3 flex items-center">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Campaign Message
                          </h4>
                          <div className="bg-gray-50 p-3 rounded-md text-[#141414] text-sm">
                            {isMockCampaign(campaign) ? campaign.description : 
                              (isApiCampaign(campaign) ? campaign.message : 'No message content')}
                          </div>
                          
                          {/* Timestamps */}
                          <div className="mt-4 flex items-center justify-between text-xs text-[#737373]">
                            <div>
                              <span className="font-medium">Created:</span> {new Date(campaign.createdAt).toLocaleString()}
                            </div>
                            {isMockCampaign(campaign) && campaign.schedule.startDate && (
                              <div>
                                <span className="font-medium">Scheduled:</span> {new Date(campaign.schedule.startDate).toLocaleString()}
                              </div>
                            )}
                            {isApiCampaign(campaign) && campaign.scheduledAt && (
                              <div>
                                <span className="font-medium">Scheduled:</span> {new Date(campaign.scheduledAt).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-12 lg:col-span-5">
                        <div className="bg-white rounded-lg border border-[#dbdbdb] p-4 h-full">
                          <h4 className="font-medium mb-3 flex items-center">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Performance Details
                          </h4>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-[#737373]">Total Sent:</span>
                              <span className="font-medium">
                                {isMockCampaign(campaign) ? campaign.performance.sent : 
                                  (isApiCampaign(campaign) ? campaign.sentCount || 0 : 0)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-[#737373]">Opened:</span>
                              <span className="font-medium">
                                {isMockCampaign(campaign) ? campaign.performance.opened : 
                                  (isApiCampaign(campaign) ? Math.floor((campaign.sentCount || 0) * 0.45) : 0)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-[#737373]">Clicked:</span>
                              <span className="font-medium">
                                {isMockCampaign(campaign) ? campaign.performance.clicked : 
                                  (isApiCampaign(campaign) ? Math.floor((campaign.sentCount || 0) * 0.45 * 0.3) : 0)}
                              </span>
                            </div>
                            {isMockCampaign(campaign) && campaign.performance.sent > 0 && (
                              <div className="mt-4">
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-500 rounded-full" 
                                    style={{ width: `${(campaign.performance.opened / campaign.performance.sent) * 100}%` }}
                                  ></div>
                                </div>
                                <div className="mt-1 text-xs text-[#737373] text-right">
                                  Open rate: {Math.round((campaign.performance.opened / campaign.performance.sent) * 100)}%
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md border border-[#dbdbdb] disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="text-sm text-[#141414]">
            Page {currentPage} of {totalPages}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border border-[#dbdbdb] disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* Launch Campaign Modal */}
      {isLaunchModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Launch Campaign</h3>
              <button 
                onClick={() => setIsLaunchModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#141414]">
                  Are you sure you want to launch this campaign? 
                  Once launched, it will be scheduled according to the date you've set and cannot be modified.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsLaunchModalOpen(false)}
                className="px-4 py-2 text-sm text-[#141414] border border-[#dbdbdb] rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLaunchCampaign}
                className="px-4 py-2 text-sm bg-[#141414] text-white rounded-md hover:bg-[#242424]"
              >
                Launch Campaign
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Campaign Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Delete Campaign</h3>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#141414]">
                  Are you sure you want to delete this campaign? This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm text-[#141414] border border-[#dbdbdb] rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCampaign}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
    </div>
  );
}
