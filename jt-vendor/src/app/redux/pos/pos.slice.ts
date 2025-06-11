import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PosState, PosProductsResponse } from './pos.models';
import posService from './pos.service';
import { OrderRequestPayload, OrderResponse } from '../order/orderCreation.models';
import { placeOrderService } from '../order/orderCreation.service';

// Initial state
const initialState: PosState = {
  categories: [],
  products: {
    total_size: 0,
    limit: "0",
    offset: "0",
    products: []
  },
  loading: false,
  error: null,
  orderSubmitting: false,
  orderSubmitError: null,
  orderSubmitSuccess: false,
  createdOrderId: null,
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  'pos/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await posService.getCategories();
      //console.log('response', response);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchProducts = createAsyncThunk(
  'pos/fetchProducts',
  async (params: { name?: string; category_id?: string | number; limit: number; offset: number }, { rejectWithValue }) => {
    try {
      // Convert category_id to number if it's a string
      const updatedParams = {
        ...params,
        category_id: params.category_id ? Number(params.category_id) : undefined
      };
      
      const response = await posService.getProducts(updatedParams);
      //console.log('products response', response);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Add placeOrder async thunk to connect with orderCreationService
export const placeOrder = createAsyncThunk<
  OrderResponse,
  OrderRequestPayload,
  { rejectValue: string }
>(
  'pos/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      //console.log('POS Slice - Placing order with data:', orderData);
      const response = await placeOrderService(orderData);
      //console.log('POS Slice - Order placement response:', response);
      return response;
    } catch (error: any) {
      console.error('POS Slice - Order placement error:', error);
      return rejectWithValue(error.message || 'Failed to place order');
    }
  }
);

// Create slice
const posSlice = createSlice({
  name: 'pos',
  initialState,
  reducers: {
    clearPosErrors: (state) => {
      state.error = null;
    },
    resetOrderState: (state) => {
      state.orderSubmitting = false;
      state.orderSubmitError = null;
      state.orderSubmitSuccess = false;
      state.createdOrderId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Categories reducers
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Products reducers
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Order placement reducers
      .addCase(placeOrder.pending, (state) => {
        state.orderSubmitting = true;
        state.orderSubmitError = null;
        state.orderSubmitSuccess = false;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orderSubmitting = false;
        state.orderSubmitSuccess = true;
        state.createdOrderId = action.payload.order_id || null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.orderSubmitting = false;
        state.orderSubmitError = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { clearPosErrors, resetOrderState } = posSlice.actions;
export default posSlice.reducer;
