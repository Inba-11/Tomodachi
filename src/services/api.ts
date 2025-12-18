import axios, { AxiosInstance, AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tomodachi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    
    switch (status) {
      case 401:
        // Unauthorized - clear auth and redirect
        localStorage.removeItem('tomodachi_token');
        localStorage.removeItem('tomodachi_user');
        window.location.href = '/login';
        toast({
          title: 'Session Expired',
          description: 'Please log in again.',
          variant: 'destructive',
        });
        break;
      case 403:
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to perform this action.',
          variant: 'destructive',
        });
        break;
      case 500:
        toast({
          title: 'Server Error',
          description: 'Something went wrong. Please try again later.',
          variant: 'destructive',
        });
        break;
      default:
        if (!error.response) {
          toast({
            title: 'Network Error',
            description: 'Please check your internet connection.',
            variant: 'destructive',
          });
        }
    }
    
    return Promise.reject(error);
  }
);

export default api;
