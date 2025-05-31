import { useQuery, useMutation, useQueryClient } from 'react-query';
import { campaignService, Campaign, CampaignInput } from '../services/campaign-service';

export const useCampaigns = () => {
  const queryClient = useQueryClient();

  // Get all campaigns
  const getCampaigns = () => {
    return useQuery('campaigns', campaignService.getCampaigns);
  };

  // Get campaign by ID
  const getCampaignById = (id: string) => {
    return useQuery(['campaign', id], () => campaignService.getCampaignById(id), {
      enabled: !!id, // Only run if id is provided
    });
  };

  // Create campaign
  const createCampaign = () => {
    return useMutation((newCampaign: CampaignInput) => campaignService.createCampaign(newCampaign), {
      onSuccess: () => {
        // Invalidate and refetch campaigns list
        queryClient.invalidateQueries('campaigns');
      },
    });
  };

  // Update campaign
  const updateCampaign = () => {
    return useMutation(
      ({ id, data }: { id: string; data: Partial<CampaignInput> }) => 
        campaignService.updateCampaign(id, data),
      {
        onSuccess: (data) => {
          // Update cache for specific campaign and campaign list
          queryClient.invalidateQueries('campaigns');
          queryClient.invalidateQueries(['campaign', data.id]);
        },
      }
    );
  };

  // Delete campaign
  const deleteCampaign = () => {
    return useMutation((id: string) => campaignService.deleteCampaign(id), {
      onSuccess: () => {
        // Invalidate and refetch campaigns list
        queryClient.invalidateQueries('campaigns');
      },
    });
  };

  // Launch campaign
  const launchCampaign = () => {
    return useMutation((id: string) => campaignService.launchCampaign(id), {
      onSuccess: (data) => {
        // Update cache for specific campaign and campaign list
        queryClient.invalidateQueries('campaigns');
        queryClient.invalidateQueries(['campaign', data.id]);
      },
    });
  };

  // Get campaign stats
  const getCampaignStats = (campaignId: string) => {
    return useQuery(
      ['campaign', campaignId, 'stats'], 
      () => campaignService.getCampaignStats(campaignId),
      {
        enabled: !!campaignId,
        refetchInterval: 30000, // Refetch every 30 seconds for active campaigns
      }
    );
  };

  // Generate AI message
  const generateAIMessage = () => {
    return useMutation(
      (campaignInfo: { name: string; description?: string; segmentInfo?: string }) => 
        campaignService.generateMessageWithAI(campaignInfo)
    );
  };

  return {
    getCampaigns,
    getCampaignById,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    launchCampaign,
    getCampaignStats,
    generateAIMessage,
  };
}; 