import React from 'react';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAnalyzeSegment, SegmentData } from '@/hooks/useAI';
import { Sparkles, RefreshCw, Loader2 } from 'lucide-react';
import { Segment, SegmentCondition } from '@/services/segment-service';

interface SegmentInsightsProps {
  segment: Segment | {
    _id?: string;
    id?: string;
    name: string;
    description?: string;
    conditions: Array<{
      field: string;
      operator: string;
      value: string | number | boolean;
    }>;
    customerCount?: number;
  };
}

const SegmentInsights: React.FC<SegmentInsightsProps> = ({ segment }) => {
  const [insights, setInsights] = React.useState<string>('');
  
  const { 
    mutate: analyzeSegment, 
    isLoading 
  } = useAnalyzeSegment();
  
  const handleAnalyze = () => {
    // Convert conditions to ensure they match the SegmentData interface
    const mappedConditions = segment.conditions.map(condition => ({
      field: condition.field,
      operator: condition.operator,
      value: condition.value
    }));
    
    const segmentData: SegmentData = {
      name: segment.name,
      description: segment.description,
      conditions: mappedConditions,
      customerCount: segment.customerCount
    };
    
    analyzeSegment(segmentData, {
      onSuccess: (analysis) => {
        setInsights(analysis);
      }
    });
  };
  
  return (
    <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-950/50 to-slate-900/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          AI Segment Insights
        </CardTitle>
        <CardDescription>
          Get strategic insights about this segment
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!insights ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-slate-400 mb-4">
              Generate AI-powered insights about this customer segment to improve your marketing strategy.
            </p>
            <Button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Insights
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-sm">
                {insights}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleAnalyze}
                disabled={isLoading}
                className="flex items-center gap-1 text-slate-400 hover:text-slate-100"
              >
                <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
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

export default SegmentInsights; 