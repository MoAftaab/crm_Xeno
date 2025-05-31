import apiClient from '../lib/api-client';
import { Customer } from './customer-service';

export interface SegmentCondition {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'greaterThan' | 'lessThan';
  value: string | number | boolean;
}

export interface Segment {
  id: string;
  name: string;
  description?: string;
  conditions: SegmentCondition[];
  customerCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SegmentInput {
  name: string;
  description?: string;
  conditions: SegmentCondition[];
}

export const segmentService = {
  getSegments: async (): Promise<Segment[]> => {
    const response = await apiClient.get<Segment[]>('/segments');
    return response.data;
  },

  getSegmentById: async (id: string): Promise<Segment> => {
    const response = await apiClient.get<Segment>(`/segments/${id}`);
    return response.data;
  },

  createSegment: async (segment: SegmentInput): Promise<Segment> => {
    const response = await apiClient.post<Segment>('/segments', segment);
    return response.data;
  },

  updateSegment: async (id: string, segment: Partial<SegmentInput>): Promise<Segment> => {
    const response = await apiClient.put<Segment>(`/segments/${id}`, segment);
    return response.data;
  },

  deleteSegment: async (id: string): Promise<void> => {
    await apiClient.delete(`/segments/${id}`);
  },
  
  getCustomersInSegment: async (id: string): Promise<Customer[]> => {
    const response = await apiClient.get<Customer[]>(`/segments/${id}/customers`);
    return response.data;
  }
}; 