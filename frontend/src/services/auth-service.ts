import apiClient from '../lib/api-client';
import { toast } from 'react-hot-toast';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  companyName?: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    picture?: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
    }
  },

  googleLogin: async (credential: string): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/google', { token: credential });
      return response.data;
    } catch (error: any) {
      console.error('Google login error:', error);
      throw new Error(error.response?.data?.message || 'Google login failed. Please try again.');
    }
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error('An account with this email already exists');
        throw new Error('An account with this email already exists. Please use a different email or try logging in.');
      }
      throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  },
  
  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('crm-token');
      localStorage.removeItem('crm-user');
    }
  },

  getCurrentUser: (): any => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('crm-user');
      if (userStr) {
        return JSON.parse(userStr);
      }
    }
    return null;
  },
  
  storeUserData: (data: AuthResponse): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('crm-token', data.token);
      localStorage.setItem('crm-user', JSON.stringify(data.user));
    }
  }
}; 