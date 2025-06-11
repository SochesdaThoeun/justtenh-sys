
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { BASE_URL } from '../constants/api.constants';
import { toast } from 'sonner';

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token in requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = extractErrorMessage(error);
    
    // Show error toast for non-401 errors (401 is handled by auth slice)
    if (error.response?.status !== 401) {
      toast.error(typeof errorMessage === 'string' 
        ? errorMessage 
        : 'An error occurred. Please try again.');
    }
    
    return Promise.reject(errorMessage);
  }
);

// Helper to extract error message from API error responses
const extractErrorMessage = (error: any): string | any[] => {
  if (error.response?.data) {
    // Check if the response has errors array
    if (Array.isArray(error.response.data.errors)) {
      return error.response.data.errors;
    }
    
    // Check if response has a message property
    if (error.response.data.message) {
      return error.response.data.message;
    }
    
    // If errors are in a different format
    return error.response.data;
  }
  
  // Default error message
  return error.message || 'An error occurred';
};

// Generic API service with typed request methods
const apiService = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.get(url, config).then((response: AxiosResponse<T>) => response.data);
  },
  
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.post(url, data, config).then((response: AxiosResponse<T>) => response.data);
  },
  
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.put(url, data, config).then((response: AxiosResponse<T>) => response.data);
  },
  
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.delete(url, config).then((response: AxiosResponse<T>) => response.data);
  },
  
  // Method for handling multipart form data (file uploads)
  postForm: <T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.post(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    }).then((response: AxiosResponse<T>) => response.data);
  },
  
  // Method for sending PUT with FormData
  putForm: <T>(url: string, formData: FormData, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.put(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    }).then((response: AxiosResponse<T>) => response.data);
  },
};

export default apiService;
export { axiosInstance };
