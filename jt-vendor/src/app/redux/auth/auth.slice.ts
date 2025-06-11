import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService, authRepository } from './auth.service';
import { LoginModel, RegisterModel, AuthResponse } from '../models';
import { toast } from "sonner";

// New async thunk to check for a stored token
export const checkToken = createAsyncThunk(
  'auth/checkToken',
  async (_, { rejectWithValue }) => {
    const token = authRepository.getUserToken();
    ////console.log(token);
    if (token) {
      return token;
    }
    return rejectWithValue('No token found.');
  }
);

interface AuthState {
  user: any | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null | any[];
}

const initialState: AuthState = {
  user: null,
  token: authRepository.getUserToken(),
  isLoggedIn: authRepository.isLoggedIn(),
  isLoading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginModel, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      
      // Save user credentials if remember me is enabled
      if (credentials.email && credentials.password) {
        authRepository.saveUserCredentials(credentials.email, credentials.password);
      }
      
      // Save auth token
      authRepository.saveUserToken(response.token);
      
      return response;
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Login failed. Please try again.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (registerData: RegisterModel, { rejectWithValue }) => {
    try {
      const response = await authService.register(registerData);
      
      // Save auth token
      authRepository.saveUserToken(response.token);
      
      return response;
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Registration failed. Please try again.');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      //console.log('loging out');
      
      await authService.logout();

    } catch (error: any) {
      // Even on error, we still want to clear local data
      authRepository.clearAllData();
      
      return rejectWithValue('Logout failed.');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(email);
      return response;
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Failed to send reset email. Please try again.');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }: { email: string, otp: string }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOtp(email, otp);
      return response;
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('OTP verification failed. Please try again.');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    { email, otp, password, confirmPassword }: 
    { email: string, otp: string, password: string, confirmPassword: string }, 
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.resetPassword(email, otp, password, confirmPassword);
      return response;
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('Password reset failed. Please try again.');
    }
  }
);

// Create the slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        toast.success("Login successful!");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        // Ensure error is string or string array
        if (typeof action.payload === 'object' && action.payload !== null) {
          // If it's an array of error objects, extract the messages
          if (Array.isArray(action.payload)) {
            state.error = action.payload.map(err => 
              typeof err === 'object' ? (err.message || JSON.stringify(err)) : String(err)
            );
          } else {
            // Single error object
            state.error = (action.payload as { message?: string }).message || JSON.stringify(action.payload);
          }
        } else {
          state.error = action.payload as string || "Login failed";
        }
        toast.error(typeof state.error === 'string' ? state.error : "Login failed");
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        toast.success("Registration successful!");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        // Ensure error is string or string array
        if (typeof action.payload === 'object' && action.payload !== null) {
          // If it's an array of error objects, keep it as is for the ErrorDisplay component
          if (Array.isArray(action.payload)) {
            state.error = action.payload;
          } else {
            // Single error object
            state.error = (action.payload as { message?: string }).message || JSON.stringify(action.payload);
          }
        } else {
          state.error = action.payload as string || "Registration failed";
        }
        
        // For toast, simplify to string
        const errorMessage = Array.isArray(state.error) 
          ? "Registration failed. Please check the form for errors." 
          : (typeof state.error === 'string' ? state.error : "Registration failed");
        
        toast.error(errorMessage);
      })
      
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.user = null;
        state.token = null;
        toast.success("Logged out successfully");
      })
      
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        toast.success("Reset code sent to your email");
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string || "Failed to send reset email");
      })
      
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.isLoading = false;
        toast.success("OTP verified successfully");
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string || "OTP verification failed");
      })
      
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        toast.success("Password reset successful");
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string || "Password reset failed");
      })
      
      // Token check
      .addCase(checkToken.fulfilled, (state, action: PayloadAction<string>) => {
        state.token = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(checkToken.rejected, (state) => {
        state.token = null;
        state.isLoggedIn = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
