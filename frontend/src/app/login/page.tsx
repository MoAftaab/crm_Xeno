'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const { googleLogin } = useAuth();

  const handleGoogleSuccess = (credentialResponse: any) => {
    googleLogin.mutate(credentialResponse.credential);
  };

  const handleGoogleError = () => {
    toast.error('Google sign-in failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gray-950 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-950 to-purple-900/20"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/5 blur-[120px] rounded-full"></div>
      </div>
      
      {/* Login container */}
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-xl opacity-70"></div>
              <div className="relative w-14 h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 rounded-xl flex items-center justify-center shadow-xl">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-white">Welcome</h1>
          <p className="mt-2 text-gray-400">Sign in with Google to continue</p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gray-900/50 rounded-2xl blur-sm"></div>
          <div className="relative bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl p-8">
            {googleLogin.isError && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm">
                <p className="font-medium">Login failed</p>
                <p className="text-red-300/80 text-xs mt-1">
                  {googleLogin.error instanceof Error 
                    ? googleLogin.error.message 
                    : 'Google sign-in failed. Please try again.'}
                </p>
              </div>
            )}

            {/* Google Sign In Button */}
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <p className="text-gray-300 mb-6">Click below to sign in with your Google account</p>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="filled_black"
                shape="pill"
                text="signin_with"
                useOneTap
                size="large"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-400 hover:text-white text-sm transition-colors"
          >
            <span className="ml-1">← Back to home</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 