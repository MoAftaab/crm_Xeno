'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useDataImport } from '@/hooks/useDataImport';
import { 
  Upload, 
  FileText, 
  Users, 
  ShoppingCart, 
  ChevronLeft, 
  Download, 
  ArrowUpFromLine, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Loader2 
} from 'lucide-react';

interface ImportError {
  row: number;
  message: string;
}

interface ImportResults {
  success: boolean;
  totalRows: number;
  importedRows: number;
  errors?: ImportError[];
  importType?: 'customers' | 'orders';
}

export default function ImportPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { importCustomers, importOrders, getCustomerSample, getOrderSample } = useDataImport();
  const [activeTab, setActiveTab] = useState<'customers' | 'orders'>('customers');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResults, setImportResults] = useState<ImportResults | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  
  const customerSampleQuery = getCustomerSample();
  const orderSampleQuery = getOrderSample();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setImportError('Please upload a CSV file');
        setSelectedFile(null);
        return;
      }
      
      setSelectedFile(file);
      setImportError(null);
      setImportResults(null);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setImportError('Please upload a CSV file');
        return;
      }
      
      setSelectedFile(file);
      setImportError(null);
      setImportResults(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    
    setImportError(null);
    setImportResults(null);
    
    try {
      if (activeTab === 'customers') {
        const result = await importCustomers.mutateAsync(selectedFile);
        setImportResults({...result, importType: 'customers'});
      } else {
        const result = await importOrders.mutateAsync(selectedFile);
        setImportResults({...result, importType: 'orders'});
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during import';
      setImportError(errorMessage);
    }
  };

  const resetImport = () => {
    setSelectedFile(null);
    setImportError(null);
    setImportResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadSample = () => {
    const query = activeTab === 'customers' ? customerSampleQuery : orderSampleQuery;
    
    if (query.isLoading) return;
    
    if (query.data) {
      const url = window.URL.createObjectURL(new Blob([query.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sample_${activeTab}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const isImporting = importCustomers.isLoading || importOrders.isLoading;

  return (
    <div className="space-y-6 text-[#141414] w-full">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#141414]">Import Data</h1>
          <p className="text-sm text-[#737373] mt-1">
            {activeTab === 'customers' ? 'Import customer data from CSV file' : 'Import order data from CSV file'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white border border-[#dbdbdb] rounded-xl p-6 md:p-8 shadow-sm">
          {/* Tabs */}
          <div className="flex border-b border-[#e0e0e0] mb-8">
            <button
              className={`flex items-center px-5 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'customers' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-[#737373] hover:text-[#141414]'
              }`}
              onClick={() => setActiveTab('customers')}
            >
              <Users className="w-4 h-4 mr-2" />
              Import Customers
            </button>
            <button
              className={`flex items-center px-5 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'orders' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-[#737373] hover:text-[#141414]'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Import Orders
            </button>
          </div>
          
          {/* Import Instructions */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-[#141414]">
                {activeTab === 'customers' ? 'Customer Import' : 'Order Import'}
              </h2>
              <button
                onClick={handleDownloadSample}
                disabled={customerSampleQuery.isLoading || orderSampleQuery.isLoading}
                className="px-4 py-2 text-sm inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Sample
              </button>
            </div>
            <p className="text-[#737373] mb-6">
              {activeTab === 'customers' 
                ? 'Upload a CSV file with customer data. The CSV should include headers for name, email, phone, and address.'
                : 'Upload a CSV file with order data. The CSV should include headers for customer ID, product, quantity, price, and status.'
              }
            </p>
          </div>
          
          {/* Upload Area */}
          <div className="mb-8">
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-[#dbdbdb] hover:border-blue-300'
              } transition-colors`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-[#141414]">{selectedFile.name}</p>
                    <p className="text-[#737373] text-sm">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <div className="flex justify-center space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={resetImport}
                      className="px-4 py-2 border border-[#dbdbdb] hover:bg-gray-100 rounded-lg text-[#141414] text-sm transition-all duration-300"
                    >
                      Change File
                    </button>
                    <button
                      type="button"
                      onClick={handleImport}
                      disabled={isImporting}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg shadow-md transition-all duration-300 flex items-center disabled:opacity-70"
                    >
                      {isImporting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <ArrowUpFromLine className="w-4 h-4 mr-2" />
                          Start Import
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-[#737373]" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-[#141414]">
                      Drag & drop your CSV file here
                    </p>
                    <p className="text-[#737373]">
                      or
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-all duration-300 inline-flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Browse Files
                  </button>
                </div>
              )}
            </div>
            
            {importError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-600">Import Error</p>
                  <p className="text-xs text-red-500 mt-1">{importError}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Import Results */}
          {importResults && (
            <div className="mb-8">
              <div className="relative bg-white border border-[#dbdbdb] rounded-xl p-6 shadow-sm">
                <button
                  onClick={resetImport}
                  className="absolute top-4 right-4 text-[#737373] hover:text-[#141414]"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center mb-4">
                  {importResults.success ? (
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mr-4">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mr-4">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-medium text-[#141414]">
                      {importResults.success ? 'Import Completed' : 'Import Completed with Warnings'}
                    </h3>
                    <p className="text-[#737373] text-sm">
                      {importResults.importType === 'customers' ? 'Customer' : 'Order'} data has been processed
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#f8f8f8] rounded-lg p-4">
                    <p className="text-sm text-[#737373] mb-1">Total Rows</p>
                    <p className="text-xl font-medium text-[#141414]">{importResults.totalRows}</p>
                  </div>
                  <div className="bg-[#f8f8f8] rounded-lg p-4">
                    <p className="text-sm text-[#737373] mb-1">Imported</p>
                    <p className="text-xl font-medium text-green-600">{importResults.importedRows}</p>
                  </div>
                  <div className="bg-[#f8f8f8] rounded-lg p-4">
                    <p className="text-sm text-[#737373] mb-1">Errors</p>
                    <p className="text-xl font-medium text-red-600">
                      {importResults.totalRows - importResults.importedRows}
                    </p>
                  </div>
                </div>
                
                {importResults.errors && importResults.errors.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-[#141414]">Error Details</h4>
                    <div className="bg-white border border-[#dbdbdb] rounded-lg overflow-hidden">
                      <div className="max-h-60 overflow-y-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-xs font-medium text-[#141414] bg-[#f8f8f8]">
                              <th className="px-4 py-2 text-left">Row</th>
                              <th className="px-4 py-2 text-left">Error</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#e0e0e0]">
                            {importResults.errors.map((error, index) => (
                              <tr key={index} className="text-xs">
                                <td className="px-4 py-2 text-[#141414]">{error.row}</td>
                                <td className="px-4 py-2 text-[#141414]">{error.message}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => router.push(importResults.importType === 'customers' ? '/dashboard/customers' : '/dashboard/orders')}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg shadow-md transition-all duration-300"
                  >
                    View {importResults.importType === 'customers' ? 'Customers' : 'Orders'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
