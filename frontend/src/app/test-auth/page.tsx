'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import apiClient from '@/lib/api-client';

export default function TestAuth() {
  const { user, login, googleLogin, logout } = useAuth();
  const [testResult, setTestResult] = useState<string>('');
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem('crm-token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const testPublicEndpoint = async () => {
    try {
      const response = await apiClient.get('/api/data/test/customers');
      setTestResult(`Public endpoint success: ${response.status}\nNumber of customers: ${response.data.length}`);
    } catch (error: any) {
      setTestResult(`Public endpoint error: ${error.message}`);
    }
  };

  const testProtectedEndpoint = async () => {
    try {
      const response = await apiClient.get('/api/data/customers');
      setTestResult(`Protected endpoint success: ${response.status}\nNumber of customers: ${response.data.length}`);
    } catch (error: any) {
      setTestResult(`Protected endpoint error: ${error.message}`);
      
      // Show more detailed error info
      if (error.response) {
        setTestResult(prev => `${prev}\nStatus: ${error.response.status}\nData: ${JSON.stringify(error.response.data)}`);
      }
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test Page</h1>
      
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Authentication Status</h2>
        <p className="mb-2"><strong>Logged in:</strong> {user ? 'Yes' : 'No'}</p>
        {user && (
          <div>
            <p><strong>User:</strong> {JSON.stringify(user)}</p>
          </div>
        )}
        <p className="mb-2 mt-2"><strong>Token exists:</strong> {token ? 'Yes' : 'No'}</p>
        {token && (
          <div className="mt-2">
            <p><strong>Token (first 20 chars):</strong> {token.substring(0, 20)}...</p>
          </div>
        )}
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={testPublicEndpoint}
          className="px-4 py-2 bg-green-600 rounded-lg"
        >
          Test Public Endpoint
        </button>
        <button 
          onClick={testProtectedEndpoint}
          className="px-4 py-2 bg-blue-600 rounded-lg"
        >
          Test Protected Endpoint
        </button>
        <button 
          onClick={() => logout()}
          className="px-4 py-2 bg-red-600 rounded-lg"
        >
          Logout
        </button>
      </div>

      {testResult && (
        <div className="p-4 bg-gray-800 rounded-lg whitespace-pre-wrap">
          <h2 className="text-xl font-semibold mb-2">Test Result</h2>
          <pre>{testResult}</pre>
        </div>
      )}
    </div>
  );
}
