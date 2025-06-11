// controllers/orderDetailsController.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { OrderDetailsModel } from '../models';
import { BASE_URL, ORDER_ENDPOINTS } from '@/app/constants/api.constants';

// Extended model type to include tax and tax_model
interface ExtendedOrderDetailsModel extends OrderDetailsModel {
  details?: Array<{
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    tax?: number;
    tax_model?: string; // 'include' or 'exclude'
    [key: string]: any;
  }>;
}

export const fetchOrderDetails = async (orderID: string): Promise<ExtendedOrderDetailsModel[]> => {
  const response = await axios.get(`${BASE_URL}${ORDER_ENDPOINTS.DETAILS}${orderID}`);
  ////console.log('response.data', response.data);
  
  // Process the response to ensure tax and tax_model are included
  if (response.data && Array.isArray(response.data)) {
    return response.data.map((order: any) => {
      if (order.details && Array.isArray(order.details)) {
        return {
          ...order,
          details: order.details.map((item: any) => ({
            ...item,
            tax: item.tax || 0,
            tax_model: item.tax_model || 'exclude' // Default to exclude if not provided
          }))
        };
      }
      return order;
    });
  }
  
  return response.data;
};

export const updateOrderStatus = async (orderID: number, status: string): Promise<any> => {
  const response = await axios.post(`${BASE_URL}${ORDER_ENDPOINTS.UPDATE_STATUS}${orderID}`, {
    _method: 'put',
    order_status: status,
  });
  return response.data;
};

export const getOrderStatusList = async (type: string): Promise<string[]> => {
  // Adjust the status list based on type if needed.
  if (type === 'inhouse_shipping') {
    return ['pending', 'confirmed', 'processing'];
  }
  return ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'returned', 'failed', 'canceled'];
};

export const updatePaymentStatus = async (
  orderId: number,
  status: string
): Promise<any> => {
  try {
    const response = await axios.post(`${BASE_URL}${ORDER_ENDPOINTS.UPDATE_PAYMENT_STATUS}`, {
      order_id: orderId,
      payment_status: status
    });
    return response.data;
  } catch (error) {
    console.error('Error in updatePaymentStatus:', error);
    throw error;
  }
};

export const assignThirdPartyDelivery = async (
  orderId: number,
  deliveryServiceName: string,
  trackingId?: string
): Promise<any> => {
  try {
    const data = {
      order_id: orderId,
      delivery_service_name: deliveryServiceName,
      third_party_delivery_tracking_id: trackingId || ''
    };
    
    const response = await axios.post(`${BASE_URL}${ORDER_ENDPOINTS.THIRD_PARTY_DELIVERY}`, data);
    return response.data;
  } catch (error) {
    console.error('Error in assignThirdPartyDelivery:', error);
    throw error;
  }
};

export const uploadAfterSellDigitalProduct = async (
  file: File,
  token: string,
  orderId: string
): Promise<any> => {
  const formData = new FormData();
  formData.append('digital_file_after_sell', file);
  formData.append('order_id', orderId);
  formData.append('_method', 'put');

  const response = await axios.post(`${BASE_URL}${ORDER_ENDPOINTS.DIGITAL_PRODUCT_UPLOAD}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const productDownload = async (url: string): Promise<Blob> => {
  const response = await axios.get(url, { responseType: 'blob' });
  return response.data;
};
