import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrderCustomer, getOrderList } from './orderController';
import { OrderModel } from '../models';

interface DateRangeState {
  startDate: Date | null;
  endDate: Date | null;
}

interface OrderState {
  orders: OrderModel['orders'];
  totalSize: number;
  loading: boolean;
  error?: string;
  customers: OrderModel['customers'];
  
  // UI Filter State
  searchTerm: string;
  customerFilter: string;
  dateTypeFilter: string;
  dateRange: DateRangeState;
  currentPage: number;
  entriesPerPage: number;
  statusFilter: string[] | string;
}

const initialState: OrderState = {
  orders: [],
  totalSize: 0,
  loading: false,
  customers: [],
  
  // UI Filter State (Initialize with default values)
  searchTerm: '',
  customerFilter: '',
  dateTypeFilter: '',
  dateRange: {
    startDate: null,
    endDate: null,
  },
  currentPage: 1,
  entriesPerPage: 10,
  statusFilter: '',
};

// Helper function to format dates for API
export const formatDateForAPI = (date: Date | null): string | null => {
  if (!date) return null;
  return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

// Helper function to process status parameter
const processStatusParam = (status: string | string[]): string | string[] | null => {
  // If status is an array and has only 'all' or is empty, return null
  if (Array.isArray(status)) {
    if (status.length === 0 || (status.length === 1 && status[0] === 'all')) {
      return null;
    }
    return status;
  }
  
  // If status is a string and is 'all' or empty, return null
  if (!status || status === 'all') {
    return null;
  }
  
  return status;
};

export const fetchOrderList = createAsyncThunk(
  'order/fetchOrderList',
  async ({
    offset,
    searchvalue,
    from_date,
    to_date,
    customer_id,
  }: {
    offset: number;
    searchvalue: string;
    from_date: string | null;
    to_date: string | null;
    customer_id: string;
  }, { getState }) => {

    const state = getState() as { orderReducer: OrderState };
    const { statusFilter } = state.orderReducer;
    const processedStatus = processStatusParam(statusFilter);
    
    ////console.log('Using processed status:', processedStatus);

    // Use a default empty string if processedStatus is null
    const data: OrderModel | null = await getOrderList(
      offset,
      processedStatus || '',
      searchvalue,
      from_date,
      to_date,
      customer_id
    );
   
    return data;
  }
);

export const fetchOrderCustomer = createAsyncThunk(
  'order/fetchOrderCustomer',
  async () => {
    const data = await getOrderCustomer();
    return data;
  }
);

// New action to apply all current filters and fetch orders
export const applyFiltersAndFetch = createAsyncThunk(
  'order/applyFiltersAndFetch',
  async (_, { getState, dispatch }) => {
    const state = getState() as { orderReducer: OrderState };
    const {
      searchTerm,
      dateRange,
      customerFilter,
    } = state.orderReducer;

    await dispatch(fetchOrderList({
      offset: 1, // Reset to first page when applying filters
      searchvalue: searchTerm,
      from_date: formatDateForAPI(dateRange.startDate),
      to_date: formatDateForAPI(dateRange.endDate),
      customer_id: customerFilter
    }));

    return true;
  }
);

// New action to handle pagination
export const changePage = createAsyncThunk(
  'order/changePage',
  async (page: number, { getState, dispatch }) => {
    const state = getState() as { orderReducer: OrderState };
    const {
      searchTerm,
      dateRange,
      customerFilter,
    } = state.orderReducer;

    await dispatch(fetchOrderList({
      offset: page,
      searchvalue: searchTerm,
      from_date: formatDateForAPI(dateRange.startDate),
      to_date: formatDateForAPI(dateRange.endDate),
      customer_id: customerFilter
    }));

    return page;
  }
);

// New action to reset all filters
export const resetFilters = createAsyncThunk(
  'order/resetFilters',
  async (_, { dispatch, getState }) => {
    await dispatch(fetchOrderList({
      offset: 1,
      searchvalue: '',
      from_date: null,
      to_date: null,
      customer_id: ''
    }));

    return true;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload.orders || [];
      state.totalSize = action.payload.totalSize || 0;
    },
    
    // New reducers for UI state
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset page when search changes
    },
    
    setCustomerFilter: (state, action: PayloadAction<string>) => {
      state.customerFilter = action.payload;
      state.currentPage = 1; // Reset page when customer filter changes
    },
    
    setDateTypeFilter: (state, action: PayloadAction<string>) => {
      state.dateTypeFilter = action.payload;
      
      // If date type changes, update date range based on selection
      if (action.payload) {
        const today = new Date();
        let startDate: Date | null = null;
        let endDate: Date | null = today;
    
        if (action.payload === 'ThisYear') {
          startDate = new Date(today.getFullYear(), 0, 1); // January 1st of current year
        } else if (action.payload === 'ThisMonth') {
          startDate = new Date(today.getFullYear(), today.getMonth(), 1); // 1st of current month
        } else if (action.payload === 'ThisWeek') {
          // Calculate the start of the current week (Sunday)
          const day = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
          startDate = new Date(today);
          startDate.setDate(today.getDate() - day); // Go back to Sunday
        } else if (action.payload === 'CustomDate') {
          // Don't change the dates, use what user picks
          return;
        }
    
        state.dateRange = { startDate, endDate };
      }
    },
    
    setStartDate: (state, action: PayloadAction<Date | null>) => {
      state.dateRange.startDate = action.payload;
    },
    
    setEndDate: (state, action: PayloadAction<Date | null>) => {
      state.dateRange.endDate = action.payload;
    },
    
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    // Updated to accept either string or string[]
    setStatusFilter: (state, action: PayloadAction<string[] | string>) => {
      state.statusFilter = action.payload;
      state.currentPage = 1; // Reset page when status filter changes
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrderList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOrderList.fulfilled, (state, action) => {
      state.loading = false;
      ////console.log('fetchOrderList fulfilled, payload:', action.payload);
      if (!action.payload) {
        ////console.log('No data returned from service');
        return;
      }
      state.orders = action.payload.orders || [];
      state.totalSize = action.payload.total_size || 0;
    });
    builder.addCase(fetchOrderList.rejected, (state, action) => {
      ////console.log('fetchOrderList rejected, error:', action.error);
      state.loading = false;
      state.error = action.error.message;
    });
    builder.addCase(fetchOrderCustomer.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOrderCustomer.fulfilled, (state, action) => {
      state.loading = false;
      state.customers = action.payload?.customers || [];
    });
    builder.addCase(fetchOrderCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    
    // Handle changePage thunk
    builder.addCase(changePage.fulfilled, (state, action) => {
      state.currentPage = action.payload;
    });
    
    // Handle resetFilters thunk
    builder.addCase(resetFilters.fulfilled, (state) => {
      state.searchTerm = '';
      state.customerFilter = '';
      state.dateTypeFilter = '';
      state.dateRange = {
        startDate: null,
        endDate: null,
      };
      state.currentPage = 1;
  
    });
  },
});

export const { 
  setOrders, 
  setSearchTerm, 
  setCustomerFilter, 
  setDateTypeFilter,
  setStartDate,
  setEndDate,
  setCurrentPage,
  setStatusFilter
} = orderSlice.actions;

export default orderSlice.reducer;
