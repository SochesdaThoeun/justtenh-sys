// src/models/auth/Auth.Models.ts

export interface LoginModel {
  email?: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterModel {
  fName?: string;
  lName?: string;
  phone?: string;
  email: string;
  password: string;
  confirmPassword: string;
  shopName?: string;
  shopAddress?: string;
  profileImage?: File | null;
  shopLogo: File | null;
  shopBanner?: File | null;
  secondaryBanner: File | null;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
}
