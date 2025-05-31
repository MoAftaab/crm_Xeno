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
  
  const { createCampaign } = useCampaigns();
  const { getSegments } = useSegments();
  const { generateAIMessage } = useCampaigns();
  const segmentsQuery = getSegments();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    createCampaign().mutate({
      name,
      description,
      message,
      segmentId: selectedSegmentId || undefined,
      status: 'draft'
    }, {
      onSuccess: () => {
        router.push('/dashboard/campaigns');
      }
    });
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
      if (selectedSegmentId && segmentsQuery.data) {
        const segment = segmentsQuery.data.find(s => s.id === selectedSegmentId);
        if (segment) {
          segmentInfo = `Segment Name: ${segment.name}, Description: ${segment.description || 'None'}`;
        }
      }
      
      const result = await generateAIMessage().mutateAsync({
        name,
        description,
        segmentInfo
      });
      
      // Add to generated messages
      setGeneratedMessages(prev => [result, ...prev]);
      
      // Set as current message
      setMessage(result);
    } catch (error) {
      console.error('Failed to generate message:', error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <button 
              onClick={() => router.push('/dashboard/campaigns')}
              className="mr-4 p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Create New Campaign</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 shadow-lg">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Campaign Basic Info */}
                <div>
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                    Campaign Details
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                        Campaign Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-gray-800/70 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Summer Sale Promotion"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        className="w-full bg-gray-800/70 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                        placeholder="Brief description of your campaign"
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                {/* Audience Targeting */}
                <div>
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                    Audience Targeting
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="segment" className="block text-sm font-medium text-gray-300 mb-1">
                        Customer Segment
                      </label>
                      
                      {segmentsQuery.isLoading ? (
                        <div className="flex items-center text-gray-400 text-sm py-2">
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading segments...
                        </div>
                      ) : segmentsQuery.isError ? (
                        <div className="text-red-400 text-sm py-2">
                          Error loading segments. Please try again.
                        </div>
                      ) : (segmentsQuery.data?.length || 0) === 0 ? (
                        <div className="p-4 border border-gray-800 rounded-lg bg-gray-800/30 text-gray-400">
                          No segments found. Create a segment first to target specific customers.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div 
                            className={`p-3 border ${!selectedSegmentId ? 'border-blue-500/50 bg-blue-900/20' : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'} rounded-lg cursor-pointer transition-all duration-300`}
                            onClick={() => setSelectedSegmentId('')}
                          >
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-full border-2 ${!selectedSegmentId ? 'border-blue-500 bg-blue-500/30' : 'border-gray-500'} mr-3 flex items-center justify-center`}>
                                {!selectedSegmentId && <CheckCircle2 className="w-3 h-3 text-blue-400" />}
                              </div>
                              <div>
                                <p className="font-medium text-gray-200">All Customers</p>
                                <p className="text-xs text-gray-400">Target everyone in your database</p>
                              </div>
                            </div>
                          </div>
                          
                          {segmentsQuery.data?.map((segment: Segment) => (
                            <div 
                              key={segment.id}
                              className={`p-3 border ${selectedSegmentId === segment.id ? 'border-blue-500/50 bg-blue-900/20' : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'} rounded-lg cursor-pointer transition-all duration-300`}
                              onClick={() => setSelectedSegmentId(segment.id)}
                            >
                              <div className="flex items-center">
                                <div className={`w-5 h-5 rounded-full border-2 ${selectedSegmentId === segment.id ? 'border-blue-500 bg-blue-500/30' : 'border-gray-500'} mr-3 flex items-center justify-center`}>
                                  {selectedSegmentId === segment.id && <CheckCircle2 className="w-3 h-3 text-blue-400" />}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-200">{segment.name}</p>
                                  <p className="text-xs text-gray-400">{segment.customerCount || 0} customers</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Message Content */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                      Message Content
                    </h2>
                    
                    <button
                      type="button"
                      onClick={handleGenerateMessage}
                      disabled={isGeneratingAI || !name}
                      className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGeneratingAI ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Generate with AI
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={6}
                        className="w-full bg-gray-800/70 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Write your campaign message here..."
                      ></textarea>
                    </div>
                    
                    {/* AI Generated Suggestions */}
                    {generatedMessages.length > 0 && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center">
                          <Sparkles className="w-4 h-4 mr-1 text-purple-400" />
                          AI Generated Options
                        </h3>
                        <div className="space-y-3">
                          {generatedMessages.map((msg, index) => (
                            <div 
                              key={index}
                              className="p-3 border border-gray-700 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 cursor-pointer transition-all duration-300"
                              onClick={() => setMessage(msg)}
                            >
                              <p className="text-sm text-gray-300">{msg}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-800">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => router.push('/dashboard/campaigns')}
                      className="mr-3 px-5 py-2.5 border border-gray-700 hover:bg-gray-800 rounded-lg text-gray-300 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createCampaign().isLoading}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg transition-all duration-300 flex items-center disabled:opacity-70"
                    >
                      {createCampaign().isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Create Campaign
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 