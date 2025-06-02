import React from 'react';
import { Segment, SegmentCondition } from '@/services/segment-service';
import { Target, ListFilter, AlertCircle } from 'lucide-react';

interface SegmentRulesProps {
  segment?: Segment;
  conditions?: SegmentCondition[];
}

const SegmentRules = ({ segment, conditions: propConditions }: SegmentRulesProps) => {
  // Use conditions from segment or direct conditions prop
  const conditions = propConditions || (segment?.conditions || []);
  
  if (conditions.length === 0) {
    return (
      <div className="p-6 border border-gray-700 rounded-lg bg-gray-800/50 text-center">
        <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
        <h3 className="text-lg font-medium text-gray-200">No Rules Defined</h3>
        <p className="text-sm text-gray-400 mt-1">This segment doesn't have any filtering rules.</p>
      </div>
    );
  }

  const getOperatorLabel = (operator: string): string => {
    const operatorMap: Record<string, string> = {
      'eq': 'equals',
      'neq': 'does not equal',
      'gt': 'greater than',
      'gte': 'greater than or equal to',
      'lt': 'less than',
      'lte': 'less than or equal to',
      'contains': 'contains',
      'starts_with': 'starts with',
      'ends_with': 'ends with'
    };
    return operatorMap[operator] || operator;
  };

  const getFieldLabel = (field: string): string => {
    const fieldMap: Record<string, string> = {
      'name': 'Name',
      'email': 'Email',
      'totalSpent': 'Total Spent',
      'orderCount': 'Order Count',
      'lastOrderDate': 'Last Order Date',
      'country': 'Country',
      'city': 'City',
      'phone': 'Phone'
    };
    return fieldMap[field] || field;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center text-blue-400 font-medium mb-2">
        <Target className="h-5 w-5 mr-2" />
        <span>Segment Conditions</span>
      </div>
      
      <div className="space-y-3">
        {conditions.map((condition: SegmentCondition, index: number) => (
          <div key={index} className="p-4 border border-gray-700 rounded-lg bg-gray-800/50">
            <div className="flex items-center">
              <ListFilter className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <div className="flex items-center flex-wrap gap-1 text-sm">
                  <span className="font-medium text-gray-300">{getFieldLabel(condition.field)}</span>
                  <span className="text-blue-400">{getOperatorLabel(condition.operator)}</span>
                  <span className="font-medium text-white bg-blue-600/20 px-2 py-0.5 rounded">
                    {condition.value}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-gray-400 mt-4">
        <p>All conditions must be met for a customer to be included in this segment.</p>
      </div>
    </div>
  );
};

export default SegmentRules;
