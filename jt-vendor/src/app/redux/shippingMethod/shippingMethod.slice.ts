import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  ShippingMethod, 
  ShippingMethodRequest, 
  ShippingMethodStatusUpdateRequest,
  ShippingMethodState,
  ApiResponse 
} from './shippingMethod.models';
import shippingMethodService from './shippingMethod.service';

// Initial state
const initialState: ShippingMethodState = {
  shippingMethods: [],
  selectedShippingMethod: null,
  loading: false,
  error: null,
  updateSuccess: false,
};

// Async thunks for shipping method operations

// Get all shipping methods
export const getShippingMethods = createAsyncThunk(
  'shippingMethod/getShippingMethods',
  async (_, { rejectWithValue }) => {
    try {
      return await shippingMethodService.getShippingMethods();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Get shipping method details
export const getShippingMethod = createAsyncThunk(
  'shippingMethod/getShippingMethod',
  async (id: number, { rejectWithValue }) => {
    try {
      return await shippingMethodService.getShippingMethod(id);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Add a new shipping method
export const addShippingMethod = createAsyncThunk(
  'shippingMethod/addShippingMethod',
  async (data: ShippingMethodRequest, { dispatch, rejectWithValue }) => {
    try {
      const response = await shippingMethodService.addShippingMethod(data);
      // Reload shipping methods after adding a new one
      dispatch(getShippingMethods());
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update shipping method
export const updateShippingMethod = createAsyncThunk(
  'shippingMethod/updateShippingMethod',
  async ({ id, data }: { id: number; data: ShippingMethodRequest }, { dispatch, rejectWithValue }) => {
    try {
      const response = await shippingMethodService.updateShippingMethod(id, data);
      // Reload shipping methods after update
      dispatch(getShippingMethods());
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Update shipping method status
export const updateShippingMethodStatus = createAsyncThunk(
  'shippingMethod/updateShippingMethodStatus',
  async (data: ShippingMethodStatusUpdateRequest, { dispatch, rejectWithValue }) => {
    try {
      const response = await shippingMethodService.updateShippingMethodStatus(data);
      // Reload shipping methods after status update
      dispatch(getShippingMethods());
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete shipping method
export const deleteShippingMethod = createAsyncThunk(
  'shippingMethod/deleteShippingMethod',
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      const response = await shippingMethodService.deleteShippingMethod(id);
      // Reload shipping methods after deletion
      dispatch(getShippingMethods());
      return { id };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the slice
const shippingMethodSlice = createSlice({
  name: 'shippingMethod',
  initialState,
  reducers: {
    resetShippingMethod: (state) => {
      state.loading = false;
      state.error = null;
      state.updateSuccess = false;
    },
    clearSelectedShippingMethod: (state) => {
      state.selectedShippingMethod = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get shipping methods
      .addCase(getShippingMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShippingMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.shippingMethods = action.payload || [];
      })
      .addCase(getShippingMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get shipping method details
      .addCase(getShippingMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShippingMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedShippingMethod = action.payload || null;
      })
      .addCase(getShippingMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add shipping method
      .addCase(addShippingMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(addShippingMethod.fulfilled, (state) => {
        state.loading = false;
        state.updateSuccess = true;
      })
      .addCase(addShippingMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.updateSuccess = false;
      })

      // Update shipping method
      .addCase(updateShippingMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateShippingMethod.fulfilled, (state) => {
        state.loading = false;
        state.updateSuccess = true;
      })
      .addCase(updateShippingMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.updateSuccess = false;
      })

      // Update shipping method status
      .addCase(updateShippingMethodStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateShippingMethodStatus.fulfilled, (state) => {
        state.loading = false;
        state.updateSuccess = true;
      })
      .addCase(updateShippingMethodStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.updateSuccess = false;
      })

      // Delete shipping method
      .addCase(deleteShippingMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShippingMethod.fulfilled, (state) => {
        state.loading = false;
        // We don't filter here since we're reloading the list via getShippingMethods
      })
      .addCase(deleteShippingMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetShippingMethod, clearSelectedShippingMethod } = shippingMethodSlice.actions;
export default shippingMethodSlice.reducer; 