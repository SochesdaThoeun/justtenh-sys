import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { VendorBody, VendorInfoModel, VendorResponse, DeleteAccountResponse, MonthlyOrdersResponse, EarningStatisticsResponse, ShopInfoModel, ShopInfoResponse, ImageFullUrl, Wallet, DashboardData } from '../models';
import { vendorService } from './vendorService';
import { toast } from 'sonner';

// Define interfaces that are missing from models
interface VacationModeData {
  status: boolean;
  startDate: string;
  endDate: string;
  note: string;
}

interface VendorState {
  profile: VendorInfoModel | null;
  shopInfo: ShopInfoModel | null;
  isLoading: boolean;
  error: string | null | any[];
  monthlyOrders: number[];
  sellerEarnings: number[];
  commissionEarnings: number[];
  recentOrders: any[];
}

const initialState: VendorState = {
  profile: null,
  shopInfo: null,
  isLoading: false,
  error: null,
  monthlyOrders: [],
  sellerEarnings: [],
  commissionEarnings: [],
  recentOrders: []
};

// Helper function to map API response to VendorInfoModel with proper defaults
const mapToVendorInfoModel = (profileData: any): VendorInfoModel => {
  const defaultImageFullUrl: ImageFullUrl = { key: '', path: '', status: 0 };
  const defaultWallet: Wallet = {
    id: 0,
    seller_id: 0,
    total_earning: 0,
    withdrawn: 0,
    created_at: '',
    updated_at: '',
    commission_given: 0,
    pending_withdraw: 0,
    delivery_charge_earned: 0,
    collected_cash: 0,
    total_tax_collected: 0
  };
  const defaultDashboardData: DashboardData = {
    orderStatus: {
      pending: 0,
      confirmed: 0,
      processing: 0,
      out_for_delivery: 0,
      delivered: 0,
      canceled: 0,
      returned: 0,
      failed: 0
    },
    products_count: 0,
    orders_count: 0,
    total_earning: 0,
    withdrawn: 0,
    pending_withdraw: 0,
    admin_commission: 0,
    delivery_charge_earned: 0,
    collected_cash: 0,
    total_tax_collected: 0
  };

  return {
    id: profileData.id,
    f_name: profileData.f_name || '',
    l_name: profileData.l_name || '',
    phone: profileData.phone || '',
    email: profileData.email || '',
    password: profileData.password || '',
    image: profileData.image || '',
    image_full_url: profileData.image_full_url || defaultImageFullUrl,
    status: profileData.status || '',
    remember_token: profileData.remember_token || '',
    created_at: profileData.created_at || '',
    updated_at: profileData.updated_at || '',
    bank_name: profileData.bank_name || '',
    branch: profileData.branch || '',
    account_no: profileData.account_no || '',
    holder_name: profileData.holder_name || '',
    auth_token: profileData.auth_token || '',
    sales_commission_percentage: profileData.sales_commission_percentage || 0,
    gst: profileData.gst || '',
    cm_firebase_token: profileData.cm_firebase_token || '',
    pos_status: profileData.pos_status || 0,
    minimum_order_amount: profileData.minimum_order_amount || 0,
    free_delivery_status: profileData.free_delivery_status || 0,
    free_delivery_over_amount: profileData.free_delivery_over_amount || 0,
    app_language: profileData.app_language || 'en',
    product_count: profileData.product_count || 0,
    orders_count: profileData.orders_count || 0,
    free_delivery_features_status: profileData.free_delivery_features_status || 0,
    free_delivery_responsibility: profileData.free_delivery_responsibility || '',
    minimum_order_amount_by_seller: profileData.minimum_order_amount_by_seller || 0,
    wallet: profileData.wallet || defaultWallet,
    storage: profileData.storage || [],
    vendorEarning: profileData.vendorEarning || [],
    commissionEarn: profileData.commissionEarn || [],
    labels: profileData.labels || [],
    dateType: profileData.dateType || '',
    dashboardData: profileData.dashboardData || defaultDashboardData
  };
};

export const fetchSellerInfo = createAsyncThunk(
  'vendor/fetchSellerInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await vendorService.getSellerInfo();
      ////console.log(response);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'vendor/updateProfile',
  async (
    { profileInfo, profileBody, file, password }:
    { profileInfo: VendorInfoModel, profileBody: VendorBody, file?: File | null, password?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await vendorService.updateProfile(profileInfo, profileBody, file, password);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const deleteUserAccount = createAsyncThunk(
  'vendor/deleteUserAccount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await vendorService.deleteUserAccount();
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchMonthlyOrders = createAsyncThunk(
  'vendor/fetchMonthlyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await vendorService.getMonthlyOrders();
      //console.log('Monthly orders response in thunk:', response);
      return response|| [];
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchEarningStatistics = createAsyncThunk(
  'vendor/fetchEarningStatistics',
  async (type: string = 'yearEarn', { rejectWithValue }) => {
    try {
      const response = await vendorService.getEarningStatistics(type);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchRecentOrders = createAsyncThunk(
  'vendor/fetchRecentOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await vendorService.getRecentOrders();
      return response.orders || [];
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const fetchShopInfo = createAsyncThunk(
  'vendor/fetchShopInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await vendorService.getShopInfo();
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const updateShopInfo = createAsyncThunk(
  'vendor/updateShopInfo',
  async (
    {
      shopInfo,
      logoFile,
      bannerFile,
      bottomBannerFile,
      offerBannerFile
    }: {
      shopInfo: Partial<ShopInfoModel>,
      logoFile?: File | null,
      bannerFile?: File | null,
      bottomBannerFile?: File | null,
      offerBannerFile?: File | null
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await vendorService.updateShopInfo(
        shopInfo,
        logoFile,
        bannerFile,
        bottomBannerFile,
        offerBannerFile
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const changeLanguage = createAsyncThunk(
  'vendor/changeLanguage',
  async (language: string, { rejectWithValue }) => {
    try {
      const response = await vendorService.changeLanguage(language);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const temporaryCloseShop = createAsyncThunk(
  'vendor/temporaryCloseShop',
  async (status: boolean, { rejectWithValue }) => {
    try {
      const response = await vendorService.temporaryCloseShop(status);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const setVacationMode = createAsyncThunk(
  'vendor/setVacationMode',
  async (vacationData: VacationModeData, { rejectWithValue }) => {
    try {
      const response = await vendorService.setVacationMode(
        vacationData.status,
        vacationData.startDate,
        vacationData.endDate,
        vacationData.note
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    updateProfileData: (state, action: PayloadAction<Partial<VendorInfoModel>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    updateShopData: (state, action: PayloadAction<Partial<ShopInfoModel>>) => {
      if (state.shopInfo) {
        state.shopInfo = { ...state.shopInfo, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch seller info
      .addCase(fetchSellerInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSellerInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = mapToVendorInfoModel(action.payload);
      })
      .addCase(fetchSellerInfo.rejected, (state, action) => {
        state.isLoading = false;
        if (typeof action.payload === 'object' && action.payload !== null) {
          state.error = Array.isArray(action.payload)
            ? action.payload
            : (action.payload as { message?: string }).message || JSON.stringify(action.payload);
        } else {
          state.error = (action.payload as string) || "Failed to fetch profile";
        }
        toast.error(typeof state.error === 'string' ? state.error : "Failed to fetch profile");
      })
      
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = mapToVendorInfoModel(action.payload);
        toast.success("Profile updated successfully!");
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        if (typeof action.payload === 'object' && action.payload !== null) {
          state.error = Array.isArray(action.payload)
            ? action.payload
            : (action.payload as { message?: string }).message || JSON.stringify(action.payload);
        } else {
          state.error = (action.payload as string) || "Profile update failed";
        }
        toast.error(typeof state.error === 'string' ? state.error : "Profile update failed");
      })
      
      // Delete user account
      .addCase(deleteUserAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUserAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(action.payload.message || "Account deleted successfully");
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.isLoading = false;
        if (typeof action.payload === 'object' && action.payload !== null) {
          state.error = Array.isArray(action.payload)
            ? action.payload
            : (action.payload as { message?: string }).message || JSON.stringify(action.payload);
        } else {
          state.error = (action.payload as string) || "Account deletion failed";
        }
        toast.error(typeof state.error === 'string' ? state.error : "Account deletion failed");
      })

      // Monthly Orders
      .addCase(fetchMonthlyOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        //console.log('Setting monthly orders in state:', action.payload);
        // Ensure we have an array of numbers, with fallback to empty array
        state.monthlyOrders = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMonthlyOrders.rejected, (state, action) => {
        state.isLoading = false;
        if (typeof action.payload === 'object' && action.payload !== null) {
          state.error = Array.isArray(action.payload)
            ? action.payload
            : (action.payload as { message?: string }).message || JSON.stringify(action.payload);
        } else {
          state.error = (action.payload as string) || "Failed to fetch monthly orders";
        }
        toast.error(typeof state.error === 'string' ? state.error : "Failed to fetch monthly orders");
      })

      // Earning Statistics
      .addCase(fetchEarningStatistics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEarningStatistics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sellerEarnings = action.payload.seller_earn || [];
        state.commissionEarnings = action.payload.commission_earn || [];
      })
      .addCase(fetchEarningStatistics.rejected, (state, action) => {
        state.isLoading = false;
        if (typeof action.payload === 'object' && action.payload !== null) {
          state.error = Array.isArray(action.payload)
            ? action.payload
            : (action.payload as { message?: string }).message || JSON.stringify(action.payload);
        } else {
          state.error = (action.payload as string) || "Failed to fetch earning statistics";
        }
        toast.error(typeof state.error === 'string' ? state.error : "Failed to fetch earning statistics");
      })

      // Recent Orders
      .addCase(fetchRecentOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recentOrders = action.payload || [];
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        state.isLoading = false;
        if (typeof action.payload === 'object' && action.payload !== null) {
          state.error = Array.isArray(action.payload)
            ? action.payload
            : (action.payload as { message?: string }).message || JSON.stringify(action.payload);
        } else {
          state.error = (action.payload as string) || "Failed to fetch recent orders";
        }
        toast.error(typeof state.error === 'string' ? state.error : "Failed to fetch recent orders");
      })

      // Fetch shop info
      .addCase(fetchShopInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShopInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        //console.log('Shop info response:', action.payload);
        if (action.payload) {
          // Cast the payload to ShopInfoModel since the data is directly in the payload
          state.shopInfo = action.payload as unknown as ShopInfoModel;
        } else {
          console.error('Shop info response does not contain expected data structure:', action.payload);
          state.shopInfo = null;
        }
      })
      .addCase(fetchShopInfo.rejected, (state, action) => {
        state.isLoading = false;
        if (typeof action.payload === 'object' && action.payload !== null) {
          state.error = Array.isArray(action.payload)
            ? action.payload
            : (action.payload as { message?: string }).message || JSON.stringify(action.payload);
        } else {
          state.error = (action.payload as string) || "Failed to fetch shop info";
        }
        toast.error(typeof state.error === 'string' ? state.error : "Failed to fetch shop info");
      })

      // Update shop info
      .addCase(updateShopInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateShopInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data) {
          state.shopInfo = action.payload.data;
        }
        toast.success("Shop info updated successfully!");
      })
      .addCase(updateShopInfo.rejected, (state, action) => {
        state.isLoading = false;
        
        // Process error for proper display
        try {
          //console.log('Shop update error payload:', action.payload);
          
          if (Array.isArray(action.payload)) {
            // Handle API response in array format: [{code: "name", message: "..."}, ...]
            state.error = action.payload;
            action.payload.forEach((err: any) => {
              if (err && typeof err === 'object' && 'message' in err) {
                toast.error(err.message);
              }
            });
            return;
          }
          
          if (typeof action.payload === 'object' && action.payload !== null) {
            // Check for errors array inside the payload
            if ('errors' in action.payload && Array.isArray((action.payload as any).errors)) {
              const errors = (action.payload as any).errors;
              state.error = errors;
              
              // Display each validation error
              errors.forEach((err: { code: string, message: string }) => {
                toast.error(err.message);
              });
              return;
            }
            
            // Handle single error object
            const errorMessage = 
              (action.payload as { message?: string }).message || 
              JSON.stringify(action.payload);
            
            state.error = errorMessage;
            toast.error(errorMessage);
          } else {
            // Handle string or other error types
            state.error = (action.payload as string) || "Shop info update failed";
            toast.error(typeof state.error === 'string' ? state.error : "Shop info update failed");
          }
        } catch (err) {
          console.error('Error processing API error response:', err);
          toast.error("Failed to update shop info");
          state.error = "Error processing response";
        }
      })

      // Change language
      .addCase(changeLanguage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changeLanguage.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.profile) {
          state.profile.app_language = action.meta.arg; // Update with the language passed to the action
        }
        toast.success("Language changed successfully!");
      })
      .addCase(changeLanguage.rejected, (state, action) => {
        state.isLoading = false;
        if (typeof action.payload === 'object' && action.payload !== null) {
          state.error = Array.isArray(action.payload)
            ? action.payload
            : (action.payload as { message?: string }).message || JSON.stringify(action.payload);
        } else {
          state.error = (action.payload as string) || "Language change failed";
        }
        toast.error(typeof state.error === 'string' ? state.error : "Language change failed");
      })

      // Temporary close shop
      .addCase(temporaryCloseShop.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(temporaryCloseShop.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.shopInfo) {
          state.shopInfo.temporary_close = action.meta.arg; // Update with the status passed to the action
        }
        toast.success(action.meta.arg 
          ? "Shop temporarily closed successfully" 
          : "Shop reopened successfully");
      })
      .addCase(temporaryCloseShop.rejected, (state, action) => {
        state.isLoading = false;
        if (typeof action.payload === 'object' && action.payload !== null) {
          state.error = Array.isArray(action.payload)
            ? action.payload
            : (action.payload as { message?: string }).message || JSON.stringify(action.payload);
        } else {
          state.error = (action.payload as string) || "Failed to update shop status";
        }
        toast.error(typeof state.error === 'string' ? state.error : "Failed to update shop status");
      })

      // Set vacation mode
      .addCase(setVacationMode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setVacationMode.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.shopInfo) {
          state.shopInfo.vacation_status = action.meta.arg.status;
          state.shopInfo.vacation_start_date = action.meta.arg.startDate;
          state.shopInfo.vacation_end_date = action.meta.arg.endDate;
          state.shopInfo.vacation_note = action.meta.arg.note;
        }
        toast.success(action.meta.arg.status 
          ? "Vacation mode enabled successfully" 
          : "Vacation mode disabled successfully");
      })
      .addCase(setVacationMode.rejected, (state, action) => {
        state.isLoading = false;
        if (typeof action.payload === 'object' && action.payload !== null) {
          state.error = Array.isArray(action.payload)
            ? action.payload
            : (action.payload as { message?: string }).message || JSON.stringify(action.payload);
        } else {
          state.error = (action.payload as string) || "Failed to update vacation mode";
        }
        toast.error(typeof state.error === 'string' ? state.error : "Failed to update vacation mode");
      })
  },
});

export const { clearProfileError, updateProfileData, updateShopData } = vendorSlice.actions;
export default vendorSlice.reducer;
