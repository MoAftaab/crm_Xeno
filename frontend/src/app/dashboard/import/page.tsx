'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useDataImport } from '@/hooks/useDataImport';
import { Upload, FileText, Users, ShoppingCart, ChevronLeft, Download, ArrowUpFromLine, AlertCircle, CheckCircle, X, Loader2 } from 'lucide-react';

export default function ImportPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { importCustomers, importOrders, getCustomerSample, getOrderSample } = useDataImport();
  const [activeTab, setActiveTab] = useState<'customers' | 'orders'>('customers');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResults, setImportResults] = useState<any | null>(null);
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
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
        setImportResults(result);
      } else {
        const result = await importOrders.mutateAsync(selectedFile);
        setImportResults(result);
      }
    } catch (error: any) {
      setImportError(error.message || 'An error occurred during import');
    }
  };

  const handleDownloadSample = () => {
    if (activeTab === 'customers') {
      customerSampleQuery.refetch();
    } else {
      orderSampleQuery.refetch();
    }
  };

  const resetImport = () => {
    setSelectedFile(null);
    setImportResults(null);
    setImportError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Generate a sample download link if data is available
  const sampleDownloadUrl = activeTab === 'customers' 
    ? customerSampleQuery.data 
    : orderSampleQuery.data;

  const isImporting = importCustomers.isLoading || importOrders.isLoading;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <button 
              onClick={() => router.push('/dashboard')}
              className="mr-4 p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Import Data</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-8 shadow-lg">
            {/* Tabs */}
            <div className="flex border-b border-gray-800 mb-8">
              <button
                className={`flex items-center px-5 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'customers' 
                    ? 'border-blue-500 text-blue-400' 
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('customers')}
              >
                <Users className="w-4 h-4 mr-2" />
                Import Customers
              </button>
              <button
                className={`flex items-center px-5 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'orders' 
                    ? 'border-blue-500 text-blue-400' 
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('orders')}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Import Orders
              </button>
            </div>
            
            {/* Import Instructions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                {activeTab === 'customers' ? 'Customer Import' : 'Order Import'}
              </h2>
              
              <p className="text-gray-300 mb-4">
                {activeTab === 'customers' 
                  ? 'Upload a CSV file containing customer data to import into your CRM.' 
                  : 'Upload a CSV file containing order data to import into your CRM.'}
              </p>
              
              <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center text-sm text-gray-400">
                  <FileText className="w-4 h-4 mr-2 text-blue-400" />
                  <span>Download a sample CSV template to get started</span>
                </div>
                
                <a
                  href={sampleDownloadUrl}
                  download={activeTab === 'customers' ? 'customer_sample.csv' : 'order_sample.csv'}
                  className={`flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium ${!sampleDownloadUrl ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={(e) => {
                    if (!sampleDownloadUrl) {
                      e.preventDefault();
                      handleDownloadSample();
                    }
                  }}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download Sample
                </a>
              </div>
            </div>
            
            {/* Upload Area */}
            {!importResults && (
              <div className="mb-8">
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-900/10' 
                      : 'border-gray-700 hover:border-gray-600'
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
                      <div className="w-16 h-16 mx-auto bg-blue-900/20 rounded-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">{selectedFile.name}</p>
                        <p className="text-gray-400 text-sm">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <div className="flex justify-center space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={resetImport}
                          className="px-4 py-2 border border-gray-700 hover:bg-gray-800 rounded-lg text-gray-300 text-sm transition-all duration-300"
                        >
                          Change File
                        </button>
                        <button
                          type="button"
                          onClick={handleImport}
                          disabled={isImporting}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm rounded-lg shadow-lg transition-all duration-300 flex items-center disabled:opacity-70"
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
                      <div className="w-16 h-16 mx-auto bg-gray-800 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">
                          Drag & drop your CSV file here
                        </p>
                        <p className="text-gray-400">
                          or
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 text-sm transition-all duration-300 inline-flex items-center"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Browse Files
                      </button>
                    </div>
                  )}
                </div>
                
                {importError && (
                  <div className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded-lg flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-400">Import Error</p>
                      <p className="text-xs text-red-300 mt-1">{importError}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Import Results */}
            {importResults && (
              <div className="mb-8">
                <div className="relative bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                  <button
                    onClick={resetImport}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center mb-4">
                    {importResults.success ? (
                      <div className="w-10 h-10 bg-green-900/20 rounded-full flex items-center justify-center mr-4">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-yellow-900/20 rounded-full flex items-center justify-center mr-4">
                        <AlertCircle className="w-5 h-5 text-yellow-400" />
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-lg font-medium">
                        {importResults.success ? 'Import Completed' : 'Import Completed with Warnings'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {activeTab === 'customers' ? 'Customer' : 'Order'} data has been processed
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-900/70 rounded-lg p-4">
                      <p className="text-sm text-gray-400 mb-1">Total Rows</p>
                      <p className="text-xl font-medium">{importResults.totalRows}</p>
                    </div>
                    <div className="bg-gray-900/70 rounded-lg p-4">
                      <p className="text-sm text-gray-400 mb-1">Imported</p>
                      <p className="text-xl font-medium text-green-400">{importResults.importedRows}</p>
                    </div>
                    <div className="bg-gray-900/70 rounded-lg p-4">
                      <p className="text-sm text-gray-400 mb-1">Errors</p>
                      <p className="text-xl font-medium text-red-400">
                        {importResults.totalRows - importResults.importedRows}
                      </p>
                    </div>
                  </div>
                  
                  {importResults.errors && importResults.errors.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Error Details</h4>
                      <div className="bg-gray-900/70 rounded-lg overflow-hidden">
                        <div className="max-h-60 overflow-y-auto">
                          <table className="w-full">
                            <thead className="bg-gray-800">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Row</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Error</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                              {importResults.errors.map((error: any, index: number) => (
                                <tr key={index}>
                                  <td className="px-4 py-2 text-sm">{error.row}</td>
                                  <td className="px-4 py-2 text-sm text-red-300">{error.message}</td>
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
                      onClick={() => router.push(activeTab === 'customers' ? '/dashboard/customers' : '/dashboard/orders')}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm rounded-lg shadow-lg transition-all duration-300"
                    >
                      View {activeTab === 'customers' ? 'Customers' : 'Orders'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 