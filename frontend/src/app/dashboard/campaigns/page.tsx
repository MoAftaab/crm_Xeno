'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCampaigns } from '@/hooks/useCampaigns';
import { Campaign } from '@/services/campaign-service';
import { PlusCircle, Search, Calendar, Activity, CheckCircle, Sparkles, Clock, AlertCircle, Trash2, ChevronRight, Loader2, Send } from 'lucide-react';

export default function CampaignsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { getCampaigns, launchCampaign, deleteCampaign } = useCampaigns();
  const campaignsQuery = getCampaigns();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Filter campaigns based on search and status
  const filteredCampaigns = campaignsQuery.data?.filter((campaign: Campaign) => {
    const matchesSearch = !searchQuery || 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (campaign.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  // Handle campaign launch
  const handleLaunchCampaign = (id: string) => {
    launchCampaign().mutate(id);
  };

  // Handle campaign delete
  const handleDeleteCampaign = (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      deleteCampaign().mutate(id);
    }
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return {
          bg: 'bg-gray-800',
          text: 'text-gray-300',
          icon: <Clock className="w-3 h-3 mr-1" />
        };
      case 'scheduled':
        return {
          bg: 'bg-blue-900/30',
          text: 'text-blue-300',
          icon: <Calendar className="w-3 h-3 mr-1" />
        };
      case 'active':
        return {
          bg: 'bg-purple-900/30',
          text: 'text-purple-300',
          icon: <Activity className="w-3 h-3 mr-1" />
        };
      case 'completed':
        return {
          bg: 'bg-green-900/30',
          text: 'text-green-300',
          icon: <CheckCircle className="w-3 h-3 mr-1" />
        };
      case 'failed':
        return {
          bg: 'bg-red-900/30',
          text: 'text-red-300',
          icon: <AlertCircle className="w-3 h-3 mr-1" />
        };
      default:
        return {
          bg: 'bg-gray-800',
          text: 'text-gray-300',
          icon: null
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Campaigns</h1>
            
            <button 
              onClick={() => router.push('/dashboard/campaigns/create')}
              className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg shadow-lg shadow-purple-900/20 transition-all duration-300"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              New Campaign
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                statusFilter === 'all' 
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' 
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                statusFilter === 'draft' 
                  ? 'bg-gray-700/70 text-white border border-gray-600' 
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'
              }`}
            >
              Drafts
            </button>
            <button
              onClick={() => setStatusFilter('scheduled')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                statusFilter === 'scheduled' 
                  ? 'bg-blue-900/30 text-blue-300 border border-blue-500/30' 
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'
              }`}
            >
              Scheduled
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                statusFilter === 'active' 
                  ? 'bg-purple-900/30 text-purple-300 border border-purple-500/30' 
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                statusFilter === 'completed' 
                  ? 'bg-green-900/30 text-green-300 border border-green-500/30' 
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:bg-gray-800'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
        
        {/* Campaigns List */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
          {campaignsQuery.isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-t-blue-500 border-r-purple-500 border-b-cyan-500 border-l-transparent animate-spin"></div>
              </div>
            </div>
          ) : campaignsQuery.isError ? (
            <div className="p-8 text-center text-red-400">
              <p>Error loading campaigns. Please try again.</p>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-50"></div>
                  <div className="relative w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">No campaigns found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || statusFilter !== 'all' ? 
                  "No campaigns match your search criteria. Try adjusting your filters." : 
                  "Create your first campaign to start engaging with your customers."}
              </p>
              <button 
                onClick={() => router.push('/dashboard/campaigns/create')}
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg shadow-purple-900/20 transition-all duration-300"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Create New Campaign
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800/50 border-b border-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Campaign</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Segment</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stats</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredCampaigns.map((campaign: Campaign) => {
                    const statusBadge = getStatusBadge(campaign.status);
                    return (
                      <tr key={campaign.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium">{campaign.name}</p>
                            {campaign.description && (
                              <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">{campaign.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          {campaign.segment?.name || 'All Customers'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center inline-flex ${statusBadge.bg} ${statusBadge.text}`}>
                            {statusBadge.icon}
                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {campaign.status === 'completed' || campaign.status === 'active' ? (
                            <div className="flex items-center space-x-2">
                              <div className="h-1.5 w-20 bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500" 
                                  style={{ width: `${(campaign.deliveryStatus?.sent || 0) / ((campaign.deliveryStatus?.sent || 0) + (campaign.deliveryStatus?.pending || 0) + (campaign.deliveryStatus?.failed || 0)) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-400">
                                {campaign.deliveryStatus?.sent || 0} sent
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">
                          {new Date(campaign.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {campaign.status === 'draft' && (
                              <button 
                                onClick={() => handleLaunchCampaign(campaign.id)}
                                className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded-lg transition-colors"
                                title="Launch Campaign"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            )}
                            
                            <button 
                              onClick={() => handleDeleteCampaign(campaign.id)}
                              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
                              title="Delete Campaign"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            
                            <button 
                              onClick={() => router.push(`/dashboard/campaigns/${campaign.id}`)}
                              className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 