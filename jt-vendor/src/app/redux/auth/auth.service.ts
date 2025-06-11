/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { LoginModel, RegisterModel, AuthResponse, PasswordResetResponse } from '../models';
import { BASE_URL, AUTH_ENDPOINTS } from '@/app/constants/api.constants';
import apiService from '@/app/services/api.service';

// Helper to extract error message from API error responses
const extractErrorMessage = (error: any): string | any[] => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (Array.isArray(error)) {
    return error;
  }
  
  return 'An error occurred';
};

export const authService = {
  login: async (credentials: LoginModel): Promise<AuthResponse> => {
    try {
      return await apiService.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
    } catch (error) {
      throw extractErrorMessage(error);
    }
  },

  register: async (registerData: RegisterModel): Promise<AuthResponse> => {
    try {
      // Validate required files before sending request
      if (!registerData.shopLogo) {
        throw new Error('The logo must be a file of type: jpg, jpeg, png, gif.');
      }
      
      if (!registerData.secondaryBanner) {
        throw new Error('The bottom banner must be a file of type: jpg, jpeg, png, gif.');
      }
      
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add text fields
      if (registerData.fName) formData.append('f_name', registerData.fName);
      if (registerData.lName) formData.append('l_name', registerData.lName);
      if (registerData.phone) formData.append('phone', registerData.phone);
      if (registerData.email) formData.append('email', registerData.email);
      if (registerData.password) formData.append('password', registerData.password);
      if (registerData.confirmPassword) formData.append('confirm_password', registerData.confirmPassword);
      if (registerData.shopName) formData.append('shop_name', registerData.shopName);
      if (registerData.shopAddress) formData.append('shop_address', registerData.shopAddress);
      
      // Add file fields - ensure they are valid File objects
      if (registerData.profileImage) formData.append('image', registerData.profileImage);
      if (registerData.shopLogo) formData.append('logo', registerData.shopLogo);
      if (registerData.shopBanner) formData.append('banner', registerData.shopBanner);
      if (registerData.secondaryBanner) formData.append('bottom_banner', registerData.secondaryBanner);

      return await apiService.postForm<AuthResponse>(AUTH_ENDPOINTS.REGISTRATION, formData);
    } catch (error) {
      throw extractErrorMessage(error);
    }
  },

  forgotPassword: async (identity: string): Promise<PasswordResetResponse> => {
    try {
      return await apiService.post<PasswordResetResponse>(AUTH_ENDPOINTS.FORGOT_PASSWORD, { identity });
    } catch (error) {
      throw extractErrorMessage(error);
    }
  },

  verifyOtp: async (identity: string, otp: string): Promise<PasswordResetResponse> => {
    try {
      return await apiService.post<PasswordResetResponse>(AUTH_ENDPOINTS.VERIFY_OTP, { 
        identity, 
        otp 
      });
    } catch (error) {
      throw extractErrorMessage(error);
    }
  },

  resetPassword: async (identity: string, otp: string, password: string, confirmPassword: string): Promise<PasswordResetResponse> => {
    try {
      return await apiService.post<PasswordResetResponse>(AUTH_ENDPOINTS.RESET_PASSWORD, {
        identity,
        otp,
        password,
        confirm_password: confirmPassword,
        _method: 'put'
      });
    } catch (error) {
      throw extractErrorMessage(error);
    }
  },

  updateToken: async (firebaseToken: string): Promise<any> => {
    try {
      return await apiService.post(AUTH_ENDPOINTS.TOKEN, {
        cm_firebase_token: firebaseToken,
        _method: 'put'
      });
    } catch (error) {
      throw extractErrorMessage(error);
    }
  },

  setLanguageCode: async (languageCode: string): Promise<any> => {
    try {
      return await apiService.post(AUTH_ENDPOINTS.SET_LANGUAGE, {
        current_language: languageCode,
        _method: 'put'
      });
    } catch (error) {
      throw extractErrorMessage(error);
    }
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPassword');
  }
};

// Create a repository-like interface for authentication
export const authRepository = {
  // In-memory token cache
  tokenCache: '',
  
  saveUserToken: (token: string): void => {
    // Save to localStorage
    localStorage.setItem('token', token);
    // Save to in-memory cache
    authRepository.tokenCache = token;
  },
  
  getUserToken: (): string => {
    // Try to get from in-memory cache first for better performance
    if (authRepository.tokenCache) {
      return authRepository.tokenCache;
    }
    // Fall back to localStorage
    const token = localStorage.getItem('token') || '';
    // Update cache if token exists in localStorage
    if (token) {
      authRepository.tokenCache = token;
    }
    return token;
  },
  
  isLoggedIn: (): boolean => {
    return !!authRepository.getUserToken();
  },
  
  saveUserCredentials: (email: string, password: string): void => {
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPassword', password);
  },
  
  getUserEmail: (): string => {
    return localStorage.getItem('userEmail') || '';
  },
  
  getUserPassword: (): string => {
    return localStorage.getItem('userPassword') || '';
  },
  
  clearUserCredentials: (): void => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPassword');
  },
  
  clearAllData: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPassword');
    // Clear the token cache
    authRepository.tokenCache = '';
  }
};
