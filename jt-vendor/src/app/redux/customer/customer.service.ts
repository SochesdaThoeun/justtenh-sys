import { CUSTOMER_ENDPOINTS } from '@/app/constants/api.constants';
import apiService from '@/app/services/api.service';
import { CustomersResponse, CustomerModel, AddCustomerParams, CustomerOrdersResponse } from './customer.models';

export const customerService = {
  fetchCustomers: async (offset: number, limit: number, searchValue?: string): Promise<CustomersResponse> => {
    let url = `${CUSTOMER_ENDPOINTS.LIST}?limit=${limit}&offset=${offset}`;
    
    // Add search parameter if provided
    if (searchValue && searchValue.trim() !== '') {
      url += `&search=${encodeURIComponent(searchValue.trim())}`;
    }
    
    return await apiService.get<CustomersResponse>(url);
  },
  
  searchCustomers: async (offset: number, limit: number, searchValue: string): Promise<CustomersResponse> => {
    return await apiService.get<CustomersResponse>(
      `${CUSTOMER_ENDPOINTS.LIST}?limit=${limit}&offset=${offset}&search=${encodeURIComponent(searchValue)}`
    );
  },

  addCustomer: async (customerData: AddCustomerParams): Promise<CustomerModel> => {
    return await apiService.post<CustomerModel>(CUSTOMER_ENDPOINTS.ADD_CUSTOMER, customerData);
  },

  getCustomerDetails: async (customerId: string | number): Promise<{ customer: CustomerModel }> => {
    return await apiService.get<{ customer: CustomerModel }>(`${CUSTOMER_ENDPOINTS.DETAILS}/${customerId}`);
  },

  getCustomerOrders: async (
    customerId: string | number, 
    limit: number = 10, 
    offset: number = 1
  ): Promise<CustomerOrdersResponse> => {
    return await apiService.get<CustomerOrdersResponse>(
      `${CUSTOMER_ENDPOINTS.CUSTOMER_ORDERS}/${customerId}/orders?limit=${limit}&offset=${offset}`
    );
  }
};
