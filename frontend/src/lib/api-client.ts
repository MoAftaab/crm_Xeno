import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

// Create a base API client
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // Only add token if we're in a browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('crm-token');
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle network errors
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('Network error - Backend server may be down:', error.message);
      if (typeof window !== 'undefined') {
        toast.error('Cannot connect to server. Please try again later.');
      }
    }

    // Handle specific HTTP status errors
    const status = error.response?.status;

    // Handle authentication errors (redirect to login)
    if (status === 401) {
      if (typeof window !== 'undefined') {
        // Clear any authentication data
        localStorage.removeItem('crm-token');
        localStorage.removeItem('crm-user');
        
        // Don't redirect if we're already on the login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    // Handle 404 errors
    if (status === 404) {
      console.error('Resource not found:', error.config?.url);
    }

    return Promise.reject(error);
  }
);

export default apiClient; 