'use client';

import { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';

export default function GoogleTestPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [origins, setOrigins] = useState<string[]>([]);

  useEffect(() => {
    // Collect information about the current environment
    const currentOrigin = window.location.origin;
    const currentHostname = window.location.hostname;
    const possibleOrigins = [
      currentOrigin,
      `http://${currentHostname}:3000`,
      `https://${currentHostname}:3000`,
      `http://localhost:3000`,
      `https://localhost:3000`,
    ];
    
    setOrigins(possibleOrigins);
  }, []);

  const handleGoogleSuccess = (credentialResponse: any) => {
    console.log('Google login successful!', credentialResponse);
    setSuccess('Google login successful! See console for credential details.');
    setError(null);
  };

  const handleGoogleError = () => {
    console.error('Google sign-in failed.');
    setError('Google sign-in failed. Check console for details.');
    setSuccess(null);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-950 text-white">
      <h1 className="text-3xl font-bold mb-6">Google OAuth Test Page</h1>
      
      <div className="mb-8 p-4 bg-gray-900 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Client ID Information</h2>
        <p className="mb-4 text-gray-300">Using client ID:</p>
        <div className="p-3 bg-gray-800 rounded overflow-auto text-sm mb-4">
          <code>527849281978-phiunv6mm42akm59kha90cvqallo9do8.apps.googleusercontent.com</code>
        </div>
      </div>

      <div className="mb-8 p-4 bg-gray-900 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Environment Information</h2>
        <p className="mb-2 text-gray-300">Current Origin: <span className="text-blue-400">{typeof window !== 'undefined' ? window.location.origin : 'N/A'}</span></p>
        <p className="mb-4 text-gray-300">Make sure this origin is added to your Google Cloud Console authorized origins.</p>
        
        <h3 className="text-lg font-semibold mb-2 mt-4">Possible Origins to Add:</h3>
        <ul className="list-disc pl-5 space-y-1">
          {origins.map((origin, index) => (
            <li key={index} className="text-blue-400">{origin}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8 p-4 bg-gray-900 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Test Google Login</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200">
            <p className="font-medium">Error</p>
            <p className="text-red-300/80 text-sm">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-900/30 border border-green-500/50 rounded-lg text-green-200">
            <p className="font-medium">Success</p>
            <p className="text-green-300/80 text-sm">{success}</p>
          </div>
        )}
        
        <div className="flex justify-center p-6 bg-gray-800 rounded-lg">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_black"
            shape="pill"
            text="signin_with"
            useOneTap={false}
            size="large"
          />
        </div>
      </div>

      <div className="p-4 bg-gray-900 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Troubleshooting Steps</h2>
        
        <ol className="list-decimal pl-5 space-y-3">
          <li>
            <p className="font-medium">Verify Google Cloud Console Configuration</p>
            <ul className="list-disc pl-5 mt-1 text-gray-300">
              <li>Ensure <strong>ALL</strong> origins above are added to Authorized JavaScript origins</li>
              <li>Verify your OAuth consent screen is properly configured</li>
              <li>Make sure the application is in the appropriate status (Testing or Production)</li>
            </ul>
          </li>
          
          <li>
            <p className="font-medium">Check for CORS Issues</p>
            <ul className="list-disc pl-5 mt-1 text-gray-300">
              <li>The "Cross-Origin-Opener-Policy" error suggests a CORS configuration issue</li>
              <li>Try running both frontend and backend on the same port if possible</li>
            </ul>
          </li>
          
          <li>
            <p className="font-medium">Alternative Authentication Methods</p>
            <ul className="list-disc pl-5 mt-1 text-gray-300">
              <li>For development, consider using email/password authentication</li>
              <li>Or implement a more robust solution like NextAuth.js</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
}
