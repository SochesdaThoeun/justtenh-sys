import { ORDER_ENDPOINTS, POS_ENDPOINTS } from '@/app/constants/api.constants';
import { 
  CustomerResponse, 
  ProductResponse, 
  CouponResponse, 
  OrderResponse,
  OrderRequestPayload,
  CartItem
} from './orderCreation.models';
import { getMostPopularProductList, getSearchedPosProductList, getPosProductList } from '../product/product.service';
import apiService from '@/app/services/api.service';

// Fetch customers for order creation
export const fetchCustomersService = async (
  page: number = 1,
  search: string = '',
  limit: number = 10
): Promise<CustomerResponse> => {
  ////console.log('Fetching customers with params:', { page, search, limit });
  const offset = (page - 1) * limit;
  const response = await apiService.get<CustomerResponse>(
    `${POS_ENDPOINTS.CUSTOMERS}?offset=${offset}&limit=${limit}&name=${search}`
  );
  ////console.log('Customers response:', response);
  return response;
};

// Fetch products for order creation
export const fetchProductsService = async (
  page: number = 1,
  search: string = '',
  limit: number = 5,
  category_id: string | null = null
): Promise<ProductResponse> => {
  ////console.log('Fetching products with params:', { page, search, limit, category_id });
  const offset = (page - 1) * limit;
  
  let response;
  const categoryIds = category_id ? parseInt(category_id) : 0;
  response = await getSearchedPosProductList(search, categoryIds);
  
  //console.log('Products response:', response);
  return response as ProductResponse;
};

// Validate coupon for order
export const validateCouponService = async (
  coupon_code: string,
  customer_id: number,
  order_amount: number
): Promise<CouponResponse> => {
  ////console.log('Validating coupon with params:', { coupon_code, customer_id, order_amount });
  const response = await apiService.post<CouponResponse>(POS_ENDPOINTS.COUPON_DISCOUNT, {
    coupon_code,
    customer_id,
    order_amount
  });
  ////console.log('Coupon validation response:', response);
  return response;
};

// Place order with all details
export const placeOrderService = async (orderData: OrderRequestPayload): Promise<OrderResponse> => {
  //console.log('orderCreationService - Placing order with data:', orderData);
  
  // Ensure tax and discount values are calculated properly
  const processedOrderData = {
    ...orderData,
    discount_type: orderData.discount_type === 'percent' ? 'percent' : 'amount',
    extra_discount_type: orderData.extra_discount_type === 'percent' ? 'percent' : 'amount'
  };
  
  try {
    const response = await apiService.post<OrderResponse>(ORDER_ENDPOINTS.PLACE_ORDER, processedOrderData);
    //console.log('orderCreationService - Order placement response:', response);
    return response;
  } catch (error) {
    console.error('orderCreationService - Order placement error:', error);
    throw error;
  }
};

// Update existing order
export const updateOrderService = async (orderId: string, orderData: OrderRequestPayload): Promise<OrderResponse> => {
  ////console.log('Updating order with data:', orderData);
  
  // Ensure tax and discount values are calculated properly
  const processedOrderData = {
    ...orderData,
    discount_type: orderData.discount_type === 'percent' ? 'percent' : 'amount',
    extra_discount_type: orderData.extra_discount_type === 'percent' ? 'percent' : 'amount',
    order_id: orderId
  };
  
  const response = await apiService.post<OrderResponse>(ORDER_ENDPOINTS.EDIT_ORDER, processedOrderData);
  ////console.log('Order update response:', response);
  return response;
};

// Helper functions for calculations
export const calculateItemTotal = (
  price: number,
  quantity: number,
  discount: number,
  discount_type: string,
  tax: number,
  tax_model: string
): number => {
  const basePrice = price * quantity;
  
  // Calculate discount - only 'percent' or 'amount' are allowed
  let discountAmount = 0;
  if (discount_type === 'percent') {
    discountAmount = basePrice * (discount / 100);
  } else { // default to 'amount'
    discountAmount = discount * quantity;
  }
  
  // Calculate tax
  let taxAmount = 0;
  if (tax_model === 'include') {
    taxAmount = basePrice - (basePrice / (1 + tax / 100));
  } else {
    taxAmount = basePrice * (tax / 100);
  }
  
  return basePrice + (tax_model === 'exclude' ? taxAmount : 0) - discountAmount;
};

// Calculate cart totals with proper tax and discount handling
export const calculateCartTotals = (cartItems: CartItem[]) => {
  let subtotal = 0;
  let totalDiscount = 0;
  let totalTax = 0;
  
  cartItems.forEach(item => {
    // Calculate base price
    const basePrice = item.price * item.quantity;
    subtotal += basePrice;
    
    // Calculate item discount
    if (item.discount_type === 'percent') {
      totalDiscount += basePrice * (item.discount / 100);
    } else { // 'amount'
      totalDiscount += item.discount * item.quantity;
    }
    
    // Calculate item tax
    if (item.tax_model === 'include') {
      totalTax += basePrice - (basePrice / (1 + item.tax / 100));
    } else { // 'exclude'
      totalTax += basePrice * (item.tax / 100);
    }
  });
  
  return { subtotal, totalDiscount, totalTax };
}; 