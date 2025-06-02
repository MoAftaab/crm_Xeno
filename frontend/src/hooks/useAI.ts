import { useMutation, useQuery } from 'react-query';
import apiClient from '@/lib/api-client';
import { toast } from 'react-hot-toast';

export interface MessageGenerationParams {
  campaignName: string;
  description?: string;
  segmentInfo?: string;
  tone?: 'professional' | 'friendly' | 'persuasive';
}

export interface SegmentData {
  name: string;
  description?: string;
  conditions: Array<{
    field: string;
    operator: string;
    value: string | number | boolean;
  }>;
  customerCount?: number;
}

/**
 * Hook to generate AI campaign messages
 */
export const useGenerateAIMessage = () => {
  return useMutation(
    async (params: MessageGenerationParams) => {
      const response = await apiClient.post('/ai/generate-message', params);
      return response.data.data.message;
    },
    {
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to generate AI message');
      }
    }
  );
};

/**
 * Hook to analyze customer segments with AI
 */
export const useAnalyzeSegment = () => {
  return useMutation(
    async (segmentData: SegmentData) => {
      const response = await apiClient.post('/ai/analyze-segment', segmentData);
      return response.data.data.analysis;
    },
    {
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to analyze segment');
      }
    }
  );
};

/**
 * Hook to get campaign suggestions based on segment
 */
export const useCampaignSuggestion = (segmentId: string | null) => {
  return useQuery(
    ['campaignSuggestion', segmentId],
    async () => {
      if (!segmentId) return null;
      const response = await apiClient.get(`/ai/campaign-suggestion/${segmentId}`);
      return response.data.data;
    },
    {
      enabled: !!segmentId,
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to get campaign suggestion');
      }
    }
  );
};

/**
 * Hook to get customer data analysis
 */
export const useCustomerAnalysis = () => {
  return useQuery(
    ['customerAnalysis'],
    async () => {
      const response = await apiClient.get('/ai/customer-analysis');
      return response.data.data;
    },
    {
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to get customer analysis');
      }
    }
  );
}; 