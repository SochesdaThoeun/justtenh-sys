import axios from 'axios';
import { BASE_URL, PRODUCT_ENDPOINTS } from '@/app/constants/api.constants';
import apiService from '@/app/services/api.service';
import { StockLimitStatus } from './product.models';

/**
 * Get default language setting from the system
 * @returns Object with default_lang property
 */
export const getDefaultLanguage = async (): Promise<{ default_lang: string }> => {
  try {
    //console.log('===== GET DEFAULT LANGUAGE - START =====');
    
    const response = await apiService.get<{ default_lang: string }>(PRODUCT_ENDPOINTS.DEFAULT_LANGUAGE);
    
    //console.log('GET DEFAULT LANGUAGE RESPONSE:', response);
    //console.log('===== GET DEFAULT LANGUAGE - END =====');
    
    return response;
  } catch (error) {
    console.error('===== GET DEFAULT LANGUAGE - ERROR =====', error);
    throw error;
  }
};

/**
 * Delete a digital product file
 * @param productId - The ID of the product
 * @param variantKey - The variant key for the digital product
 * @returns Success response
 */
export const deleteDigitalProduct = async (productId: number, variantKey: string) => {
  try {
    //console.log('===== DELETE DIGITAL PRODUCT REQUEST - START =====');
    //console.log('Request parameters:', { productId, variantKey });
    
    const response = await apiService.post(`${PRODUCT_ENDPOINTS.DELETE_DIGITAL_FILE}`, {
      product_id: productId,
      variant_key: variantKey
    });
    
    //console.log('DELETE DIGITAL PRODUCT RESPONSE:', response);
    //console.log('===== DELETE DIGITAL PRODUCT REQUEST - END =====');
    
    return response;
  } catch (error) {
    console.error('===== DELETE DIGITAL PRODUCT REQUEST - ERROR =====', error);
    throw error;
  }
};

/**
 * Update product quantity
 * @param productId - The ID of the product
 * @param currentStock - The new stock quantity
 * @param variation - Optional variation array for stock update
 * @returns Success response
 */
export const updateProductQuantity = async (
  productId: number, 
  currentStock: number,
  variation?: Array<{ type: string; qty: number; price?: number; sku?: string }>
) => {
  try {
    //console.log('===== UPDATE PRODUCT QUANTITY REQUEST - START =====');
    
    const requestData: any = {
      product_id: productId,
      current_stock: currentStock
    };
    
    // Always provide variation as an array, empty if not provided
    requestData.variation = variation || [];
    
    //console.log('Request parameters:', requestData);
    
    const response = await apiService.put(`${PRODUCT_ENDPOINTS.QUANTITY_UPDATE}`, requestData);
    // Simulate successful API call for demo/test
    //const response = true;
    
    //console.log('UPDATE PRODUCT QUANTITY RESPONSE:', response);
    //console.log('===== UPDATE PRODUCT QUANTITY REQUEST - END =====');
    
    return response;
  } catch (error) {
    console.error('===== UPDATE PRODUCT QUANTITY REQUEST - ERROR =====', error);
    throw error;
  }
};

/**
 * Update product status (active/inactive)
 * @param productId - The ID of the product
 * @param status - The new status (0 for inactive, 1 for active)
 * @returns Success response
 */
export const updateProductStatus = async (productId: number, status: 0 | 1) => {
  try {
    //console.log('===== UPDATE PRODUCT STATUS REQUEST - START =====');
    //console.log('Request parameters:', { productId, status });
    
    const response = await apiService.put(`${PRODUCT_ENDPOINTS.STATUS_UPDATE}`, {
      id: productId,
      status
    });
    
    //console.log('UPDATE PRODUCT STATUS RESPONSE:', response);
    //console.log('===== UPDATE PRODUCT STATUS REQUEST - END =====');
    
    return response;
  } catch (error) {
    console.error('===== UPDATE PRODUCT STATUS REQUEST - ERROR =====', error);
    throw error;
  }
};

/**
 * Delete a product
 * @param productId - The ID of the product to delete
 * @returns Success response
 */
export const deleteProduct = async (productId: number) => {
  try {
    //console.log('===== DELETE PRODUCT REQUEST - START =====');
    //console.log('Request parameters:', { productId });
    
    const response = await apiService.delete(`${PRODUCT_ENDPOINTS.DELETE_PRODUCT}/${productId}`);
    
    //console.log('DELETE PRODUCT RESPONSE:', response);
    //console.log('===== DELETE PRODUCT REQUEST - END =====');
    
    return response;
  } catch (error) {
    console.error('===== DELETE PRODUCT REQUEST - ERROR =====', error);
    throw error;
  }
};

/**
 * Generate a barcode for a product
 * @param productId - The ID of the product
 * @param quantity - The number of barcodes to generate (max 270)
 * @returns PDF file as blob
 */
export const generateBarcode = async (productId: number, quantity: number) => {
  try {
    //console.log('===== GENERATE BARCODE REQUEST - START =====');
    //console.log('Request parameters:', { productId, quantity });
    
    // Using direct axios call to get PDF blob response
    const response = await axios.get(`${BASE_URL}${PRODUCT_ENDPOINTS.BARCODE_GENERATE}`, {
      params: { id: productId, quantity },
      responseType: 'blob'
    });
    
    //console.log('GENERATE BARCODE RESPONSE:', response.status);
    //console.log('===== GENERATE BARCODE REQUEST - END =====');
    
    return response.data; // Returns PDF blob
  } catch (error) {
    console.error('===== GENERATE BARCODE REQUEST - ERROR =====', error);
    throw error;
  }
};

/**
 * Delete an image from a product
 * @param productId - The ID of the product
 * @param imageName - The name of the image to delete
 * @param color - Optional color code for color-specific images
 * @returns Success response
 */
export const deleteProductImage = async (
  productId: number, 
  imageName: string,
  color?: string
) => {
  try {
    //console.log('===== DELETE PRODUCT IMAGE REQUEST - START =====');
    //console.log('Request parameters:', { productId, imageName, color });
    
    const params: Record<string, any> = {
      id: productId,
      name: imageName
    };
    
    if (color) {
      params.color = color;
    }
    
    const response = await apiService.get(`${PRODUCT_ENDPOINTS.DELETE_IMAGE}`, {
      params
    });
    
    //console.log('DELETE PRODUCT IMAGE RESPONSE:', response);
    //console.log('===== DELETE PRODUCT IMAGE REQUEST - END =====');
    
    return response;
  } catch (error) {
    console.error('===== DELETE PRODUCT IMAGE REQUEST - ERROR =====', error);
    throw error;
  }
};

/**
 * Get stock limit status information
 * @returns Stock limit status data
 */
export const getStockLimitStatus = async (): Promise<StockLimitStatus> => {
  try {
    //console.log('===== GET STOCK LIMIT STATUS REQUEST - START =====');
    
    const response = await apiService.get(`${PRODUCT_ENDPOINTS.STOCK_OUT}`);
    
    //console.log('GET STOCK LIMIT STATUS RESPONSE:', response);
    //console.log('===== GET STOCK LIMIT STATUS REQUEST - END =====');
    
    return response as StockLimitStatus;
  } catch (error) {
    console.error('===== GET STOCK LIMIT STATUS REQUEST - ERROR =====', error);
    throw error;
  }
}; 