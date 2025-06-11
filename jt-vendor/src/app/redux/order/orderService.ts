import { OrderModel } from '../models'
import { BASE_URL, ORDER_ENDPOINTS, POS_ENDPOINTS } from '@/app/constants/api.constants';
import apiService from '@/app/services/api.service'; // replaced axios import

export const fetchOrderListService = async (
  offset: number,
  status: string | string[],
  searchvalue: string,
  from_date: string | null,
  to_date: string | null,
  customer_id: string
): Promise<OrderModel | null> => {
  try {
    const params = new URLSearchParams();
    params.append('limit', '10');
    params.append('offset', offset.toString());
    
    // Handle status only if it's not empty
    if (Array.isArray(status) && status.length > 0) {
      // If status is an array, append each status value
      status.forEach(statusItem => {
        if (statusItem && statusItem !== 'all') {
          params.append('status[]', statusItem);
        }
      });
      //console.log('Added status filters:', status);
    } else if (typeof status === 'string' && status && status !== 'all') {
      // Handle single status (only if not 'all' and not empty)
      params.append('status', status);
    }
    
    // Only add non-empty search parameters
    if (searchvalue && searchvalue.trim() !== '') {
      params.append('searchValue', searchvalue);
      //console.log('Added search filter:', searchvalue);
    }
    
    if (from_date && from_date.trim() !== '') {
      params.append('from_date', from_date);
      //console.log('Added from_date filter:', from_date);
    }
    
    if (to_date && to_date.trim() !== '') {
      params.append('to_date', to_date);
      //console.log('Added to_date filter:', to_date);
    }
    
    if (customer_id && customer_id.trim() !== '') {
      params.append('customer_id', customer_id);
      //console.log('Added customer_id filter:', customer_id);
    }
    
    const url = `${ORDER_ENDPOINTS.LIST}?${params.toString()}`;
    //console.log('Fetching orders with URL:', url);
    const response = await apiService.get<OrderModel>(url);
    //console.log('fetchOrderListService response:', response);
    return response;
  } catch (error) {
    console.error('Error in fetchOrderListService:', error);
    return null;
  }
};

export const setDeliveryChargeService = async (
  orderId: number,
  deliveryCharge: string,
  expectedDeliveryDate: string
): Promise<any> => {
  try {
    // Updated to use apiService.post
    return await apiService.post(ORDER_ENDPOINTS.DELIVERY_CHARGE_UPDATE, {
      order_id: orderId,
      _method: 'put',
      deliveryman_charge: deliveryCharge,
      expected_delivery_date: expectedDeliveryDate,
    });
  } catch (error) {
    console.error('Error in setDeliveryChargeService:', error);
    return null;
  }
};

export const assignThirdPartyDeliveryManService = async (
  name: string,
  trackingId: string,
  orderId: number
): Promise<any> => {
  try {
    // Updated to use apiService.post
    return await apiService.post(ORDER_ENDPOINTS.THIRD_PARTY_DELIVERY, {
      delivery_service_name: name,
      third_party_delivery_tracking_id: trackingId,
      order_id: orderId,
    });
  } catch (error) {
    console.error('Error in assignThirdPartyDeliveryManService:', error);
    return null;
  }
};

export const orderAddressEditService = async (params: {
  orderID: string;
  addressType: string;
  contactPersonName: string;
  phone: string;
  city: string;
  zip: string;
  address: string;
  email: string;
  latitude: string;
  longitude: string;
}): Promise<any> => {
  try {
    // Updated to use apiService.post
    return await apiService.post(ORDER_ENDPOINTS.ADDRESS_UPDATE, params);
  } catch (error) {
    console.error('Error in orderAddressEditService:', error);
    return null;
  }
};

export const fetchOrderCustomerService = async (): Promise<{ customers: OrderModel['customers'] } | null> => {
  try {
    const response = await apiService.get<{ customers: OrderModel['customers'] }>(`${POS_ENDPOINTS.CUSTOMERS}?name=&type=`);
    //console.log('fetchOrderCustomerService response:', response);
    return response;
  } catch (error) {
    console.error('Error in fetchOrderCustomerService:', error);
    return null;
  }
};
