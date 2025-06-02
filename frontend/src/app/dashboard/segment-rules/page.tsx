'use client';

import { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Trash2, 
  Save, 
  X, 
  ChevronRight,
  Users,
  ShoppingCart,
  Calendar,
  DollarSign,
  Tag,
  Clock
} from 'lucide-react';

// Mock segment data
const mockSegments = [
  { 
    id: '1',
    name: 'High Value Customers',
    description: 'Customers who spent over $1000 in the last 3 months',
    customerCount: 284,
    createdAt: '2023-05-01',
    lastUpdated: '2023-05-15',
    rules: [
      { field: 'totalSpend', operator: '>', value: '1000', unit: 'USD' },
      { field: 'lastOrderDate', operator: '>', value: '90', unit: 'days' }
    ]
  },
  { 
    id: '2',
    name: 'Inactive Customers',
    description: 'Customers who have not placed an order in the last 30 days',
    customerCount: 512,
    createdAt: '2023-04-15',
    lastUpdated: '2023-05-10',
    rules: [
      { field: 'lastOrderDate', operator: '<', value: '30', unit: 'days' }
    ]
  },
  { 
    id: '3',
    name: 'New Customers',
    description: 'Customers who registered in the last 7 days',
    customerCount: 78,
    createdAt: '2023-05-10',
    lastUpdated: '2023-05-10',
    rules: [
      { field: 'registrationDate', operator: '>', value: '7', unit: 'days' }
    ]
  }
];

// Available fields for segment rules
const availableFields = [
  { id: 'totalSpend', name: 'Total Spend', icon: <DollarSign size={16} />, type: 'number', units: ['USD'] },
  { id: 'orderCount', name: 'Order Count', icon: <ShoppingCart size={16} />, type: 'number', units: ['orders'] },
  { id: 'lastOrderDate', name: 'Last Order Date', icon: <Calendar size={16} />, type: 'date', units: ['days', 'months'] },
  { id: 'registrationDate', name: 'Registration Date', icon: <Calendar size={16} />, type: 'date', units: ['days', 'months'] },
  { id: 'customerTags', name: 'Customer Tags', icon: <Tag size={16} />, type: 'string', units: [] },
  { id: 'visitFrequency', name: 'Visit Frequency', icon: <Clock size={16} />, type: 'number', units: ['visits/month'] }
];

// Available operators
const operators = [
  { id: '>', name: 'Greater than', symbol: '>' },
  { id: '<', name: 'Less than', symbol: '<' },
  { id: '=', name: 'Equal to', symbol: '=' },
  { id: '!=', name: 'Not equal to', symbol: '≠' },
  { id: 'contains', name: 'Contains', symbol: '∋' },
  { id: 'not_contains', name: 'Does not contain', symbol: '∌' }
];

interface Rule {
  field: string;
  operator: string;
  value: string;
  unit?: string;
}

interface Segment {
  id: string;
  name: string;
  description: string;
  customerCount: number;
  createdAt: string;
  lastUpdated: string;
  rules: Rule[];
}

interface NewSegment {
  name: string;
  description: string;
  rules: Rule[];
}

export default function SegmentRulesPage() {
  // Create a new rule with the correct type
  const createRule = (field: string = 'totalSpend', operator: string = '>', value: string = '', unit?: string): Rule => ({
    field,
    operator,
    value,
    ...(unit ? { unit } : {})
  });

  const [segments, setSegments] = useState<Segment[]>(mockSegments);
  const [isCreatingSegment, setIsCreatingSegment] = useState(false);
  const [newSegment, setNewSegment] = useState<NewSegment>({
    name: '',
    description: '',
    rules: [createRule('totalSpend', '>', '', 'USD')]
  });
  
  // Handle adding a new rule
  const addRule = () => {
    setNewSegment(prev => ({
      ...prev,
      rules: [
        ...prev.rules,
        createRule('totalSpend', '>', '', 'USD')
      ]
    }));
  };

  // Handle removing a rule
  const removeRule = (index: number) => {
    setNewSegment(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };
  
  // Handle rule field change
  const handleRuleChange = (index: number, field: keyof Rule, value: string) => {
    setNewSegment(prev => {
      const updatedRules = [...prev.rules];
      if (field === 'field') {
        const selectedField = availableFields.find(f => f.id === value);
        updatedRules[index] = createRule(
          value,
          updatedRules[index].operator,
          updatedRules[index].value,
          selectedField?.units?.length ? selectedField.units[0] : undefined
        );
      } else {
        updatedRules[index] = createRule(
          updatedRules[index].field,
          field === 'operator' ? value : updatedRules[index].operator,
          field === 'value' ? value : updatedRules[index].value,
          field === 'unit' ? value : updatedRules[index].unit
        );
      }
      
      return {
        ...prev,
        rules: updatedRules
      };
    });
  };
  
  // Handle save segment
  const saveSegment = () => {
    const newId = (Math.max(...segments.map(s => parseInt(s.id))) + 1).toString();
    const now = new Date().toISOString().split('T')[0];
    
    setSegments([
      ...segments,
      {
        id: newId,
        name: newSegment.name,
        description: newSegment.description,
        customerCount: Math.floor(Math.random() * 500),
        createdAt: now,
        lastUpdated: now,
        rules: newSegment.rules
      }
    ]);
    
    setIsCreatingSegment(false);
    setNewSegment({
      name: '',
      description: '',
      rules: [createRule('totalSpend', '>', '', 'USD')]
    });
  };

  return (
    <div className="space-y-6 text-[#141414]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#141414]">Customer Segments</h1>
          <p className="text-[#737373] text-sm mt-1">Create and manage customer segments based on rules</p>
        </div>
        <button 
          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
          onClick={() => setIsCreatingSegment(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Segment
        </button>
      </div>
      
      {/* Segment Creator */}
      {isCreatingSegment && (
        <div className="bg-white border border-[#dbdbdb] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#141414]">Create New Segment</h2>
            <button 
              className="p-2 text-[#737373] hover:text-[#141414] hover:bg-[#ededed] rounded-lg transition-colors"
              onClick={() => setIsCreatingSegment(false)}
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Segment Details */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#737373] mb-1">
                  Segment Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newSegment.name}
                  onChange={(e) => setNewSegment(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-[#dbdbdb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#141414] focus:border-transparent text-[#141414]"
                  placeholder="e.g., High Value Customers"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#737373] mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newSegment.description}
                  onChange={(e) => setNewSegment(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-[#dbdbdb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#141414] focus:border-transparent text-[#141414]"
                  placeholder="Describe this segment..."
                  rows={2}
                />
              </div>
            </div>
            
            {/* Rule Builder */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-[#141414]">Segment Rules</h3>
                <button 
                  className="text-xs text-[#141414] hover:text-[#737373] transition-colors flex items-center"
                  onClick={addRule}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Rule
                </button>
              </div>
              
              <div className="space-y-4">
                {newSegment.rules.map((rule, index) => (
                  <div key={index} className="flex flex-wrap items-center gap-3 p-4 bg-[#ededed] rounded-lg">
                    <div className="flex-grow min-w-[150px]">
                      <label className="block text-xs text-[#737373] mb-1">Field</label>
                      <select
                        value={rule.field}
                        onChange={(e) => handleRuleChange(index, 'field', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#dbdbdb] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#141414] text-[#141414]"
                      >
                        {availableFields.map((field) => (
                          <option key={field.id} value={field.id}>{field.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex-grow min-w-[120px]">
                      <label className="block text-xs text-[#737373] mb-1">Condition</label>
                      <select
                        value={rule.operator}
                        onChange={(e) => handleRuleChange(index, 'operator', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#dbdbdb] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#141414] text-[#141414]"
                      >
                        {operators.map((op) => (
                          <option key={op.id} value={op.id}>{op.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex-grow min-w-[120px]">
                      <label className="block text-xs text-[#737373] mb-1">Value</label>
                      <input
                        type="text"
                        value={rule.value}
                        onChange={(e) => handleRuleChange(index, 'value', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#dbdbdb] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#141414] text-[#141414]"
                        placeholder="Enter value..."
                      />
                    </div>
                    
                    {rule.unit && (
                      <div className="min-w-[100px]">
                        <label className="block text-xs text-[#737373] mb-1">Unit</label>
                        <select
                          value={rule.unit}
                          onChange={(e) => handleRuleChange(index, 'unit', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-[#dbdbdb] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#141414] text-[#141414]"
                        >
                          {availableFields.find(f => f.id === rule.field)?.units.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    <button className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors mt-6"
                      onClick={() => removeRule(index)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#dbdbdb]">
              <button
                className="px-4 py-2 border border-[#dbdbdb] rounded-lg hover:bg-[#f3f3f3] transition-colors text-[#141414]"
                onClick={() => setIsCreatingSegment(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors flex items-center"
                onClick={saveSegment}
                disabled={!newSegment.name || newSegment.rules.length === 0}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Segment
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Segments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {segments.map((segment) => (
          <div 
            key={segment.id} 
            className="bg-white border border-[#dbdbdb] rounded-xl p-6 hover:border-black/30 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-[#141414]">{segment.name}</h3>
                <p className="text-[#737373] text-sm mt-1">{segment.description}</p>
              </div>
              <div className="p-2 rounded-lg bg-[#ededed] text-[#141414]">
                <Layers size={18} />
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#dbdbdb]">
              <div>
                <p className="text-xs text-[#737373]">Customers</p>
                <p className="font-medium text-[#141414] flex items-center"><Users size={14} className="mr-1" /> {segment.customerCount}</p>
              </div>
              <div>
                <p className="text-xs text-[#737373]">Created</p>
                <p className="font-medium text-[#141414] flex items-center"><Calendar size={14} className="mr-1" /> {segment.createdAt}</p>
              </div>
            </div>

            {/* Rules Preview */}
            <div className="space-y-2 mt-4">
              {segment.rules.map((rule, index) => {
                const field = availableFields.find(f => f.id === rule.field);
                const operator = operators.find(o => o.id === rule.operator);
                
                return (
                  <div key={index} className="flex items-center text-xs text-[#141414] bg-[#ededed] rounded-lg px-3 py-2">
                    <span className="text-[#737373] mr-2">
                      {field?.icon}
                    </span>
                    <span>{field?.name}</span>
                    <span className="mx-2 text-[#737373]">{operator?.symbol}</span>
                    <span className="font-medium">{rule.value}</span>
                    {rule.unit && <span className="ml-1 text-[#737373]">{rule.unit}</span>}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 flex items-center justify-between text-xs text-[#737373] pt-3 border-t border-[#dbdbdb]">
              <span>Updated {segment.lastUpdated}</span>
              <button className="text-blue-500 hover:text-blue-600 transition-colors flex items-center">
                View Details
                <ChevronRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
