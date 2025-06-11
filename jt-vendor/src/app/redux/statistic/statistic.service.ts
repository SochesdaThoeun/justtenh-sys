import { 
  SalesChartParams, 
  SalesChartResponse, 
  CustomerOrdersParams, 
  CustomerOrdersResponse,
  OrdersPerDayParams,
  OrdersPerDayResponse,
  ShippingCostParams,
  ShippingCostResponse,
  ReturnOrdersParams,
  ReturnOrdersResponse,
  ProductPerformanceParams,
  ProductPerformanceResponse
} from './statistic.models';
import { STATISTICS_ENDPOINTS } from '@/app/constants/api.constants';
import apiService from '@/app/services/api.service';

// API service methods for statistics
const statisticService = {
  // Get sales chart data
  getSalesChart: async (params: SalesChartParams): Promise<SalesChartResponse> => {
    try {
      //console.log('🔍 getSalesChart - Input params:', params);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (params.months && params.months.length) {
        params.months.forEach(month => {
          queryParams.append('months[]', month.toString());
        });
      }
      
      if (params.year) {
        queryParams.append('year', params.year.toString());
      }
      
      if (params.type) {
        queryParams.append('type', params.type);
      }
      
      const url = `${STATISTICS_ENDPOINTS.SALES_CHART}?${queryParams.toString()}`;
      //console.log(`🔍 getSalesChart - API URL: ${url}`);
      
      const response = await apiService.get<SalesChartResponse>(url);
      //console.log('✅ getSalesChart - Response:', response);
      return response;
    } catch (error) {
      console.error('❌ getSalesChart - Error:', error);
      throw error;
    }
  },

  // Get customer orders list
  getCustomerOrders: async (params: CustomerOrdersParams): Promise<CustomerOrdersResponse> => {
    try {
      //console.log('🔍 getCustomerOrders - Input params:', params);
      
      const queryParams = new URLSearchParams();
      
      if (params.customer_id) {
        queryParams.append('customer_id', params.customer_id.toString());
      }
      
      if (params.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      
      if (params.offset) {
        queryParams.append('offset', params.offset.toString());
      }
      
      const url = `${STATISTICS_ENDPOINTS.CUSTOMER_ORDERS}?${queryParams.toString()}`;
      //console.log(`🔍 getCustomerOrders - API URL: ${url}`);
      
      const response = await apiService.get<CustomerOrdersResponse>(url);
      //console.log('✅ getCustomerOrders - Response:', response);
      return response;
    } catch (error) {
      console.error('❌ getCustomerOrders - Error:', error);
      throw error;
    }
  },

  // Get orders per day
  getOrdersPerDay: async (params: OrdersPerDayParams): Promise<OrdersPerDayResponse> => {
    try {
      //console.log('🔍 getOrdersPerDay - Input params:', params);
      
      const queryParams = new URLSearchParams();
      
      // Required parameters
      queryParams.append('from_date', params.from_date);
      queryParams.append('to_date', params.to_date);
      
      if (params.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      
      if (params.offset) {
        queryParams.append('offset', params.offset.toString());
      }
      
      const url = `${STATISTICS_ENDPOINTS.ORDERS_PER_DAY}?${queryParams.toString()}`;
      //console.log(`🔍 getOrdersPerDay - API URL: ${url}`);
      
      const response = await apiService.get<OrdersPerDayResponse>(url);
      //console.log('✅ getOrdersPerDay - Response:', response);
      return response;
    } catch (error) {
      console.error('❌ getOrdersPerDay - Error:', error);
      throw error;
    }
  },

  // Get shipping cost by method
  getShippingCost: async (params: ShippingCostParams): Promise<ShippingCostResponse> => {
    try {
      //console.log('🔍 getShippingCost - Input params:', params);
      
      const queryParams = new URLSearchParams();
      
      if (params.shipping_method_id) {
        queryParams.append('shipping_method_id', params.shipping_method_id);
      }
      
      if (params.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      
      if (params.offset) {
        queryParams.append('offset', params.offset.toString());
      }
      
      const url = `${STATISTICS_ENDPOINTS.SHIPPING_COST}?${queryParams.toString()}`;
      //console.log(`🔍 getShippingCost - API URL: ${url}`);
      
      const response = await apiService.get<ShippingCostResponse>(url);
      //console.log('✅ getShippingCost - Response:', response);
      return response;
    } catch (error) {
      console.error('❌ getShippingCost - Error:', error);
      throw error;
    }
  },

  // Get return orders per day
  getReturnOrders: async (params: ReturnOrdersParams): Promise<ReturnOrdersResponse> => {
    try {
      //console.log('🔍 getReturnOrders - Input params:', params);
      
      const queryParams = new URLSearchParams();
      
      // Required parameters
      queryParams.append('from_date', params.from_date);
      queryParams.append('to_date', params.to_date);
      
      if (params.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      
      if (params.offset) {
        queryParams.append('offset', params.offset.toString());
      }
      
      const url = `${STATISTICS_ENDPOINTS.RETURN_ORDERS}?${queryParams.toString()}`;
      //console.log(`🔍 getReturnOrders - API URL: ${url}`);
      
      const response = await apiService.get<ReturnOrdersResponse>(url);
      //console.log('✅ getReturnOrders - Response:', response);
      return response;
    } catch (error) {
      console.error('❌ getReturnOrders - Error:', error);
      throw error;
    }
  },

  // Get product performance
  getProductPerformance: async (params: ProductPerformanceParams): Promise<ProductPerformanceResponse> => {
    try {
      //console.log('🔍 getProductPerformance - Input params:', params);
      
      const queryParams = new URLSearchParams();
      
      if (params.sort_by) {
        queryParams.append('sort_by', params.sort_by);
      }
      
      if (params.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      
      if (params.offset) {
        queryParams.append('offset', params.offset.toString());
      }
      
      const url = `${STATISTICS_ENDPOINTS.PRODUCT_PERFORMANCE}?${queryParams.toString()}`;
      //console.log(`🔍 getProductPerformance - API URL: ${url}`);
      
      const response = await apiService.get<ProductPerformanceResponse>(url);
      //console.log('✅ getProductPerformance - Response:', response);
      return response;
    } catch (error) {
      console.error('❌ getProductPerformance - Error:', error);
      throw error;
    }
  }
};

export { statisticService };
