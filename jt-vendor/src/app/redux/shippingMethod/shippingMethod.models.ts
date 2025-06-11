/**
 * Shipping Method model
 */
export interface ShippingMethod {
  id: number;
  creator_id: number;
  creator_type: string;
  title: string;
  cost: number;
  duration: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Shipping Method request for creating or updating
 */
export interface ShippingMethodRequest {
  title: string;
  duration: string;
  cost: number;
}

/**
 * Status update request
 */
export interface ShippingMethodStatusUpdateRequest {
  id: number;
  status: 0 | 1;
}

/**
 * API response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * Shipping Method state
 */
export interface ShippingMethodState {
  shippingMethods: ShippingMethod[];
  selectedShippingMethod: ShippingMethod | null;
  loading: boolean;
  error: string | null;
  updateSuccess: boolean;
} 