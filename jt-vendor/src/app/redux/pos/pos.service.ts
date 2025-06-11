import apiService from '@/app/services/api.service';
import { PosResponse, PosProductsResponse } from './pos.models';
import { POS_ENDPOINTS } from '../../constants/api.constants';

// POS service functions
const posService = {
  getCategories: async () => {
    const response = await apiService.get<PosResponse>(POS_ENDPOINTS.CATEGORIES);
    //console.log('response Categories', response);
    return response;
  },

  getProducts: async (params: { name?: string; category_id?: number; limit: number; offset: number }) => {
    const queryParams = new URLSearchParams();
    
    // Add required parameters
    queryParams.append('limit', params.limit.toString());
    queryParams.append('offset', params.offset.toString());
    
    // Add optional parameters if present
    if (params.name) {
      queryParams.append('name', params.name);
    }
    
    if (params.category_id) {
      queryParams.append('category_id', params.category_id.toString());
    }
    
    const url = `${POS_ENDPOINTS.PRODUCT_LIST}?${queryParams.toString()}`;
    const response = await apiService.get<PosProductsResponse>(url)

    //console.log('pos products reponse',response)
    return response;
  },
};

export default posService;
