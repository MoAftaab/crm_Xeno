'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Create a new QueryClient instance with useState to avoid hydration mismatches
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }));

  // Google client ID
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 
    '527849281978-phiunv6mm42akm59kha90cvqallo9do8.apps.googleusercontent.com';

  // Check if we're running in the browser
  const isBrowser = typeof window !== 'undefined';
  
  // Conditional rendering based on client/server environment
  const content = isBrowser ? (
    <GoogleOAuthProvider clientId={googleClientId}>
      {children}
    </GoogleOAuthProvider>
  ) : children;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {content}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e1e2e',
              color: '#ffffff',
              border: '1px solid #383854',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}