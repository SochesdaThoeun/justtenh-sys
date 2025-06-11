// Models for order creation feature

import { Customer, Product, BillingAddressData, ShippingAddressData } from '../models';

// Cart related interfaces
export interface CartItem {
  id: number;
  variant_id?: number;  // Add the variant_id property
  name: string;
  price: number;
  quantity: number;
  tax: number;
  tax_model: string; // 'include' or 'exclude'
  discount: number;
  discount_type: string; // Only 'amount' or 'percent' allowed
  subtotal: number;
  image?: string;
  variant?: string;
  variation?: any; // Support for multiple variation types
  stock: number;
  sku: string;
}

// API Response Types
export interface CustomerResponse {
  customers: Customer[];
  total_size: number;
}

export interface ProductResponse {
  products: Product[];
  total_size: number;
}

export interface CouponResponse {
  discount: number;
  discount_type: string; // 'amount' or 'percent'
}

export interface OrderResponse {
  order_id: number;
}

// Main state interface
export interface OrderCreationState {
  // Customers
  customers: Customer[];
  customersLoading: boolean;
  customersError: string | null;
  totalCustomers: number;
  customerPage: number;
  customerSearch: string;
  selectedCustomer: Customer | null;
  isGuestCheckout: boolean;

  // Products
  products: Product[];
  productsLoading: boolean;
  productsError: string | null;
  totalProducts: number; 
  productPage: number;
  productsPerPage: number;
  productSearch: string;
  selectedCategoryId: string | null;

  // Cart
  cartItems: CartItem[];
  
  // Order Details
  orderDate: string;
  orderNote: string;
  paymentMethod: string;
  shippingMethod: string;
  deliveryType: string;
  deliveryServiceName: string;
  thirdPartyTrackingId: string;
  orderStatus: string;
  paymentStatus: string;
  couponCode: string;
  couponDiscount: number;
  couponDiscountType: string; // Only 'amount' or 'percent' allowed
  extraDiscount: number;
  extraDiscountType: string; // Only 'amount' or 'percent' allowed
  shippingCost: number;
  
  // Addresses
  billingAddress: BillingAddressData | null;
  shippingAddress: ShippingAddressData | null;
  sameAsBilling: boolean;

  // Order submission
  orderSubmitting: boolean;
  orderSubmitError: string | null;
  orderSubmitSuccess: boolean;
  createdOrderId: number | null;
}

// Order request payload interface
export interface OrderRequestPayload {
  cart: {
    id: number;
    variant_id?: number;  // Add variant_id to cart items
    quantity: number;
    price: number;
    discount: number;
    tax: number;
    variant?: string;
    variation?: any; // Support for multiple variation types
  }[];
  customer_id?: number;
  order_amount: number;
  order_date: string;
  payment_method: string;
  order_status: string;
  payment_status?: string;
  shipping_method_id: string;
  shipping_cost: number;
  discount_amount: number;
  discount_type: string; // Only 'amount' or 'percent' allowed
  coupon_code: string;
  extra_discount: number;
  extra_discount_type: string; // Only 'amount' or 'percent' allowed
  order_type: string;
  delivery_type: string;
  order_note: string;
  tax: number;
  tax_model: string; // 'include' or 'exclude'
  billing_address: BillingAddressData;
  shipping_address: BillingAddressData | ShippingAddressData;
} 