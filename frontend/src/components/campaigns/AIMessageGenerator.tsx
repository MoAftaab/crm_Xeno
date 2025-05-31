import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useGenerateAIMessage, MessageGenerationParams } from '@/hooks/useAI';
import { Loader2, Sparkles, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AIMessageGeneratorProps {
  campaignName?: string;
  segmentInfo?: string;
  onMessageGenerated?: (message: string) => void;
}

const AIMessageGenerator = ({ 
  campaignName = '', 
  segmentInfo = '',
  onMessageGenerated 
}: AIMessageGeneratorProps) => {
  const [params, setParams] = useState<MessageGenerationParams>({
    campaignName: campaignName,
    description: '',
    segmentInfo: segmentInfo,
    tone: 'professional'
  });
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  
  const { mutate: generateMessage, isLoading } = useGenerateAIMessage();
  
  const handleGenerate = () => {
    generateMessage(params, {
      onSuccess: (message) => {
        setGeneratedMessage(message);
        if (onMessageGenerated) {
          onMessageGenerated(message);
        }
      }
    });
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    toast.success('Message copied to clipboard');
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
  };
  
  const handleToneChange = (value: string) => {
    setParams(prev => ({ 
      ...prev, 
      tone: value as 'professional' | 'friendly' | 'persuasive' 
    }));
  };

  return (
    <Card className="w-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-950/50 to-slate-900/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          AI Message Generator
        </CardTitle>
        <CardDescription>
          Generate personalized campaign messages with AI
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Campaign Name</label>
          <Input
            name="campaignName"
            value={params.campaignName}
            onChange={handleInputChange}
            placeholder="Enter campaign name"
            className="border-slate-200 dark:border-slate-700 bg-slate-900/50"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Campaign Description</label>
          <Textarea
            name="description"
            value={params.description}
            onChange={handleInputChange}
            placeholder="Describe your campaign objectives"
            className="border-slate-200 dark:border-slate-700 bg-slate-900/50 min-h-[80px]"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Target Audience</label>
          <Textarea
            name="segmentInfo"
            value={params.segmentInfo}
            onChange={handleInputChange}
            placeholder="Describe your target audience"
            className="border-slate-200 dark:border-slate-700 bg-slate-900/50"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Message Tone</label>
          <Select 
            defaultValue={params.tone} 
            onValueChange={handleToneChange}
          >
            <SelectTrigger className="border-slate-200 dark:border-slate-700 bg-slate-900/50">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="persuasive">Persuasive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleGenerate}
          disabled={isLoading || !params.campaignName}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>Generate Message</>
          )}
        </Button>
        
        {generatedMessage && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Generated Message</h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopy}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-slate-100"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-slate-100"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            <div className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-900/30 p-3 text-sm whitespace-pre-wrap">
              {generatedMessage}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between text-xs text-slate-500 pt-0">
        <div>Powered by Google Gemini AI</div>
      </CardFooter>
    </Card>
  );
};

export default AIMessageGenerator; 