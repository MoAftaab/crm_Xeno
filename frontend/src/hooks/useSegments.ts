import { useQuery, useMutation, useQueryClient } from 'react-query';
import { segmentService, Segment, SegmentInput } from '../services/segment-service';
import { Customer } from '../services/customer-service';

export const useSegments = () => {
  const queryClient = useQueryClient();

  // Get all segments
  const getSegments = () => {
    return useQuery('segments', segmentService.getSegments);
  };

  // Get segment by ID
  const getSegmentById = (id: string) => {
    return useQuery(['segment', id], () => segmentService.getSegmentById(id), {
      enabled: !!id, // Only run if id is provided
    });
  };

  // Create segment
  const createSegment = () => {
    return useMutation((newSegment: SegmentInput) => segmentService.createSegment(newSegment), {
      onSuccess: () => {
        // Invalidate and refetch segments list
        queryClient.invalidateQueries('segments');
      },
    });
  };

  // Update segment
  const updateSegment = () => {
    return useMutation(
      ({ id, data }: { id: string; data: Partial<SegmentInput> }) => 
        segmentService.updateSegment(id, data),
      {
        onSuccess: (data) => {
          // Update cache for specific segment and segment list
          queryClient.invalidateQueries('segments');
          queryClient.invalidateQueries(['segment', data.id]);
        },
      }
    );
  };

  // Delete segment
  const deleteSegment = () => {
    return useMutation((id: string) => segmentService.deleteSegment(id), {
      onSuccess: () => {
        // Invalidate and refetch segments list
        queryClient.invalidateQueries('segments');
      },
    });
  };

  // Get customers in segment
  const getCustomersInSegment = (segmentId: string) => {
    return useQuery<Customer[]>(
      ['segment', segmentId, 'customers'], 
      () => segmentService.getCustomersInSegment(segmentId),
      {
        enabled: !!segmentId,
      }
    );
  };

  return {
    getSegments,
    getSegmentById,
    createSegment,
    updateSegment,
    deleteSegment,
    getCustomersInSegment,
  };
}; 