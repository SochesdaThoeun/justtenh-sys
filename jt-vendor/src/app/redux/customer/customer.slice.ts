import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { customerService } from './customer.service';
import { CustomersResponse, CustomerModel, AddCustomerParams, CustomerOrdersResponse, CustomerOrderModel } from './customer.models';

// Define state interface
interface CustomerState {
  customers: CustomerModel[];
  currentCustomer: CustomerModel | null;
  customerOrders: CustomerOrderModel[];
  total: number;
  loading: boolean;
  customerDetailsLoading: boolean;
  customerOrdersLoading: boolean;
  error: string | null;
  customerDetailsError: string | null;
  customerOrdersError: string | null;
  offset: number;
  limit: number;
  addCustomerStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  addCustomerError: string | null;
}

// Initial state
const initialState: CustomerState = {
  customers: [],
  currentCustomer: null,
  customerOrders: [],
  total: 0,
  loading: false,
  customerDetailsLoading: false,
  customerOrdersLoading: false,
  error: null,
  customerDetailsError: null,
  customerOrdersError: null,
  offset: 0,
  limit: 10,
  addCustomerStatus: 'idle',
  addCustomerError: null,
};

// Async thunk for fetching customers
export const fetchCustomers = createAsyncThunk(
  'customer/fetchCustomers',
  async ({ offset, limit, searchValue }: { offset: number, limit: number, searchValue?: string }, { rejectWithValue }) => {
    try {
      const response = await customerService.fetchCustomers(offset, limit, searchValue);
      //console.log('API Response - fetchCustomers:', response);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for adding a customer
export const addCustomer = createAsyncThunk(
  'customer/addCustomer',
  async (customerData: AddCustomerParams, { rejectWithValue }) => {
    try {
      const response = await customerService.addCustomer(customerData);
      //console.log('API Response - addCustomer:', response);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for fetching customer details
export const fetchCustomerDetails = createAsyncThunk(
  'customer/fetchCustomerDetails',
  async (customerId: string | number, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomerDetails(customerId);
      //console.log('API Response - fetchCustomerDetails:', response);
      return response.customer;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Async thunk for fetching customer orders
export const fetchCustomerOrders = createAsyncThunk(
  'customer/fetchCustomerOrders',
  async (
    { customerId, limit = 10, offset = 1 }: 
    { customerId: string | number, limit?: number, offset?: number }, 
    { rejectWithValue }
  ) => {
    try {
      const response = await customerService.getCustomerOrders(customerId, limit, offset);
      //console.log('API Response - fetchCustomerOrders:', response);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Create slice
const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setOffset: (state, action: PayloadAction<number>) => {
      state.offset = action.payload;
    },
    resetAddCustomerState: (state) => {
      state.addCustomerStatus = 'idle';
      state.addCustomerError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<CustomersResponse>) => {
        state.loading = false;
        state.customers = action.payload.customers;
        state.total = action.payload.total;
        state.limit = action.payload.limit;
        state.offset = action.payload.offset;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add customer cases
      .addCase(addCustomer.pending, (state) => {
        state.addCustomerStatus = 'loading';
        state.addCustomerError = null;
      })
      .addCase(addCustomer.fulfilled, (state, action: PayloadAction<CustomerModel>) => {
        state.addCustomerStatus = 'succeeded';
        // Optionally add the new customer to the state if needed
        state.customers.unshift(action.payload);
        state.total += 1;
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.addCustomerStatus = 'failed';
        state.addCustomerError = action.payload as string;
      })
      // Customer details cases
      .addCase(fetchCustomerDetails.pending, (state) => {
        state.customerDetailsLoading = true;
        state.customerDetailsError = null;
      })
      .addCase(fetchCustomerDetails.fulfilled, (state, action: PayloadAction<CustomerModel>) => {
        state.customerDetailsLoading = false;
        state.currentCustomer = action.payload;
      })
      .addCase(fetchCustomerDetails.rejected, (state, action) => {
        state.customerDetailsLoading = false;
        state.customerDetailsError = action.payload as string;
      })
      // Customer orders cases
      .addCase(fetchCustomerOrders.pending, (state) => {
        state.customerOrdersLoading = true;
        state.customerOrdersError = null;
      })
      .addCase(fetchCustomerOrders.fulfilled, (state, action: PayloadAction<CustomerOrdersResponse>) => {
        state.customerOrdersLoading = false;
        state.customerOrders = action.payload.orders;
        state.total = action.payload.total;
        state.limit = action.payload.limit;
        state.offset = action.payload.offset;
      })
      .addCase(fetchCustomerOrders.rejected, (state, action) => {
        state.customerOrdersLoading = false;
        state.customerOrdersError = action.payload as string;
      });
  },
});

export const { setLimit, setOffset, resetAddCustomerState } = customerSlice.actions;
export default customerSlice.reducer;
