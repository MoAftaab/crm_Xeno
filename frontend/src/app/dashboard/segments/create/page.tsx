'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSegments } from '@/hooks/useSegments';
import { SegmentCondition } from '@/services/segment-service';
import { ChevronLeft, Loader2, PlusCircle, Save, X, Filter, Users, Zap } from 'lucide-react';

// Available fields for segment conditions
const FIELD_OPTIONS = [
  { value: 'name', label: 'Customer Name', type: 'string' },
  { value: 'email', label: 'Email', type: 'string' },
  { value: 'phone', label: 'Phone Number', type: 'string' },
  { value: 'status', label: 'Status', type: 'string' },
  { value: 'company', label: 'Company', type: 'string' },
  { value: 'totalSpent', label: 'Total Spent', type: 'number' },
  { value: 'orderCount', label: 'Order Count', type: 'number' },
  { value: 'lastOrderDate', label: 'Last Order Date', type: 'date' },
  { value: 'createdAt', label: 'Created Date', type: 'date' },
];

// Operator options based on field type
const OPERATOR_OPTIONS = {
  string: [
    { value: 'equals', label: 'Equals' },
    { value: 'notEquals', label: 'Does not equal' },
    { value: 'contains', label: 'Contains' },
    { value: 'notContains', label: 'Does not contain' },
  ],
  number: [
    { value: 'equals', label: 'Equals' },
    { value: 'notEquals', label: 'Does not equal' },
    { value: 'greaterThan', label: 'Greater than' },
    { value: 'lessThan', label: 'Less than' },
  ],
  date: [
    { value: 'equals', label: 'Is exactly' },
    { value: 'greaterThan', label: 'Is after' },
    { value: 'lessThan', label: 'Is before' },
  ],
};

export default function CreateSegmentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [conditions, setConditions] = useState<SegmentCondition[]>([
    { field: 'status', operator: 'equals', value: 'active' }
  ]);
  
  const { createSegment } = useSegments();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleAddCondition = () => {
    setConditions([...conditions, { field: 'name', operator: 'contains', value: '' }]);
  };

  const handleRemoveCondition = (index: number) => {
    const newConditions = [...conditions];
    newConditions.splice(index, 1);
    setConditions(newConditions);
  };

  const handleConditionChange = (index: number, field: string, value: any) => {
    const newConditions = [...conditions];
    
    // If changing the field, reset the operator to a valid one for the new field type
    if (field === 'field') {
      const fieldType = FIELD_OPTIONS.find(option => option.value === value)?.type || 'string';
      newConditions[index] = {
        ...newConditions[index],
        field: value,
        operator: OPERATOR_OPTIONS[fieldType as keyof typeof OPERATOR_OPTIONS][0].value as SegmentCondition['operator'],
        value: '',
      };
    } else {
      newConditions[index] = {
        ...newConditions[index],
        [field]: value,
      };
    }
    
    setConditions(newConditions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (conditions.length === 0) {
      alert('Please add at least one condition');
      return;
    }
    
    createSegment().mutate({
      name,
      description,
      conditions,
    }, {
      onSuccess: () => {
        router.push('/dashboard/segments');
      }
    });
  };

  // Get field type for a condition
  const getFieldType = (fieldName: string): 'string' | 'number' | 'date' => {
    return FIELD_OPTIONS.find(option => option.value === fieldName)?.type as 'string' | 'number' | 'date' || 'string';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <button 
              onClick={() => router.push('/dashboard/segments')}
              className="mr-4 p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Create New Segment</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 shadow-lg">
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Segment Basic Info */}
                <div>
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                    Segment Details
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                        Segment Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-gray-800/70 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="High Value Customers"
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
                        placeholder="Brief description of this customer segment"
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                {/* Segment Conditions */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Define Segment Rules
                    </h2>
                    
                    <div className="bg-gray-800/50 rounded-lg py-1 px-2 text-sm text-gray-400 flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>Estimated audience: Calculating...</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-6">
                      <div className="flex items-center text-sm text-gray-300 mb-2">
                        <Filter className="w-4 h-4 mr-2 text-blue-400" />
                        <span>Customers who match <strong>ALL</strong> of the following conditions:</span>
                      </div>
                      
                      <div className="space-y-4 mt-4">
                        {conditions.map((condition, index) => {
                          const fieldType = getFieldType(condition.field);
                          return (
                            <div key={index} className="flex flex-wrap gap-3 items-center">
                              <div className="min-w-[180px]">
                                <select
                                  value={condition.field}
                                  onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
                                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  {FIELD_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              
                              <div className="min-w-[180px]">
                                <select
                                  value={condition.operator}
                                  onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
                                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  {OPERATOR_OPTIONS[fieldType].map(option => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              
                              <div className="flex-grow">
                                {fieldType === 'date' ? (
                                  <input
                                    type="date"
                                    value={condition.value as string}
                                    onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                ) : fieldType === 'number' ? (
                                  <input
                                    type="number"
                                    value={condition.value as number}
                                    onChange={(e) => handleConditionChange(index, 'value', Number(e.target.value))}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter value"
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={condition.value as string}
                                    onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter value"
                                  />
                                )}
                              </div>
                              
                              <button
                                type="button"
                                onClick={() => handleRemoveCondition(index)}
                                className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                                disabled={conditions.length === 1}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={handleAddCondition}
                          className="flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium"
                        >
                          <PlusCircle className="w-4 h-4 mr-1" />
                          Add Another Condition
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-gray-800 rounded-lg bg-purple-900/10">
                      <div className="flex items-start">
                        <Zap className="w-5 h-5 text-purple-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-purple-300">Tip: Create Effective Segments</p>
                          <p className="text-xs text-gray-300 mt-1">
                            Build powerful segments by combining multiple conditions. For example, "active customers who spent over $500 in the last 90 days".
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-800">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => router.push('/dashboard/segments')}
                      className="mr-3 px-5 py-2.5 border border-gray-700 hover:bg-gray-800 rounded-lg text-gray-300 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createSegment().isLoading || !name || conditions.length === 0}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg transition-all duration-300 flex items-center disabled:opacity-70"
                    >
                      {createSegment().isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Segment
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