import React, { useState } from 'react';
import { NextPage } from 'next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useSegments } from '@/hooks/useSegments';
import { useCreateCampaign } from '@/hooks/useCampaigns';
import { useRouter } from 'next/router';
import SegmentPicker from '@/components/segments/SegmentPicker';
import AIMessageGenerator from '@/components/campaigns/AIMessageGenerator';
import { toast } from 'react-hot-toast';

const CreateCampaign: NextPage = () => {
  const router = useRouter();
  const { segments, isLoading: isLoadingSegments } = useSegments();
  const { mutate: createCampaign, isLoading: isCreating } = useCreateCampaign();
  
  const [campaign, setCampaign] = useState({
    name: '',
    description: '',
    message: '',
    segmentId: '',
  });
  
  const [activeTab, setActiveTab] = useState('details');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCampaign((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSegmentChange = (segmentId: string) => {
    setCampaign((prev) => ({ ...prev, segmentId }));
  };
  
  const handleMessageGenerated = (message: string) => {
    setCampaign((prev) => ({ ...prev, message }));
    toast.success('Message applied to campaign');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!campaign.name) {
      toast.error('Campaign name is required');
      return;
    }
    
    if (!campaign.segmentId) {
      toast.error('Please select a segment');
      return;
    }
    
    if (!campaign.message) {
      toast.error('Campaign message is required');
      return;
    }
    
    createCampaign(campaign, {
      onSuccess: () => {
        toast.success('Campaign created successfully');
        router.push('/campaigns');
      },
    });
  };
  
  const selectedSegment = segments?.find(seg => seg._id === campaign.segmentId);
  
  return (
    <DashboardLayout>
      <div className="container px-4 mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          Create New Campaign
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 w-full bg-slate-900/50">
                  <TabsTrigger value="details">Campaign Details</TabsTrigger>
                  <TabsTrigger value="message">Message</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Campaign Name</label>
                    <Input
                      name="name"
                      value={campaign.name}
                      onChange={handleChange}
                      placeholder="Enter campaign name"
                      className="border-slate-200 dark:border-slate-700 bg-slate-900/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      name="description"
                      value={campaign.description}
                      onChange={handleChange}
                      placeholder="Enter campaign description"
                      className="border-slate-200 dark:border-slate-700 bg-slate-900/50 min-h-[120px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Segment</label>
                    <SegmentPicker
                      segments={segments || []}
                      selectedSegmentId={campaign.segmentId}
                      onSelect={handleSegmentChange}
                      isLoading={isLoadingSegments}
                    />
                  </div>
                  
                  <Button 
                    type="button"
                    onClick={() => setActiveTab('message')}
                    className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  >
                    Next: Create Message
                  </Button>
                </TabsContent>
                
                <TabsContent value="message" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Campaign Message</label>
                    <Textarea
                      name="message"
                      value={campaign.message}
                      onChange={handleChange}
                      placeholder="Enter your campaign message"
                      className="border-slate-200 dark:border-slate-700 bg-slate-900/50 min-h-[200px]"
                    />
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setActiveTab('details')}
                      className="border-slate-200 dark:border-slate-700 hover:bg-slate-800"
                    >
                      Back to Details
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isCreating}
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                    >
                      {isCreating ? 'Creating...' : 'Create Campaign'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="md:col-span-1 space-y-6">
              <AIMessageGenerator 
                campaignName={campaign.name}
                segmentInfo={selectedSegment?.name}
                onMessageGenerated={handleMessageGenerated}
              />
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

// Add this function to prevent static generation and ensure React Query works correctly
export async function getServerSideProps() {
  return {
    props: {}, // Will be passed to the page component as props
  };
}

export default CreateCampaign; 