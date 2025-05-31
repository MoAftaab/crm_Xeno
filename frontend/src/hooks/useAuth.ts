import { useContext } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { authService } from '@/services/auth-service';

// This is a simple wrapper around the AuthContext that adds React Query mutations
// We'll use this if we can't directly modify the AuthContext

export function useAuth() {
  // Try to import from the context first
  try {
    // Try to get the existing auth context
    const { AuthContext } = require('@/contexts/AuthContext');
    const context = useContext(AuthContext);
    if (context) return context;
  } catch (error) {
    console.log('Creating local auth hooks...');
  }

  // If no context is available, create local hooks
  const login = useMutation(
    (credentials: { email: string; password: string }) => 
      authService.login(credentials),
    {
      onSuccess: (data) => {
        authService.storeUserData(data);
        toast.success('Login successful!');
        window.location.href = '/dashboard';
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Login failed');
      }
    }
  );

  const googleLogin = useMutation(
    (credential: string) => authService.googleLogin(credential),
    {
      onSuccess: (data) => {
        authService.storeUserData(data);
        toast.success('Google login successful!');
        window.location.href = '/dashboard';
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Google login failed');
      }
    }
  );

  const register = useMutation(
    (userData: { name: string; email: string; password: string; companyName?: string }) =>
      authService.register(userData),
    {
      onSuccess: (data) => {
        authService.storeUserData(data);
        toast.success('Registration successful!');
        window.location.href = '/dashboard';
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Registration failed');
      }
    }
  );

  const logout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    window.location.href = '/login';
  };

  return {
    user: authService.getCurrentUser(),
    login,
    register,
    googleLogin,
    logout,
    isLoading: false
  };
} 