/* eslint-disable @typescript-eslint/no-explicit-any */
import { VendorBody, VendorInfoModel, VendorResponse, DeleteAccountResponse, MonthlyOrdersResponse, EarningStatisticsResponse, ShopInfoResponse, ShopInfoModel } from '../models';
import { PROFILE_ENDPOINTS, AUTH_ENDPOINTS } from '@/app/constants/api.constants';
import apiService from '@/app/services/api.service';
// API service methods
const vendorService = {
  getSellerInfo: async (): Promise<VendorResponse> => {
    try {
      const response = await apiService.get<VendorResponse>(PROFILE_ENDPOINTS.SELLER_INFO);
    
      return response;
    } catch (error) {
      throw error;
    }
  },

  getShopInfo: async (): Promise<ShopInfoResponse> => {
    try {

      const response = await apiService.get<ShopInfoResponse>(PROFILE_ENDPOINTS.SHOP_INFO);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (
    profileInfo: VendorInfoModel, 
    profileBody: VendorBody, 
    file?: File | null, 
    password?: string
  ): Promise<VendorResponse> => {
    try {
      const formData = new FormData();
      
      formData.append('_method', profileBody._method || 'put');
      
      if (profileBody.f_name) formData.append('f_name', profileBody.f_name);
      if (profileBody.l_name) formData.append('l_name', profileBody.l_name);
      if (profileBody.bank_name) formData.append('bank_name', profileBody.bank_name);
      if (profileBody.branch) formData.append('branch', profileBody.branch);
      if (profileBody.account_no) formData.append('account_no', profileBody.account_no);
      if (profileBody.holder_name) formData.append('holder_name', profileBody.holder_name);
      if (password) formData.append('password', password);
      
      // Append new fields if available
      if (profileBody.cm_firebase_token) formData.append('cm_firebase_token', profileBody.cm_firebase_token);
      if (profileBody.pos_status !== undefined) formData.append('pos_status', String(profileBody.pos_status));
      if (profileBody.minimum_order_amount !== undefined) formData.append('minimum_order_amount', String(profileBody.minimum_order_amount));
      if (profileBody.free_delivery_status !== undefined) formData.append('free_delivery_status', String(profileBody.free_delivery_status));
      if (profileBody.free_delivery_over_amount !== undefined) formData.append('free_delivery_over_amount', String(profileBody.free_delivery_over_amount));
      if (profileBody.app_language) formData.append('app_language', profileBody.app_language);
      if (profileBody.free_delivery_features_status !== undefined) formData.append('free_delivery_features_status', String(profileBody.free_delivery_features_status));
      if (profileBody.free_delivery_responsibility) formData.append('free_delivery_responsibility', profileBody.free_delivery_responsibility);
      if (profileBody.minimum_order_amount_by_seller !== undefined) formData.append('minimum_order_amount_by_seller', String(profileBody.minimum_order_amount_by_seller));
      
      // Added phone field
      if (profileBody.phone) formData.append('phone', profileBody.phone);
      if (profileBody.email) formData.append('email', profileBody.email);
      
      if (file) formData.append('image', file);

      return await apiService.postForm<VendorResponse>(PROFILE_ENDPOINTS.UPDATE_PROFILE, formData);
    } catch (error) {
      throw error;
    }
  },

  updateShopInfo: async (
    shopData: Partial<ShopInfoModel>,
    logoFile?: File | null,
    bannerFile?: File | null,
    bottomBannerFile?: File | null,
    offerBannerFile?: File | null
  ): Promise<ShopInfoResponse> => {
    try {
      const formData = new FormData();

      //console.log('shopData', shopData);
      
      // Add required fields - always include these even if empty
      // This ensures they're always in the request for validation
      formData.append('name', shopData.name || '');
      formData.append('address', shopData.address || '');
      formData.append('contact', shopData.contact || '');
      
      // Add slug if available (optional but important for URL)
      if (shopData.slug) formData.append('slug', shopData.slug);
      
      // Add vacation mode data if available
      if (shopData.vacation_status !== undefined)
        formData.append('vacation_status', shopData.vacation_status ? '1' : '0');
      if (shopData.vacation_start_date)
        formData.append('vacation_start_date', shopData.vacation_start_date);
      if (shopData.vacation_end_date)
        formData.append('vacation_end_date', shopData.vacation_end_date);
      if (shopData.vacation_note)
        formData.append('vacation_note', shopData.vacation_note);
      
      // Add temporary close status if available
      if (shopData.temporary_close !== undefined)
        formData.append('temporary_close', shopData.temporary_close ? '1' : '0');
      
      // Add other optional fields
      if (shopData.minimum_order_amount !== undefined) 
        formData.append('minimum_order_amount', String(shopData.minimum_order_amount));
      
      if (shopData.free_delivery_status !== undefined) 
        formData.append('free_delivery_status', shopData.free_delivery_status ? '1' : '0');
      
      if (shopData.free_delivery_over_amount !== undefined) 
        formData.append('free_delivery_over_amount', String(shopData.free_delivery_over_amount));
      
      // Log the formData keys for debugging
      //console.log('Form data keys:', [...formData.entries()].map(entry => `${entry[0]}: ${entry[1]}`));
      
      // Add files if provided
      if (logoFile) formData.append('logo', logoFile);
      if (bannerFile) formData.append('banner', bannerFile);
      if (bottomBannerFile) formData.append('bottom_banner', bottomBannerFile);
      if (offerBannerFile) formData.append('offer_banner', offerBannerFile);

      // Use putForm instead of postForm
      return await apiService.postForm<ShopInfoResponse>(PROFILE_ENDPOINTS.SHOP_UPDATE, formData);
    } catch (error) {
      console.error('Error in updateShopInfo:', error);
      throw error;
    }
  },

  changeLanguage: async (currentLanguage: string): Promise<any> => {
    try {
      return await apiService.put(AUTH_ENDPOINTS.SET_LANGUAGE, {
        current_language: currentLanguage
      });
    } catch (error) {
      throw error;
    }
  },

  temporaryCloseShop: async (status: boolean): Promise<any> => {
    try {
      return await apiService.put(PROFILE_ENDPOINTS.TEMPORARY_CLOSE, {
        status: status
      });
    } catch (error) {
      throw error;
    }
  },

  setVacationMode: async (
    vacationStatus: boolean,
    startDate: string,
    endDate: string,
    note: string
  ): Promise<any> => {
    try {
      return await apiService.put(PROFILE_ENDPOINTS.VACATION, {
        vacation_status: vacationStatus,
        vacation_start_date: startDate,
        vacation_end_date: endDate,
        vacation_note: note
      });
    } catch (error) {
      throw error;
    }
  },

  deleteUserAccount: async (): Promise<DeleteAccountResponse> => {
    try {
      return await apiService.delete<DeleteAccountResponse>(PROFILE_ENDPOINTS.DELETE_ACCOUNT);
    } catch (error) {
      throw error;
    }
  },

  getMonthlyOrders: async (): Promise<MonthlyOrdersResponse> => {
    try {
      const response = await apiService.get<MonthlyOrdersResponse>('/api/v3/seller/monthly-orders');
      //console.log('Monthly orders API response:', response);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getEarningStatistics: async (type: string): Promise<EarningStatisticsResponse> => {
    try {
      return await apiService.get<EarningStatisticsResponse>(`/api/v3/seller/get-earning-statitics?type=${type}`);
    } catch (error) {
      throw error;
    }
  },

  getRecentOrders: async (): Promise<any> => {
    try {
      return await apiService.get<any>('/api/v3/seller/orders/list?offset=1&status=all&limit=10');
    } catch (error) {
      throw error;
    }
  }
};

export { vendorService };
