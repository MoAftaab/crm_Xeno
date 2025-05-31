import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export interface MessageGenerationParams {
  campaignName: string;
  description?: string;
  segmentInfo?: string;
  tone?: 'professional' | 'friendly' | 'persuasive';
}

export const aiService = {
  /**
   * Generate a personalized campaign message using AI
   * @param params Parameters for message generation
   * @returns Generated message
   */
  generateCampaignMessage: async (params: MessageGenerationParams): Promise<string> => {
    try {
      if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured in environment variables');
      }
      
      const { campaignName, description, segmentInfo, tone = 'professional' } = params;
      
      // Construct a prompt for the AI model
      const prompt = `
        Generate a personalized marketing campaign message with the following details:
        
        Campaign Name: ${campaignName}
        ${description ? `Description: ${description}` : ''}
        ${segmentInfo ? `Target Audience: ${segmentInfo}` : ''}
        
        Tone: ${tone}
        
        The message should be personalized, compelling, and tailored to the target audience.
        Keep it concise (around 150 words) and include a clear call to action.
        Don't use placeholder text like [Name] or [Company] - make it ready to send.
      `;
      
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        }
      );
      
      // Extract the generated text from the response
      const generatedText = response.data.candidates[0].content.parts[0].text;
      
      // Clean up the text (remove quotes, extra whitespace, etc.)
      return generatedText.trim();
      
    } catch (error: any) {
      console.error('AI message generation failed:', error);
      
      // Fallback response if the API call fails
      if (error.message?.includes('GEMINI_API_KEY')) {
        throw new Error('AI service is not properly configured. Please check your environment variables.');
      }
      
      throw new Error('Failed to generate AI message. Please try again later.');
    }
  },
  
  /**
   * Analyze customer segment for insights
   * @param segmentData Segment data to analyze
   * @returns AI insights about the segment
   */
  analyzeSegment: async (segmentData: any): Promise<string> => {
    try {
      if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not configured in environment variables');
      }
      
      const prompt = `
        Analyze the following customer segment data and provide strategic insights:
        
        Segment Name: ${segmentData.name}
        ${segmentData.description ? `Description: ${segmentData.description}` : ''}
        
        Segment Conditions:
        ${segmentData.conditions.map((condition: any) => 
          `- ${condition.field} ${condition.operator} ${condition.value}`
        ).join('\n')}
        
        Customer Count: ${segmentData.customerCount || 'Unknown'}
        
        Provide 3-5 bullet points with strategic insights about this segment that could help with marketing campaigns.
        Focus on actionable recommendations.
      `;
      
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        }
      );
      
      // Extract the generated text from the response
      const generatedText = response.data.candidates[0].content.parts[0].text;
      
      return generatedText.trim();
      
    } catch (error) {
      console.error('AI segment analysis failed:', error);
      throw new Error('Failed to analyze segment with AI. Please try again later.');
    }
  }
}; 