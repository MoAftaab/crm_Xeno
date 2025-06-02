import { useQuery, useMutation, useQueryClient } from 'react-query';
import { campaignService, Campaign, CampaignInput } from '../services/campaign-service';

// Direct hooks for components that need specific functionality
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  return useMutation((newCampaign: CampaignInput) => campaignService.createCampaign(newCampaign), {
    onSuccess: () => {
      queryClient.invalidateQueries('campaigns');
    },
  });
};

export const useCampaigns = () => {
  const queryClient = useQueryClient();

  // Get all campaigns - directly use the hook
  const campaignsQuery = useQuery('campaigns', campaignService.getCampaigns);

  // Create campaign - create the mutation once
  const createCampaignMutation = useMutation(
    (newCampaign: CampaignInput) => campaignService.createCampaign(newCampaign),
    {
      onSuccess: () => {
        // Invalidate and refetch campaigns list
        queryClient.invalidateQueries('campaigns');
      },
    }
  );

  // Delete campaign - create the mutation once
  const deleteCampaignMutation = useMutation(
    (id: string) => campaignService.deleteCampaign(id),
    {
      onSuccess: () => {
        // Invalidate and refetch campaigns list
        queryClient.invalidateQueries('campaigns');
      },
    }
  );

  // Launch campaign - create the mutation once
  const launchCampaignMutation = useMutation(
    (id: string) => campaignService.launchCampaign(id),
    {
      onSuccess: (data) => {
        // Update cache for specific campaign and campaign list
        queryClient.invalidateQueries('campaigns');
        queryClient.invalidateQueries(['campaign', data.id]);
      },
    }
  );

  // Generate AI message - create the mutation once
  const generateAIMessageMutation = useMutation(
    (campaignInfo: { name: string; description?: string; segmentInfo?: string }) => 
      campaignService.generateMessageWithAI(campaignInfo)
  );

  // These functions are wrappers that return the already created queries/mutations
  // No hooks are called inside these functions
  return {
    // Properly structured query function
    getCampaigns: () => campaignsQuery,
    
    // Function that creates a specific campaign query when needed
    getCampaignById: (id: string) => {
      return useQuery(['campaign', id], () => campaignService.getCampaignById(id), {
        enabled: !!id, // Only run if id is provided
      });
    },
    
    // Return the pre-created mutations
    createCampaign: () => createCampaignMutation,
    deleteCampaign: () => deleteCampaignMutation,
    launchCampaign: () => launchCampaignMutation,
    generateAIMessage: () => generateAIMessageMutation,
    
    // For any queries that need parameters
    getCampaignStats: (campaignId: string) => {
      return useQuery(
        ['campaign', campaignId, 'stats'], 
        () => campaignService.getCampaignStats(campaignId),
        {
          enabled: !!campaignId,
          refetchInterval: 30000, // Refetch every 30 seconds for active campaigns
        }
      );
    },
    
    // Function that creates an update mutation when needed
    updateCampaign: () => {
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
    }
  };
}; 