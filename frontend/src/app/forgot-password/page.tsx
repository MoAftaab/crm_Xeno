'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // In a real application, you would call your API endpoint
      // For demonstration, we'll simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (err) {
      setError('Failed to send password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gray-950 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-950 to-purple-900/20"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/5 blur-[120px] rounded-full"></div>
      </div>
      
      {/* Forgot password container */}
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
          <h1 className="mt-6 text-3xl font-bold text-white">Reset your password</h1>
          <p className="mt-2 text-gray-400">
            {isSubmitted 
              ? "We've sent you instructions to reset your password" 
              : "Enter your email address and we'll send you a link to reset your password"}
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gray-900/50 rounded-2xl blur-sm"></div>
          <div className="relative bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm">
                <p className="font-medium">Error</p>
                <p className="text-red-300/80 text-xs mt-1">{error}</p>
              </div>
            )}

            {isSubmitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-gray-300 mb-6">
                  If an account exists with the email <span className="font-medium">{email}</span>,
                  you will receive password reset instructions shortly.
                </p>
                <div className="text-sm text-gray-400">
                  <p>Didn't receive the email?</p>
                  <p className="mt-1">
                    Check your spam folder or{' '}
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300"
                    >
                      try again
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-gray-800/70 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="name@company.com"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-purple-900/30 transition-all duration-300 hover:shadow-purple-900/50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : "Send reset link"}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Remember your password?{' '}
                <Link href="/login" className="font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300">
                  Back to login
                </Link>
              </p>
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