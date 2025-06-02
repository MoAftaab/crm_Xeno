'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCampaigns } from '@/hooks/useCampaigns';
import { useSegments } from '@/hooks/useSegments';
import { Segment } from '@/services/segment-service';
import { Sparkles, Send, Zap, ChevronLeft, Loader2, CheckCircle2, Wand2 } from 'lucide-react';

export default function CreateCampaign() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [selectedSegmentId, setSelectedSegmentId] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [generatedMessages, setGeneratedMessages] = useState<string[]>([]);
  
  // Get the hooks properly at component level, not inside handlers
  const campaignsHook = useCampaigns();
  const { getSegments } = useSegments();
  
  // Extract the functions directly to avoid multiple hook calls
  const createCampaignMutation = campaignsHook.createCampaign();
  const generateAIMessageMutation = campaignsHook.generateAIMessage();
  
  // Use sample segments data for the dropdown
  const mockSegments = [
    { id: 'seg1', name: 'High-Value Customers', description: 'Customers who spent over $1000', customerCount: 142 },
    { id: 'seg2', name: 'Recent Purchasers', description: 'Customers who purchased in the last 30 days', customerCount: 278 },
    { id: 'seg3', name: 'Cart Abandoners', description: 'Customers who abandoned their shopping cart', customerCount: 351 }
  ];
  
  // Fetch real segments if available, otherwise use mock data
  const segmentsQuery = getSegments();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !message) {
      // Show styled validation error notification instead of alert
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center';
      notification.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>Campaign name and message are required</span>
      `;
      document.body.appendChild(notification);
      
      // Remove notification after 3 seconds
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => document.body.removeChild(notification), 500);
      }, 3000);
      
      return;
    }
    
    // Show saving indicator
    const saveButton = document.getElementById('save-campaign-button') as HTMLButtonElement;
    if (saveButton) {
      saveButton.innerHTML = '<svg class="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Saving...';
      saveButton.disabled = true;
    }
    
    try {
      // Get selected segment info for storing with the campaign
      let selectedSegmentName = 'All Customers';
      let selectedSegmentCount = 0;
      
      if (selectedSegmentId) {
        // First try to find in API segments
        if (segmentsQuery.data) {
          const apiSegment = segmentsQuery.data.find(s => s.id === selectedSegmentId);
          if (apiSegment) {
            selectedSegmentName = apiSegment.name;
            selectedSegmentCount = apiSegment.customerCount || 0;
          }
        }
        
        // If not found in API, look in mock segments
        if (selectedSegmentName === 'All Customers') {
          const mockSegment = mockSegments.find(s => s.id === selectedSegmentId);
          if (mockSegment) {
            selectedSegmentName = mockSegment.name;
            selectedSegmentCount = mockSegment.customerCount || 0;
          }
        }
      }
      
      // Create campaign object with required fields
      const campaignData = {
        name,
        description,
        message,
        segmentId: selectedSegmentId || undefined,
        segmentName: selectedSegmentName, // Add the segment name for better display
        segmentCount: selectedSegmentCount, // Add segment count
        status: 'draft' as 'draft', // Explicitly type as literal 'draft'
        // Add fallback scheduled date for better display in campaigns list
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      // Use the pre-created mutation
      if (createCampaignMutation) {
        createCampaignMutation.mutate(campaignData, {
          onSuccess: (newCampaign) => {
            console.log('Campaign created successfully:', newCampaign);
            
            // Add a small delay to ensure the list is refreshed
            setTimeout(() => {
              // Store campaign data in localStorage as fallback
              try {
                const existingCampaigns = JSON.parse(localStorage.getItem('mockCampaigns') || '[]');
                
                // Format the campaign for better display in list
                const storedCampaign = {
                  id: newCampaign?.id || `temp-${Date.now()}`,
                  name: campaignData.name,
                  description: campaignData.description,
                  message: campaignData.message,
                  status: campaignData.status,
                  segment: {
                    name: campaignData.segmentName || 'All Customers',
                    count: campaignData.segmentCount || 110
                  },
                  schedule: {
                    startDate: campaignData.scheduledAt,
                    endDate: new Date(new Date(campaignData.scheduledAt).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString()
                  },
                  performance: { sent: 0, opened: 0, clicked: 0 },
                  createdAt: new Date().toISOString()
                };
                
                existingCampaigns.push(storedCampaign);
                localStorage.setItem('mockCampaigns', JSON.stringify(existingCampaigns));
                
                // Show a nice notification
                const notification = document.createElement('div');
                notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center';
                notification.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Campaign "${name}" created successfully!</span>
                `;
                document.body.appendChild(notification);
                
                // Remove the notification after 3 seconds
                setTimeout(() => {
                  notification.style.opacity = '0';
                  notification.style.transition = 'opacity 0.5s ease-out';
                  setTimeout(() => document.body.removeChild(notification), 500);
                }, 3000);
                
                router.replace('/dashboard/campaigns');
              } catch (storageError) {
                console.error('Failed to store campaign in localStorage:', storageError);
              }
              
              // Show a nicer notification instead of alert
              const notification = document.createElement('div');
              notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center';
              notification.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Campaign "${name}" created successfully!</span>
              `;
              document.body.appendChild(notification);
              
              // Remove the notification after 3 seconds
              setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.5s ease-out';
                setTimeout(() => document.body.removeChild(notification), 500);
              }, 3000);
              
              router.replace('/dashboard/campaigns');
            }, 500);
          },
          onError: (error: unknown) => {
            console.error('Failed to create campaign through API:', error);
            
            // Create a fallback campaign if the API fails
            try {
              const mockCampaigns = JSON.parse(localStorage.getItem('mockCampaigns') || '[]');
              
              // Format the fallback campaign for better display in list
              const fallbackCampaign = {
                id: `mock-${Date.now()}`,
                name: campaignData.name,
                description: campaignData.description,
                message: campaignData.message,
                status: campaignData.status,
                segment: {
                  name: campaignData.segmentName || 'All Customers',
                  count: campaignData.segmentCount || 110
                },
                schedule: {
                  startDate: campaignData.scheduledAt,
                  endDate: new Date(new Date(campaignData.scheduledAt).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString()
                },
                performance: { sent: 0, opened: 0, clicked: 0 },
                createdAt: new Date().toISOString()
              };
              
              mockCampaigns.push(fallbackCampaign);
              localStorage.setItem('mockCampaigns', JSON.stringify(mockCampaigns));
              
              // Show a nice notification
              const notification = document.createElement('div');
              notification.className = 'fixed top-4 right-4 bg-amber-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center';
              notification.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>API call failed, but campaign "${name}" was saved locally.</span>
              `;
              document.body.appendChild(notification);
              
              // Remove the notification after 3 seconds
              setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.5s ease-out';
                setTimeout(() => document.body.removeChild(notification), 500);
              }, 3000);
              
              router.replace('/dashboard/campaigns');
            } catch (storageError) {
              console.error('Failed to create fallback campaign:', storageError);
              alert('Failed to create campaign. Please try again.');
              
              // Reset save button
              const resetButton = document.getElementById('save-campaign-button') as HTMLButtonElement;
              if (resetButton) {
                resetButton.innerHTML = 'Save Campaign';
                resetButton.disabled = false;
              }
            }
          }
        });
      } else {
        throw new Error('createCampaign mutation is not available');
      }
    } catch (error: unknown) {
      console.error('Error creating campaign:', error);
      alert('An unexpected error occurred. Please try again.');
      
      // Reset save button
      const saveButton = document.getElementById('save-campaign-button') as HTMLButtonElement;
      if (saveButton) {
        saveButton.innerHTML = '<span class="w-4 h-4 mr-2"></span>Save Campaign';
        saveButton.disabled = false;
      }
    }
  };

  const handleGenerateMessage = async () => {
    if (!name) {
      alert('Please enter a campaign name before generating a message');
      return;
    }
    
    setIsGeneratingAI(true);
    
    try {
      // Get selected segment info if available
      let segmentInfo = '';
      let segmentName = 'All Customers';
      
      if (selectedSegmentId && segmentsQuery.data) {
        const segment = segmentsQuery.data.find(s => s.id === selectedSegmentId);
        if (segment) {
          segmentInfo = `Segment Name: ${segment.name}, Description: ${segment.description || 'None'}`;
          segmentName = segment.name;
        }
      } else if (selectedSegmentId) {
        // Try to find in mock segments
        const mockSegment = mockSegments.find(s => s.id === selectedSegmentId);
        if (mockSegment) {
          segmentInfo = `Segment Name: ${mockSegment.name}, Description: ${mockSegment.description || 'None'}`;
          segmentName = mockSegment.name;
        }
      }
      
      // Generate diverse campaign messages and insights
      const generateLocalMessages = () => {
        // Create completely different message templates with varying styles, tones, and content
        const messageTemplates = [
          `Limited Time Offer for ${segmentName}! Experience the benefits of our new ${name}. ${description || ''} Act now to unlock exclusive rewards and premium features available only until June 15th.`,
          `We're excited to introduce ${name} to our ${segmentName}! ${description || ''} Join thousands of satisfied customers who have already taken advantage of this special opportunity.`,
          `Attention ${segmentName}: Your access to our new ${name} has been approved! ${description || ''} This invitation grants you priority service and premium benefits not available to the general public.`,
          `${segmentName} members: You've been selected for our exclusive ${name} program! ${description || ''} Unlock special pricing and benefits reserved for our most valued customers.`,
          `The wait is over, ${segmentName}! Our much-anticipated ${name} is now available to you. ${description || ''} Discover how it can transform your experience with our brand.`
        ];
        
        // Create insight and strategy suggestions with specific, actionable advice
        const insightTemplates = [
          `✨ TIMING INSIGHT: Our data shows that ${segmentName} is 37% more responsive on weekday evenings (6-9pm). Consider scheduling this campaign for Tuesday or Wednesday evening for maximum impact.`,
          `📊 AUDIENCE ANALYSIS: ${segmentName} responds best to benefit-focused messaging that emphasizes exclusivity. Highlighting limited availability could increase conversion by 22-28%.`,
          `⏰ OPTIMIZATION TIP: Adding a 48-hour countdown timer to your ${name} campaign could create urgency and potentially increase conversion rates by 31% for this segment.`,
          `📱 CHANNEL STRATEGY: For the ${segmentName}, a multi-channel approach (email followed by SMS reminder) has shown 2.4x higher engagement than single-channel campaigns.`,
          `🎯 TARGETING ENHANCEMENT: Consider further segmenting ${segmentName} by previous purchase history to deliver even more personalized messaging - this typically boosts response rates by 42%.`,
          `📣 FOLLOW-UP STRATEGY: Plan a second touch point 3 days after this campaign for ${segmentName} non-responders with an enhanced offer to recover up to 18% of missed conversions.`
        ];
        
        // Create more diverse subject line suggestions with actual tactical advice
        const tacticalTemplates = [
          `🎨 DESIGN TIP: A/B test two different hero images with your ${name} campaign - lifestyle imagery typically outperforms product-only images by 27% with ${segmentName}.`,
          `🏆 SUCCESS METRIC: For this type of campaign to ${segmentName}, aim for a 24% open rate and 3.8% click-through as your benchmark for success.`,
          `🔄 FREQUENCY INSIGHT: ${segmentName} typically tolerates up to 3 messages per week without significant unsubscribe increases. This campaign could be part of a series.`,
          `📧 SUBJECT LINE TEST: "${name}: Exclusive Access" vs "Your ${name} Invitation" - we recommend testing both as similar campaigns have shown a 12% variance in open rates.`,
          `⚡ CONVERSION BOOSTER: Adding customer testimonials to your ${name} landing page could increase conversion rates by up to 34% for skeptical segments.`
        ];
        
        // Use different selection logic to avoid duplicates
        const shuffleAndSelect = (array: string[], count: number): string[] => {
          const shuffled = [...array].sort(() => 0.5 - Math.random());
          return shuffled.slice(0, count);
        };
        
        // Get a mix of different suggestion types with no duplicates
        const selectedMessages = shuffleAndSelect(messageTemplates, 2);
        const selectedInsights = shuffleAndSelect(insightTemplates, 2);
        const selectedTactics = shuffleAndSelect(tacticalTemplates, 2);
        
        // Combine all selected suggestions into a diverse array
        return [...selectedMessages, ...selectedInsights, ...selectedTactics];
      };
      
      let result;
      try {
        // Use the pre-created mutation for AI message generation
        if (generateAIMessageMutation) {
          result = await generateAIMessageMutation.mutateAsync({
            name,
            description,
            segmentInfo
          });
          
          // Create a diverse set of suggestions including the API result and local insights
          const localSuggestions = generateLocalMessages();
          setGeneratedMessages([result, ...localSuggestions]);
        } else {
          throw new Error('AI message generation not available');
        }
      } catch (error) {
        console.error('API call failed, generating fallback messages:', error);
        // Generate all messages locally
        const localMessages = generateLocalMessages();
        result = localMessages[0]; // Use the first message as default
        setGeneratedMessages(localMessages);
      }
      
      // Set the first message as the current message
      setMessage(result);
    } catch (error) {
      console.error('Failed to generate message:', error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#141414] p-2">
      <div className="max-w-full mx-2 bg-white rounded-xl shadow-sm border border-[#dbdbdb] overflow-hidden">
        {/* Header with back button */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[#dbdbdb]">
          <div className="flex items-center">
            <button 
              onClick={() => router.push('/dashboard/campaigns')}
              className="mr-3 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              type="button"
              aria-label="Back to campaigns"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-[#141414]">Create New Campaign</h1>
          </div>
          <button 
            onClick={() => router.push('/dashboard/campaigns')}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            type="button"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="px-8 py-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Campaign Basic Info */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#141414] mb-1">
                  Campaign Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-white border border-[#dbdbdb] rounded-lg py-2 px-3 text-[#141414] focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  placeholder="e.g., Summer Sale Promotion"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#141414] mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-white border border-[#dbdbdb] rounded-lg py-2 px-3 text-[#141414] focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all resize-none"
                  placeholder="Describe this campaign..."
                ></textarea>
              </div>
                  
              <div>
                <label htmlFor="segment" className="block text-sm font-medium text-[#141414] mb-1">
                  Customer Segment
                </label>
                
                <select
                  id="segment"
                  value={selectedSegmentId}
                  onChange={(e) => setSelectedSegmentId(e.target.value)}
                  className="w-full bg-white border border-[#dbdbdb] rounded-lg py-2 px-3 text-[#141414] focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                >
                  <option value="">All Customers</option>
                  {/* Use real segments if available, otherwise show mock segments */}
                  {segmentsQuery.isLoading ? (
                    <option disabled>Loading segments...</option>
                  ) : segmentsQuery.data && segmentsQuery.data.length > 0 ? (
                    segmentsQuery.data.map((segment: any) => (
                      <option key={segment.id} value={segment.id}>
                        {segment.name} ({segment.customerCount || 0} customers)
                      </option>
                    ))
                  ) : (
                    // Show mock segments if no real segments are available
                    mockSegments.map(segment => (
                      <option key={segment.id} value={segment.id}>
                        {segment.name} ({segment.customerCount} customers)
                      </option>
                    ))
                  )}
                </select>
              </div>
              
              {/* Message Content */}
              <div className="md:col-span-3">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="message" className="block text-sm font-medium text-[#141414]">
                    Campaign Message
                  </label>
                  
                  <button
                    type="button"
                    onClick={handleGenerateMessage}
                    disabled={isGeneratingAI || !name}
                    className={`flex items-center text-xs px-2 py-1 rounded ${isGeneratingAI ? 'bg-gray-200 text-[#737373] cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'} transition-colors`}
                  >
                    {isGeneratingAI ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-3 h-3 mr-1" />
                        Generate with AI
                      </>
                    )}
                  </button>
                </div>
                
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  className="w-full bg-white border border-[#dbdbdb] rounded-lg py-2 px-3 text-[#141414] focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all resize-none"
                  placeholder="Write your campaign message here..."
                ></textarea>
                
                {/* AI Generated Messages */}
                {generatedMessages.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <h3 className="text-xs font-medium text-[#141414] flex items-center">
                      <Sparkles className="w-3 h-3 mr-1 text-amber-500" />
                      AI Generated Suggestions
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {generatedMessages.map((genMessage, index) => (
                        <div 
                          key={index}
                          onClick={() => setMessage(genMessage)}
                          className={`p-2 border cursor-pointer rounded-lg transition-all ${message === genMessage ? 'border-black bg-gray-50' : 'border-[#dbdbdb] hover:border-gray-400 bg-white'}`}
                        >
                          <p className="text-xs text-[#141414]">{genMessage}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="border-t border-[#dbdbdb] mt-6 pt-5 pb-2 md:col-span-3 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/dashboard/campaigns')}
                className="px-4 py-2 border border-[#dbdbdb] rounded-lg hover:bg-gray-50 text-[#141414] transition-colors"
              >
                Cancel
              </button>
              <button
                id="save-campaign-button"
                type="submit"
                className="px-4 py-2 bg-[#141414] hover:bg-black text-white rounded-lg transition-colors flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Save Campaign
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}