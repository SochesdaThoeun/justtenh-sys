// API Constants for the application

// Base URL
export const BASE_URL = 'https://justtenh.com'; 

// Product image URL
export const PRODUCT_IMAGE_URL = `${BASE_URL}/storage/product/`;
export const PRODUCT_THUMBNAIL_URL = `${BASE_URL}/storage/product/thumbnail/`;
// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/v3/seller/auth/login',
  REGISTRATION: '/api/v3/seller/registration',
  FORGOT_PASSWORD: '/api/v3/seller/auth/forgot-password',
  VERIFY_OTP: '/api/v3/seller/auth/verify-otp',
  RESET_PASSWORD: '/api/v3/seller/auth/reset-password',
  TOKEN: '/api/v3/seller/cm-firebase-token',
  SET_LANGUAGE: '/api/v3/seller/language-change',
};

// Profile and Shop endpoints
export const PROFILE_ENDPOINTS = {
  SELLER_INFO: '/api/v3/seller/seller-info',
  UPDATE_PROFILE: '/api/v3/seller/seller-update',
  SHOP_INFO: '/api/v3/seller/shop-info',
  SHOP_UPDATE: '/api/v3/seller/shop-update',
  DELETE_ACCOUNT: '/api/v3/seller/account-delete',
  TEMPORARY_CLOSE: '/api/v3/seller/temporary-close',
  VACATION: '/api/v3/seller/vacation-add',
};

export const CUSTOMER_ENDPOINTS = {
  LIST: '/api/v3/seller/customers',
  ADD_CUSTOMER: '/api/v3/seller/customers/store',
  DETAILS: '/api/v3/seller/customers',  // Base URL for customer details
  CUSTOMER_ORDERS: '/api/v3/seller/customers',  // Base URL for customer orders
};

// Order endpoint
export const ORDER_ENDPOINTS = {
  LIST: '/api/v3/seller/orders/list',
  DETAILS: '/api/v3/seller/orders/',
  UPDATE_STATUS: '/api/v3/seller/orders/order-detail-status/',
  ASSIGN_DELIVERY_MAN: '/api/v3/seller/orders/assign-delivery-man',
  THIRD_PARTY_DELIVERY: '/api/v3/seller/orders/assign-third-party-delivery',
  UPDATE_PAYMENT_STATUS: '/api/v3/seller/orders/update-payment-status',
  ADDRESS_UPDATE: '/api/v3/seller/orders/address-update',
  DELIVERY_CHARGE_UPDATE: '/api/v3/seller/orders/delivery-charge-date-update',
  DIGITAL_PRODUCT_UPLOAD: '/api/v3/seller/orders/order-wise-product-upload',
  CUSTOMER: '/api/v3/seller/orders/customer',
  PLACE_ORDER: '/api/v3/seller/orders/place-order',
  EDIT_ORDER: '/api/v3/seller/orders/edit-order',
};

// Products endpoints
export const PRODUCT_ENDPOINTS = {
  LIST: '/api/v3/seller/products/list',
  STOCK_OUT: '/api/v3/seller/products/stock-out-list',
  ADD_PRODUCT: '/api/v3/seller/products/add',
  UPLOAD_IMAGES: '/api/v3/seller/products/upload-images',
  UPDATE_PRODUCT: '/api/v3/seller/products/update',
  DELETE_PRODUCT: '/api/v3/seller/products/delete',
  EDIT_PRODUCT: '/api/v3/seller/products/edit',
  PRODUCT_DETAILS: '/api/v3/seller/products/details/',
  STATUS_UPDATE: '/api/v3/seller/products/status-update',
  QUANTITY_UPDATE: '/api/v3/seller/products/quantity-update',
  REVIEWS: '/api/v3/seller/products/review-list/',
  BARCODE_GENERATE: '/api/v3/seller/products/barcode/generate',
  DIGITAL_UPLOAD: '/api/v3/seller/products/upload-digital-product',
  DELETE_DIGITAL_FILE: '/api/v3/seller/products/delete-digital-product',
  DELETE_IMAGE: '/api/v3/seller/products/delete-image',
  GET_IMAGES: '/api/v3/seller/products/get-product-images/',
  MOST_POPULAR: '/api/v3/seller/products/most-popular-product',
  TOP_SELLING: '/api/v3/seller/products/top-selling-product',
  DEFAULT_LANGUAGE: '/api/v3/seller/products/check-default-lang',

};

// Statistics endpoints
export const STATISTICS_ENDPOINTS = {
  SALES_CHART: '/api/v3/seller/statistics/sales-chart',
  CUSTOMER_ORDERS: '/api/v3/seller/statistics/customer-orders',
  ORDERS_PER_DAY: '/api/v3/seller/statistics/orders-per-day',
  SHIPPING_COST: '/api/v3/seller/statistics/shipping-cost',
  RETURN_ORDERS: '/api/v3/seller/statistics/return-orders',
  PRODUCT_PERFORMANCE: '/api/v3/seller/statistics/product-performance',
};

// POS endpoints
export const POS_ENDPOINTS = {
  PLACE_ORDER: '/api/v3/seller/pos/place-order',
  PRODUCTS: '/api/v3/seller/pos/products',
  CUSTOMERS: '/api/v3/seller/pos/customers',
  CATEGORIES: '/api/v3/seller/pos/get-categories',
  INVOICE: '/api/v3/seller/pos/get-invoice',
  PRODUCT_LIST: '/api/v3/seller/pos/product-list',
  SEARCH_PRODUCTS: '/api/v3/seller/pos/product-list',
  ADD_CUSTOMER: '/api/v3/seller/pos/customer-store',
  COUPON_DISCOUNT: '/api/v3/seller/coupon/check-coupon',
};

// Financial endpoints
export const FINANCIAL_ENDPOINTS = {
  BALANCE_WITHDRAW: '/api/v3/seller/balance-withdraw',
  CANCEL_WITHDRAW_REQUEST: '/api/v3/seller/close-withdraw-request',
  TRANSACTIONS: '/api/v3/seller/transactions',
  WITHDRAW_METHODS: '/api/v3/seller/withdraw-method-list',
  BUSINESS_ANALYTICS: '/api/v3/seller/order-statistics',
  CHART_DATA: '/api/v3/seller/get-earning-statitics',
};

// Messages and Chat endpoints
export const MESSAGE_ENDPOINTS = {
  LIST: '/api/v3/seller/messages/list/',
  SEARCH: '/api/v3/seller/messages/search/',
  GET_MESSAGE: '/api/v3/seller/messages/get-message/',
  SEND_MESSAGE: '/api/v3/seller/messages/send/',
};

// Coupon endpoints
export const COUPON_ENDPOINTS = {
  ADD: '/api/v3/seller/coupon/store',
  LIST: '/api/v3/seller/coupon/list',
  UPDATE: '/api/v3/seller/coupon/update/',
  DELETE: '/api/v3/seller/coupon/delete/',
  STATUS_UPDATE: '/api/v3/seller/coupon/status-update/',
  CUSTOMER_LIST: '/api/v3/seller/coupon/customers',
};

// Shipping endpoints
export const SHIPPING_ENDPOINTS = {
  ADD: '/api/v3/seller/shipping-method/add',
  UPDATE: '/api/v3/seller/shipping-method/update',
  EDIT: '/api/v3/seller/shipping-method/edit',
  DELETE: '/api/v3/seller/shipping-method/delete',
  LIST: '/api/v3/seller/shipping-method/list',
  STATUS_UPDATE: '/api/v3/seller/shipping-method/status',
  ALL_CATEGORY_COST: '/api/v3/seller/shipping/all-category-cost',
  SET_CATEGORY_COST: '/api/v3/seller/shipping/set-category-cost',
  SET_METHOD_TYPE: '/api/v3/seller/shipping/selected-shipping-method',
  GET_METHOD_TYPE: '/api/v3/seller/shipping/get-shipping-method',
};

// Delivery Man endpoints
export const DELIVERY_MAN_ENDPOINTS = {
  LIST: '/api/v3/seller/delivery-man/list',
  DETAILS: '/api/v3/seller/delivery-man/details/',
  ADD: '/api/v3/seller/delivery-man/store',
  UPDATE: '/api/v3/seller/delivery-man/update',
  DELETE: '/api/v3/seller/delivery-man/delete/',
  ORDER_LIST: '/api/v3/seller/delivery-man/order-list/',
  EARNING: '/api/v3/seller/delivery-man/earning/',
  CASH_RECEIVE: '/api/v3/seller/delivery-man/cash-receive',
  STATUS_UPDATE: '/api/v3/seller/delivery-man/status-update',
  ORDER_STATUS_HISTORY: '/api/v3/seller/delivery-man/order-status-history/',
  COLLECTED_CASH_LIST: '/api/v3/seller/delivery-man/collect-cash-list/',
  WITHDRAW_LIST: '/api/v3/seller/delivery-man/withdraw/list',
  WITHDRAW_DETAILS: '/api/v3/seller/delivery-man/withdraw/details/',
  WITHDRAW_STATUS_UPDATE: '/api/v3/seller/delivery-man/withdraw/status-update',
  REVIEWS: '/api/v3/seller/delivery-man/reviews/',
  TOP_DELIVERY_MAN: '/api/v3/seller/top-delivery-man',
  SELLER_DELIVERY_MAN: '/api/v3/seller/seller-delivery-man',
};

// Emergency Contact endpoints
export const EMERGENCY_CONTACT_ENDPOINTS = {
  ADD: '/api/v3/seller/delivery-man/emergency-contact/store',
  UPDATE: '/api/v3/seller/delivery-man/emergency-contact/update',
  LIST: '/api/v3/seller/delivery-man/emergency-contact/list',
  STATUS_UPDATE: '/api/v3/seller/delivery-man/emergency-contact/status-update',
  DELETE: '/api/v3/seller/delivery-man/emergency-contact/delete',
};

// Review endpoints
export const REVIEW_ENDPOINTS = {
  PRODUCT_REVIEWS: '/api/v3/seller/shop-product-reviews',
  REVIEW_STATUS_UPDATE: '/api/v3/seller/shop-product-reviews-status',
  REPLY: '/api/v3/seller/shop-product-reviews-reply',
};

// Notification endpoints
export const NOTIFICATION_ENDPOINTS = {
  LIST: '/api/v3/seller/notification',
  VIEW: '/api/v3/seller/notification/view',
};

// Refund endpoints
export const REFUND_ENDPOINTS = {
  LIST: '/api/v3/seller/refund/list',
  DETAILS: '/api/v3/seller/refund/refund-details',
  STATUS_UPDATE: '/api/v3/seller/refund/refund-status-update',
};

// Config and Data endpoints
export const CONFIG_ENDPOINTS = {
  CONFIG: '/api/v1/config',
  ATTRIBUTES: '/api/v1/attributes',
  BRANDS: '/api/v3/seller/brands',
  CATEGORIES: '/api/v3/seller/categories',
  SUB_CATEGORIES: '/api/v1/categories/childes/',
  SUB_SUB_CATEGORIES: '/api/v1/categories/childes/childes/',
};

// Map endpoints
export const MAP_ENDPOINTS = {
  GEOCODE: '/api/v1/mapapi/geocode-api',
  SEARCH_LOCATION: '/api/v1/mapapi/place-api-autocomplete',
  PLACE_DETAILS: '/api/v1/mapapi/place-api-details',
};

// Status constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  PROCESSED: 'processed',
  DELIVERED: 'delivered',
  FAILED: 'failed',
  RETURNED: 'returned',
  CANCELLED: 'canceled',
  OUT_FOR_DELIVERY: 'out_for_delivery',
};

export const REQUEST_STATUS = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
  DONE: 'refunded',
};

// Other constants
export const SHIPPING_TYPE = {
  ORDER_WISE: 'order_wise',
  PRODUCT_WISE: 'product_wise',
  CATEGORY_WISE: 'category_wise',
};

export const APP_INFO = {
  NAME: 'JustTenh Vendor',
  VERSION: '14.7',
  COMPANY: 'Justtenh',
};
