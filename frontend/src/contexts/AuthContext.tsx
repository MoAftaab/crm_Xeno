'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { authService } from '@/services/auth-service';
import { useMutation } from 'react-query';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  login: any; // Using any for react-query mutation
  register: any; // Using any for react-query mutation
  googleLogin: any; // Using any for react-query mutation
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  // Email/Password login
  const login = useMutation(
    (credentials: { email: string; password: string }) => 
      authService.login(credentials),
    {
      onSuccess: (data) => {
        authService.storeUserData(data);
        setUser(data.user);
        toast.success('Login successful!');
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Login failed');
      }
    }
  );

  // Google login
  const googleLogin = useMutation(
    (credential: string) => authService.googleLogin(credential),
    {
      onSuccess: (data) => {
        authService.storeUserData(data);
        setUser(data.user);
        toast.success('Google login successful!');
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Google login failed');
      }
    }
  );

  // Register with email/password
  const register = useMutation(
    (userData: { name: string; email: string; password: string; companyName?: string }) =>
      authService.register(userData),
    {
      onSuccess: (data) => {
        authService.storeUserData(data);
        setUser(data.user);
        toast.success('Registration successful!');
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Registration failed');
      }
    }
  );

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, googleLogin, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 