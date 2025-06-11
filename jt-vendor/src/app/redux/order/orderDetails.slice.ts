// slice/orderDetailsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { OrderDetailsModel } from '../models';
import * as api from './orderDetail.service';

// Define interface for order detail items that includes tax and tax_model
interface OrderDetailItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  tax?: number;
  tax_model?: string; // 'include' or 'exclude'
  [key: string]: any; // Allow for other properties
}

// Extend OrderDetailsModel to include details array
interface ExtendedOrderDetailsModel extends OrderDetailsModel {
  details?: OrderDetailItem[];
}

interface OrderDetailsState {
  orderDetails: ExtendedOrderDetailsModel[] | null;
  orderStatusList: string[];
  orderStatusType: string;
  paymentMethodIndex: number;
  selectedFileForImport: File | null;
  isLoading: boolean;
  isUploadLoading: boolean;
  isUpdating: boolean;
  isAssigningDelivery: boolean;
  isDownloadLoading: boolean;
  downloadIndex: number;
  error: string | null;
  updateError: string | null;
}

const initialState: OrderDetailsState = {
  orderDetails: null,
  orderStatusList: [],
  orderStatusType: '',
  paymentMethodIndex: 0,
  selectedFileForImport: null,
  isLoading: false,
  isUploadLoading: false,
  isUpdating: false,
  isAssigningDelivery: false,
  isDownloadLoading: false,
  downloadIndex: -1,
  error: null,
  updateError: null,
};

// Async thunks

export const fetchOrderDetailsThunk = createAsyncThunk<
  ExtendedOrderDetailsModel[],
  string,
  { rejectValue: string }
>(
  'orderDetails/fetchOrderDetails',
  async (orderID: string, thunkAPI) => {
    try {
      const data = await api.fetchOrderDetails(orderID) as ExtendedOrderDetailsModel[];
      
      // Ensure each cart item has tax and tax_model
      if (data && Array.isArray(data)) {
        return data.map(order => {
          if (order.details && Array.isArray(order.details)) {
            return {
              ...order,
              details: order.details.map(item => ({
                ...item,
                tax: item.tax || 0,
                tax_model: item.tax_model || 'exclude' // Default to exclude if not provided
              }))
            };
          }
          return order;
        });
      }
      
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.errors[0].message || 'Failed to fetch order details');
    }
  }
);

export const updateOrderStatusThunk = createAsyncThunk(
  'orderDetails/updateOrderStatus',
  async (
    { orderID, status }: { orderID: number; status: string },
    thunkAPI
  ) => {
    try {
      const data = await api.updateOrderStatus(orderID, status);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.errors[0].message || 'Failed to update order status');
    }
  }
);

export const updatePaymentStatusThunk = createAsyncThunk(
  'orderDetails/updatePaymentStatus',
  async (
    { orderId, status }: { orderId: number; status: string },
    thunkAPI
  ) => {
    try {
      const data = await api.updatePaymentStatus(orderId, status);
      //console.log('data', data);
      return data;
    } catch (error: any) {
      //console.log('error', error.response.data.errors[0].message);
      return thunkAPI.rejectWithValue(error.response.data.errors[0].message || 'Failed to update payment status');
    }
  }
);

export const assignThirdPartyDeliveryThunk = createAsyncThunk(
  'orderDetails/assignThirdPartyDelivery',
  async (
    {
      orderId,
      deliveryServiceName,
      trackingId
    }: {
      orderId: number;
      deliveryServiceName: string;
      trackingId?: string;
    },
    thunkAPI
  ) => {
    try {
      const data = await api.assignThirdPartyDelivery(orderId, deliveryServiceName, trackingId);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.errors?.[0]?.message || 'Failed to assign third party delivery'
      );
    }
  }
);

export const uploadDigitalProductThunk = createAsyncThunk(
  'orderDetails/uploadDigitalProduct',
  async (
    { file, token, orderId }: { file: File; token: string; orderId: string },
    thunkAPI
  ) => {
    try {
      const data = await api.uploadAfterSellDigitalProduct(file, token, orderId);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.errors[0].message || 'Failed to upload digital product');
    }
  }
);

export const productDownloadThunk = createAsyncThunk(
  'orderDetails/productDownload',
  async ({ url }: { url: string }, thunkAPI) => {
    try {
      const blob = await api.productDownload(url);
      return blob;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.errors[0].message || 'Failed to download product');
    }
  }
);

const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    setPaymentMethodIndex(state, action) {
      state.paymentMethodIndex = action.payload;
    },
    setSelectedFileForImport(state, action) {
      state.selectedFileForImport = action.payload;
    },
    setOrderStatusList(state, action) {
      state.orderStatusList = action.payload;
      state.orderStatusType = action.payload[0] || '';
    },
    clearErrors(state) {
      state.error = null;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderDetailsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetailsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderDetailsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateOrderStatusThunk.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state) => {
        state.isUpdating = false;
        state.updateError = null;
      })
      .addCase(updateOrderStatusThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload as string;
      })
      .addCase(updatePaymentStatusThunk.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updatePaymentStatusThunk.fulfilled, (state) => {
        state.isUpdating = false;
        state.updateError = null;
      })
      .addCase(updatePaymentStatusThunk.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload as string;
      })
      .addCase(assignThirdPartyDeliveryThunk.pending, (state) => {
        state.isAssigningDelivery = true;
        state.updateError = null;
      })
      .addCase(assignThirdPartyDeliveryThunk.fulfilled, (state) => {
        state.isAssigningDelivery = false;
        state.updateError = null;
      })
      .addCase(assignThirdPartyDeliveryThunk.rejected, (state, action) => {
        state.isAssigningDelivery = false;
        state.updateError = action.payload as string;
      })
      .addCase(uploadDigitalProductThunk.pending, (state) => {
        state.isUploadLoading = true;
        state.error = null;
      })
      .addCase(uploadDigitalProductThunk.fulfilled, (state) => {
        state.isUploadLoading = false;
        state.error = null;
      })
      .addCase(uploadDigitalProductThunk.rejected, (state, action) => {
        state.isUploadLoading = false;
        state.error = action.payload as string;
      })
      .addCase(productDownloadThunk.pending, (state) => {
        state.isDownloadLoading = true;
        state.error = null;
      })
      .addCase(productDownloadThunk.fulfilled, (state) => {
        state.isDownloadLoading = false;
        state.error = null;
      })
      .addCase(productDownloadThunk.rejected, (state, action) => {
        state.isDownloadLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPaymentMethodIndex, setSelectedFileForImport, setOrderStatusList, clearErrors } = orderDetailsSlice.actions;
export default orderDetailsSlice.reducer;
