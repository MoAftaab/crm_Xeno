import axios from 'axios';
import apiClient from '../lib/api-client';

// Interface for message generation request
export interface MessageGenerationRequest {
  campaignName: string;
  segmentName: string;
  campaignType?: string;
  tone?: 'professional' | 'friendly' | 'promotional';
}

// Interface for message generation response
export interface MessageGenerationResponse {
  message: string;
  variables: string[];
}

// Smart scheduling recommendation interface
export interface SchedulingRecommendation {
  bestDay: string;
  bestTime: string;
  expectedEngagementRate: string;
  reasoning: string;
}

/**
 * Generate a marketing message using Gemini AI
 */
export const generateMarketingMessage = async (
  request: MessageGenerationRequest
): Promise<MessageGenerationResponse> => {
  try {
    // In a real implementation, this would call the backend which would then call Gemini API
    const response = await apiClient.post('ai/generate-message', request);
    return response.data;
  } catch (error) {
    console.error('Error generating AI message:', error);
    throw error;
  }
};

/**
 * Fallback message generation when API is unavailable
 * This mimics what the AI would generate but without making an API call
 */
export const generateFallbackMessage = (
  request: MessageGenerationRequest
): MessageGenerationResponse => {
  const { campaignName, segmentName } = request;
  let message = '';
  
  // Generate message based on campaign and segment name
  if (campaignName.toLowerCase().includes('welcome')) {
    message = 'Welcome to our store, {customer_name}! We\'re thrilled to have you join our community. Explore our latest collections and enjoy 10% off your first purchase with code WELCOME10.';
  } else if (campaignName.toLowerCase().includes('sale') || campaignName.toLowerCase().includes('discount')) {
    message = 'Hi {customer_name}, great news! We\'re offering an exclusive discount just for you. Enjoy 20% off your next purchase with code SPECIAL20.';
  } else if (segmentName.toLowerCase().includes('inactive')) {
    message = 'Hi {customer_name}, we\'ve missed you! It\'s been a while since your last visit. Come back and enjoy 15% off your next purchase with code COMEBACK15.';
  } else if (segmentName.toLowerCase().includes('high value')) {
    message = 'Hi {customer_name}, as one of our most valued customers, we\'d like to offer you early access to our new collection. Plus, enjoy free shipping on your next order!';
  } else {
    message = 'Hi {customer_name}, we have some exciting news to share with you! Check out our latest offerings and let us know what you think.';
  }
  
  return {
    message,
    variables: ['{customer_name}', '{customer_email}']
  };
};

/**
 * Get smart scheduling recommendation for a campaign
 */
export const getSmartSchedulingRecommendation = async (segmentId: string): Promise<{
  success: boolean;
  data?: SchedulingRecommendation;
  message?: string;
}> => {
  try {
    // Remove the leading /api as apiClient already includes the base path
    const response = await apiClient.post('ai/smart-scheduling', { segmentId });
    return response.data;
  } catch (error) {
    console.error('Error getting smart scheduling recommendation:', error);
    return {
      success: false,
      message: 'Failed to get scheduling recommendation'
    };
  }
};
