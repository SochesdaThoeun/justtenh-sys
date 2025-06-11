import axios from 'axios';
import { MAP_ENDPOINTS, BASE_URL } from '@/app/constants/api.constants';
import { OrderModel } from '../models';
import { 
  fetchOrderListService, 
  setDeliveryChargeService, 
  assignThirdPartyDeliveryManService,
  orderAddressEditService
} from './orderService';

export interface LatLng {
  lat: number;
  lng: number;
}

export const getAddressFromGeocodeService = async (latLng: LatLng): Promise<string> => {
  try {
    const response = await axios.get(`${MAP_ENDPOINTS.GEOCODE}?lat=${latLng.lat}&lng=${latLng.lng}`);
    if (response.status === 200 && response.data.status === 'OK') {
      return response.data.results[0].formatted_address;
    }
    return '';
  } catch (error) {
    console.error('Error in getAddressFromGeocodeService:', error);
    return '';
  }
};

export const searchLocationService = async (text: string): Promise<any[]> => {
  try {
    const response = await axios.get(`${MAP_ENDPOINTS.SEARCH_LOCATION}?search_text=${text}`);
    if (response.status === 200 && response.data.status === 'OK') {
      return response.data.predictions;
    }
    return [];
  } catch (error) {
    console.error('Error in searchLocationService:', error);
    return [];
  }
};

export const getPlaceDetailsService = async (placeID: string): Promise<any | null> => {
  try {
    const response = await axios.get(`${MAP_ENDPOINTS.PLACE_DETAILS}?placeid=${placeID}`);
    if (response.status === 200 && response.data.status === 'OK') {
      return response.data.result;
    }
    return null;
  } catch (error) {
    console.error('Error in getPlaceDetailsService:', error);
    return null;
  }
};

// Controller functions moved from location.controller.ts
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
