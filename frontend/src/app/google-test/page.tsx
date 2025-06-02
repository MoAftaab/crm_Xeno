'use client';

import { useState, useEffect } from 'react';
import { default as dynamicImport } from 'next/dynamic';

// Add correct segment configuration
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// Dynamically import the GoogleAuthClient component to prevent SSR issues
const GoogleAuthClient = dynamicImport(
  () => import('./GoogleAuthClient'),
  { ssr: false }
);

export default function GoogleTestPage() {
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

      {/* Render the client-side only GoogleAuthClient component */}
      {typeof window !== 'undefined' && <GoogleAuthClient origins={origins} />}

      <div className="p-4 bg-gray-900 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Troubleshooting Steps</h2>
        
        <ol className="list-decimal pl-5 space-y-3">
          <li>
            <p className="font-medium">Verify Google Cloud Console Configuration</p>
            <ul className="list-disc pl-5 mt-1 text-gray-300">
              <li>Ensure <strong>ALL</strong> origins above are added to Authorized JavaScript origins</li>
              <li>Make sure the client ID matches what's being used in the application</li>
            </ul>
          </li>
          <li>
            <p className="font-medium">Check Network Requests</p>
            <ul className="list-disc pl-5 mt-1 text-gray-300">
              <li>Open browser dev tools (F12) and check Network tab when clicking Sign In</li>
              <li>Look for any requests to <code>accounts.google.com</code> and check for errors</li>
            </ul>
          </li>
          <li>
            <p className="font-medium">Clear Cache and Cookies</p>
            <ul className="list-disc pl-5 mt-1 text-gray-300">
              <li>Try clearing your browser cache and cookies</li>
              <li>Test in an incognito/private window</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
}
