import { OrderModel } from '../models';
import { 
  fetchOrderListService, 
  setDeliveryChargeService, 
  assignThirdPartyDeliveryManService,
  orderAddressEditService,
  fetchOrderCustomerService
} from './orderService';
import apiService from '@/app/services/api.service';
import axios from 'axios';
import { BASE_URL, ORDER_ENDPOINTS } from '@/app/constants/api.constants';

export const getOrderList = async (
  offset: number,
  status: string | string[],
  searchvalue: string,
  from_date: string | null,
  to_date: string | null,
  customer_id: string
): Promise<OrderModel | null> => {
  //console.log('fetchOrderListService params:', offset, status, searchvalue, from_date, to_date, customer_id);
  
  // If status is an empty string, don't pass it to the service
  if (status === '') {
    return await fetchOrderListService(offset, [], searchvalue, from_date, to_date, customer_id);
  }
  
  return await fetchOrderListService(offset, status, searchvalue, from_date, to_date, customer_id);
};

export const setDeliveryCharge = async (
  orderId: number,
  deliveryCharge: string,
  expectedDeliveryDate: string
): Promise<any> => {
  // Business logic can be added here if needed
  return await setDeliveryChargeService(orderId, deliveryCharge, expectedDeliveryDate);
};

export const assignThirdPartyDeliveryMan = async (
  name: string,
  trackingId: string,
  orderId: number
): Promise<any> => {
  return await assignThirdPartyDeliveryManService(name, trackingId, orderId);
};

export const orderAddressEdit = async (params: {
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
  return await orderAddressEditService(params);
};

export const getOrderCustomer = async (): Promise<{ customers: OrderModel['customers'] } | null> => {
  return await fetchOrderCustomerService();
};
