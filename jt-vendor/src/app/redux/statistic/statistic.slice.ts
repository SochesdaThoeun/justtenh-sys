import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  StatisticState,
  SalesChartParams, 
  SalesChartResponse, 
  CustomerOrdersParams, 
  CustomerOrdersResponse,
  OrdersPerDayParams,
  OrdersPerDayResponse,
  ShippingCostParams,
  ShippingCostResponse,
  ReturnOrdersParams,
  ReturnOrdersResponse,
  ProductPerformanceParams,
  ProductPerformanceResponse
} from './statistic.models';
import { statisticService } from './statistic.service';
import { toast } from 'sonner';

// Initial state
const initialState: StatisticState = {
  salesChart: null,
  customerOrders: null,
  ordersPerDay: null,
  shippingCost: null,
  returnOrders: null,
  productPerformance: null,
  isLoading: false,
  error: null
};

// Async thunks for statistics API calls
export const fetchSalesChart = createAsyncThunk(
  'statistic/fetchSalesChart',
  async (params: SalesChartParams, { rejectWithValue }) => {
    try {
      const response = await statisticService.getSalesChart(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchCustomerOrders = createAsyncThunk(
  'statistic/fetchCustomerOrders',
  async (params: CustomerOrdersParams, { rejectWithValue }) => {
    try {
      const response = await statisticService.getCustomerOrders(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchOrdersPerDay = createAsyncThunk(
  'statistic/fetchOrdersPerDay',
  async (params: OrdersPerDayParams, { rejectWithValue }) => {
    try {
      const response = await statisticService.getOrdersPerDay(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchShippingCost = createAsyncThunk(
  'statistic/fetchShippingCost',
  async (params: ShippingCostParams, { rejectWithValue }) => {
    try {
      const response = await statisticService.getShippingCost(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchReturnOrders = createAsyncThunk(
  'statistic/fetchReturnOrders',
  async (params: ReturnOrdersParams, { rejectWithValue }) => {
    try {
      const response = await statisticService.getReturnOrders(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchProductPerformance = createAsyncThunk(
  'statistic/fetchProductPerformance',
  async (params: ProductPerformanceParams, { rejectWithValue }) => {
    try {
      const response = await statisticService.getProductPerformance(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// Create slice
const statisticSlice = createSlice({
  name: 'statistic',
  initialState,
  reducers: {
    clearStatisticError: (state) => {
      state.error = null;
    },
    resetStatisticState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Sales chart
      .addCase(fetchSalesChart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSalesChart.fulfilled, (state, action: PayloadAction<SalesChartResponse>) => {
        state.isLoading = false;
        state.salesChart = action.payload;
      })
      .addCase(fetchSalesChart.rejected, (state, action) => {
        state.isLoading = false;
        if (typeof action.payload === 'object' && action.payload !== null) {
          state.error = Array.isArray(action.payload)
            ? action.payload
            : (action.payload as { message?: string }).message || JSON.stringify(action.payload);
        } else {
          state.error = (action.payload as string) || "Failed to fetch sales chart data";
        }
        toast.error(typeof state.error === 'string' ? state.error : "Failed to fetch sales chart data");
      })

      // Customer orders
      .addCase(fetchCustomerOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomerOrders.fulfilled, (state, action: PayloadAction<CustomerOrdersResponse>) => {
        state.isLoading = false;
        state.customerOrders = action.payload;
      })
      .addCase(fetchCustomerOrders.rejected, (state, action) => {
        state.isLoading = false;
        if (typeof action.payload === 'object' && action.payload !== null) {
          state.error = Array.isArray(action.payload)
            ? action.payload
            : (action.payload as { message?: string }).message || JSON.stringify(action.payload);
        } else {
          state.error = (action.payload as string) || "Failed to fetch customer orders data";
        }
        toast.error(typeof state.error === 'string' ? state.error : "Failed to fetch customer orders data");
      })

      // Orders per day
      .addCase(fetchOrdersPerDay.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrdersPerDay.fulfilled, (state, action: PayloadAction<OrdersPerDayResponse>) => {
        state.isLoading = false;
        state.ordersPerDay = action.payload;
      })
      .addCase(fetchOrdersPerDay.rejected, (state, action) => {
        state.isLoading = false;
        if (typeof action.payload === 'object' && action.payload !== null) {
          state.error = Array.isArray(action.payload)
            ? action.payload
            : (action.payload as { message?: string }).message || JSON.stringify(action.payload);
        } else {
          state.error = (action.payload as string) || "Failed to fetch orders per day data";
        }
        toast.error(typeof state.error === 'string' ? state.error : "Failed to fetch orders per day data");
      })

      // Shipping cost
      .addCase(fetchShippingCost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShippingCost.fulfilled, (state, action: PayloadAction<ShippingCostResponse>) => {
        state.isLoading = false;
        state.shippingCost = action.payload;
      })
      .addCase(fetchShippingCost.rejected, (state, action) => {
        state.isLoading = false;
        if (typeof action.payload === 'object' && action.payload !== null) {
          state.error = Array.isArray(action.payload)
            ? action.payload
            : (action.payload as { message?: string }).message || JSON.stringify(action.payload);
        } else {
          state.error = (action.payload as string) || "Failed to fetch shipping cost data";
        }
        toast.error(typeof state.error === 'string' ? state.error : "Failed to fetch shipping cost data");
      })

      // Return orders
      .addCase(fetchReturnOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReturnOrders.fulfilled, (state, action: PayloadAction<ReturnOrdersResponse>) => {
        state.isLoading = false;
        state.returnOrders = action.payload;
      })
      .addCase(fetchReturnOrders.rejected, (state, action) => {
        state.isLoading = false;
        if (typeof action.payload === 'object' && action.payload !== null) {
          state.error = Array.isArray(action.payload)
            ? action.payload
            : (action.payload as { message?: string }).message || JSON.stringify(action.payload);
        } else {
          state.error = (action.payload as string) || "Failed to fetch return orders data";
        }
        toast.error(typeof state.error === 'string' ? state.error : "Failed to fetch return orders data");
      })

      // Product performance
      .addCase(fetchProductPerformance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductPerformance.fulfilled, (state, action: PayloadAction<ProductPerformanceResponse>) => {
        state.isLoading = false;
        state.productPerformance = action.payload;
      })
      .addCase(fetchProductPerformance.rejected, (state, action) => {
        state.isLoading = false;
        if (typeof action.payload === 'object' && action.payload !== null) {
          state.error = Array.isArray(action.payload)
            ? action.payload
            : (action.payload as { message?: string }).message || JSON.stringify(action.payload);
        } else {
          state.error = (action.payload as string) || "Failed to fetch product performance data";
        }
        toast.error(typeof state.error === 'string' ? state.error : "Failed to fetch product performance data");
      });
  }
});

export const { clearStatisticError, resetStatisticState } = statisticSlice.actions;
export default statisticSlice.reducer;
