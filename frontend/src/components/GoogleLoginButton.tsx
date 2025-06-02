'use client';

import { GoogleLogin } from '@react-oauth/google';
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

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleFailure}
      theme="filled_black"
      shape="pill"
      text="signin_with"
      size="large"
    />
  );
}
