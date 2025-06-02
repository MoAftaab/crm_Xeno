'use client';

import { useState } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

interface GoogleAuthClientProps {
  origins: string[];
}

export default function GoogleAuthClient({ origins }: GoogleAuthClientProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
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
  
  // Google client ID
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 
    '527849281978-phiunv6mm42akm59kha90cvqallo9do8.apps.googleusercontent.com';

  return (
    <>
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
          <GoogleOAuthProvider clientId={googleClientId}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              shape="pill"
              text="signin_with"
              useOneTap={false}
              size="large"
            />
          </GoogleOAuthProvider>
        </div>
      </div>
    </>
  );
}
