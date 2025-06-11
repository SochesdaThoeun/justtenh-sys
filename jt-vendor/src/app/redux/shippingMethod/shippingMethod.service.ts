import apiService from '../../services/api.service';
import { SHIPPING_ENDPOINTS } from '../../constants/api.constants';
import { 
  ShippingMethod, 
  ShippingMethodRequest,
  ShippingMethodStatusUpdateRequest, 
  ApiResponse 
} from './shippingMethod.models';

/**
 * Shipping Method Service
 * Contains all API calls for shipping methods
 */
const shippingMethodService = {
  /**
   * Get all shipping methods
   */
  getShippingMethods: async (): Promise<ShippingMethod[]> => {
    try {
      const response = await apiService.get<ShippingMethod[]>(SHIPPING_ENDPOINTS.LIST);
      return response || [];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch shipping methods');
    }
  },

  /**
   * Add a new shipping method
   */
  addShippingMethod: async (data: ShippingMethodRequest): Promise<ApiResponse<ShippingMethod>> => {
    try {
      const response = await apiService.post<ApiResponse<ShippingMethod>>(SHIPPING_ENDPOINTS.ADD, data);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add shipping method');
    }
  },

  /**
   * Get a specific shipping method
   */
  getShippingMethod: async (id: number): Promise<ShippingMethod> => {
    try {
      const endpoint = `${SHIPPING_ENDPOINTS.EDIT}${id}`;
      const response = await apiService.get<ApiResponse<ShippingMethod>>(endpoint);
      return response.data as ShippingMethod;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch shipping method');
    }
  },

  /**
   * Update an existing shipping method
   */
  updateShippingMethod: async (id: number, data: ShippingMethodRequest): Promise<ApiResponse<ShippingMethod>> => {
    try {
      const endpoint = `${SHIPPING_ENDPOINTS.UPDATE}/${id}`;
      const response = await apiService.put<ApiResponse<ShippingMethod>>(endpoint, data);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update shipping method');
    }
  },

  /**
   * Update shipping method status
   */
  updateShippingMethodStatus: async (data: ShippingMethodStatusUpdateRequest): Promise<ApiResponse<null>> => {
    try {
      const response = await apiService.put<ApiResponse<null>>(SHIPPING_ENDPOINTS.STATUS_UPDATE, data);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update shipping method status');
    }
  },

  /**
   * Delete a shipping method
   */
  deleteShippingMethod: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const endpoint = `${SHIPPING_ENDPOINTS.DELETE}/${id}`;
      const response = await apiService.delete<ApiResponse<null>>(endpoint);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete shipping method');
    }
  }
};

export default shippingMethodService; 