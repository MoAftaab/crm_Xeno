'use client';

import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { authService } from '@/services/auth-service';
import { useState, useEffect } from 'react';

export default function GoogleLoginButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (response: any) => {
    setIsLoading(true);
    const { credential } = response;
    
    if (!credential) {
      toast.error('No credentials received from Google');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Google login credential received, initiating login...');
      
      // Call our Next.js API route that acts as a proxy to the backend
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credential }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        console.log('Login successful, storing credentials...');
        
        // Explicitly store token in both formats to ensure compatibility
        localStorage.setItem('token', data.token);
        localStorage.setItem('crm-token', data.token);
        localStorage.setItem('crm-user', JSON.stringify(data.user));
        
        toast.success('Google login successful!');
        console.log('Credentials stored, redirecting to dashboard...');
        
        // Use window.location for a hard redirect which is more reliable
        window.location.href = '/dashboard';
      } else {
        toast.error(data.message || 'Google login failed');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('An error occurred during login. Please try again.');
      setIsLoading(false);
    }
  };

  const handleFailure = () => {
    toast.error('Google sign-in failed. Please try again.');
  };

  // Get Google client ID from environment variables or use fallback
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 
    '527849281978-phiunv6mm42akm59kha90cvqallo9do8.apps.googleusercontent.com';

  return (
    <div className="w-full">
      {isLoading ? (
        <button
          disabled
          className="flex items-center justify-center w-full py-2 px-4 mb-4 rounded-md border bg-gray-800 border-gray-700 cursor-not-allowed transition-colors duration-300"
        >
          <div className="flex items-center space-x-2">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            <span>Signing in...</span>
          </div>
        </button>
      ) : (
        <GoogleOAuthProvider clientId={googleClientId}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleFailure}
            theme="filled_black"
            shape="pill"
            text="signin_with"
            useOneTap={false}
            size="large"
            width="100%"
          />
        </GoogleOAuthProvider>
      )}
    </div>
  );
}
