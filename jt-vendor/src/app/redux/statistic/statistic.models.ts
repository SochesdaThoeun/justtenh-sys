// Define models for statistics data

// Sales Chart Data
export interface SalesChartParams {
  months?: number[];
  year?: number;
  type?: 'sales' | 'customers' | 'orders' | 'products';
}

export interface SalesChartResponse {
  months: number[];
  month_names: string[];
  data: number[];
}

// Customer Orders List
export interface CustomerOrdersParams {
  customer_id?: number;
  limit?: number;
  offset?: number;
}

export interface CustomerOrderStats {
  customer_name: string;
  email: string;
  phone: string;
  status: string;
  date_joined: string;
  no_orders: number;
  no_products: number;
  total: number;
}

export interface CustomerOrdersResponse {
  total_size: number;
  limit: number;
  offset: number;
  customers: CustomerOrderStats[];
}

// Orders Per Day
export interface OrdersPerDayParams {
  from_date: string;
  to_date: string;
  limit?: number;
  offset?: number;
}

export interface OrdersPerDayStats {
  date: string;
  no_orders: number;
  products_sold: number;
  tax: number;
  total: number;
}

export interface OrdersPerDayResponse {
  total_size: number;
  limit: number;
  offset: number;
  orders: OrdersPerDayStats[];
}

// Shipping Cost By Method
export interface ShippingCostParams {
  shipping_method_id?: string;
  limit?: number;
  offset?: number;
}

export interface ShippingCostStats {
  date: string;
  shipping_type: string;
  shipping_id: string;
  status: string;
  no_orders: number;
  total: number;
}

export interface ShippingCostResponse {
  total_size: number;
  limit: number;
  offset: number;
  shipping: ShippingCostStats[];
}

// Return Orders
export interface ReturnOrdersParams {
  from_date: string;
  to_date: string;
  limit?: number;
  offset?: number;
}

export interface ReturnOrderStats {
  date: string;
  orders_returned: number;
  orders_refunded: number;
  orders_replaced: number;
  total_refunded: number;
  total_replaced: number;
}

export interface ReturnOrdersResponse {
  total_size: number;
  limit: number;
  offset: number;
  returns: ReturnOrderStats[];
}

// Product Performance
export interface ProductPerformanceParams {
  sort_by?: 'most_sold' | 'highest_rating' | 'most_revenue';
  limit?: number;
  offset?: number;
}

export interface ProductPerformanceStats {
  id: number;
  name: string;
  image: string;
  thumbnail_full_url?: {
    path: string;
    url: string;
  };
  rating: number;
  rating_count: number;
  times_sold: number;
  total_revenue: number;
  price: number;
}

export interface ProductPerformanceResponse {
  total_size: number;
  limit: number;
  offset: number;
  products: ProductPerformanceStats[];
}

// State interfaces for Redux
export interface StatisticState {
  salesChart: SalesChartResponse | null;
  customerOrders: CustomerOrdersResponse | null;
  ordersPerDay: OrdersPerDayResponse | null;
  shippingCost: ShippingCostResponse | null;
  returnOrders: ReturnOrdersResponse | null;
  productPerformance: ProductPerformanceResponse | null;
  isLoading: boolean;
  error: string | null | any[];
}
