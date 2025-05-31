import apiClient from '../lib/api-client';
import { Segment } from './segment-service';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  message: string;
  segmentId?: string;
  segment?: Segment;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'failed';
  scheduledAt?: string;
  sentCount?: number;
  deliveryStatus?: {
    sent: number;
    failed: number;
    pending: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CampaignInput {
  name: string;
  description?: string;
  message: string;
  segmentId?: string;
  status?: 'draft' | 'scheduled' | 'active';
  scheduledAt?: string;
}

export const campaignService = {
  getCampaigns: async (): Promise<Campaign[]> => {
    const response = await apiClient.get<Campaign[]>('/campaigns');
    return response.data;
  },

  getCampaignById: async (id: string): Promise<Campaign> => {
    const response = await apiClient.get<Campaign>(`/campaigns/${id}`);
    return response.data;
  },

  createCampaign: async (campaign: CampaignInput): Promise<Campaign> => {
    const response = await apiClient.post<Campaign>('/campaigns', campaign);
    return response.data;
  },

  updateCampaign: async (id: string, campaign: Partial<CampaignInput>): Promise<Campaign> => {
    const response = await apiClient.put<Campaign>(`/campaigns/${id}`, campaign);
    return response.data;
  },

  deleteCampaign: async (id: string): Promise<void> => {
    await apiClient.delete(`/campaigns/${id}`);
  },
  
  launchCampaign: async (id: string): Promise<Campaign> => {
    const response = await apiClient.post<Campaign>(`/campaigns/${id}/launch`, {});
    return response.data;
  },
  
  getCampaignStats: async (id: string): Promise<{
    sent: number;
    delivered: number;
    failed: number;
    opened: number;
    clicked: number;
  }> => {
    const response = await apiClient.get(`/campaigns/${id}/stats`);
    return response.data;
  },
  
  generateMessageWithAI: async (campaignInfo: {
    name: string;
    description?: string;
    segmentInfo?: string;
  }): Promise<string> => {
    const response = await apiClient.post<{message: string}>('/ai/generate-message', campaignInfo);
    return response.data.message;
  }
}; 