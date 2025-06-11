import apiService from '@/app/services/api.service';
import { CONFIG_ENDPOINTS } from '../../constants/api.constants';
import { Category } from './category.models';

/**
 * Service to fetch all categories
 * @returns {Promise<Category[]>} List of categories
 */
export const fetchCategories = async (): Promise<Category[]> => {
  //console.log('🔍 CategoryService: Fetching categories from API endpoint:', CONFIG_ENDPOINTS.CATEGORIES);
  try {
    const response = await apiService.get<Category[]>(CONFIG_ENDPOINTS.CATEGORIES);
    //console.log('✅ CategoryService: Categories fetched successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ CategoryService: Error fetching categories:', error);
    throw error;
  }
};
