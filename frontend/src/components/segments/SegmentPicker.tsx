import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSegments } from '@/hooks/useSegments';
import { Segment } from '@/services/segment-service';

interface SegmentPickerProps {
  value?: string;
  onChange?: (segmentId: string) => void;
  onSelect?: (segmentId: string) => void;
  segments?: Segment[];
  isLoading?: boolean;
  selectedSegmentId?: string;
}

const SegmentPicker = ({ value, onChange, onSelect, segments: propSegments, isLoading: propIsLoading, selectedSegmentId }: SegmentPickerProps) => {
  // Use props if provided, otherwise use the hook
  const segmentsHook = useSegments();
  const segments = propSegments || segmentsHook.segments;
  const isLoading = propIsLoading !== undefined ? propIsLoading : segmentsHook.isLoading;
  const [selectedId, setSelectedId] = useState<string>(selectedSegmentId || value || '');

  useEffect(() => {
    if (value) {
      setSelectedId(value);
    }
  }, [value]);

  const handleChange = (newValue: string) => {
    setSelectedId(newValue);
    // Call either or both callbacks if they exist
    if (onChange) onChange(newValue);
    if (onSelect) onSelect(newValue);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-200 mb-1">
        Select Segment
      </label>
      <Select value={selectedId} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a segment" />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <SelectItem value="loading" disabled>
              Loading segments...
            </SelectItem>
          ) : segments && segments.length > 0 ? (
            segments.map((segment: Segment) => (
              <SelectItem key={segment.id} value={segment.id}>
                {segment.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>
              No segments available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SegmentPicker;
