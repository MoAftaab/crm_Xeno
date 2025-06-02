import { useRouter } from 'next/router';
import { NextPage } from 'next';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useSegment } from '@/hooks/useSegments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomerList from '@/components/customers/CustomerList';
import SegmentRules from '@/components/segments/SegmentRules';
import SegmentInsights from '@/components/segments/SegmentInsights';
import { ArrowLeft, Users, Filter, Sparkles } from 'lucide-react';
import Link from 'next/link';

const SegmentDetails: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const segmentId = typeof id === 'string' ? id : '';
  
  const { segment, isLoading, error } = useSegment(segmentId);
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container px-4 mx-auto py-8">
          <div className="animate-pulse">
            <div className="h-8 w-1/3 bg-slate-700 rounded mb-6"></div>
            <div className="h-64 bg-slate-800 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (error || !segment) {
    return (
      <DashboardLayout>
        <div className="container px-4 mx-auto py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">Segment not found</h2>
            <p className="text-slate-400 mb-6">The segment you're looking for doesn't exist or you don't have access to it.</p>
            <Link 
              href="/segments" 
              className="text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to segments
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="container px-4 mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link 
              href="/segments" 
              className="text-sm text-slate-400 hover:text-slate-300 flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to segments
            </Link>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              {segment.name}
            </h1>
            {segment.description && (
              <p className="text-slate-400 mt-2">{segment.description}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full">
            <Users className="h-4 w-4 text-indigo-400" />
            <span className="text-sm">{segment.customerCount || 0} customers</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="customers" className="w-full">
              <TabsList className="grid grid-cols-2 w-full bg-slate-900/50">
                <TabsTrigger value="customers" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Customers
                </TabsTrigger>
                <TabsTrigger value="rules" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Segment Rules
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="customers">
                <Card className="border-slate-200 dark:border-slate-800 bg-slate-900/30">
                  <CardHeader>
                    <CardTitle>Customers in Segment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CustomerList segmentId={segment._id} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="rules">
                <Card className="border-slate-200 dark:border-slate-800 bg-slate-900/30">
                  <CardHeader>
                    <CardTitle>Segment Rules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SegmentRules conditions={segment.conditions} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="md:col-span-1">
            <SegmentInsights segment={segment} />
          </div>
        </div>
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

export default SegmentDetails; 