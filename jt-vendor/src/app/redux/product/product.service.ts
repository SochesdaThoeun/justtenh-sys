import { PRODUCT_ENDPOINTS, POS_ENDPOINTS } from '@/app/constants/api.constants';
import apiService from '@/app/services/api.service';
import { ProductModel } from './product.models';

// Add interface for image upload response
export interface UploadImageResponse {
  image_name: string;
  storage: string;
  path: string;
}

export const getSellerProductList = async (
  sellerId: string,
  offset: number,
  limit: number,
  search: string,
  category_id?: string | null,
  status?: number | null
) => {
  try {
    ////console.log('===== GET SELLER PRODUCT LIST REQUEST - START =====');
    ////console.log('Request parameters:', {sellerId, offset, limit, search, category_id, status});
    
    // Build params object
    const params: Record<string, any> = { 
      limit, 
      offset, 
      search
    };
    
    // Add category_id if it exists (ensure it's a number)
    if (category_id) {
      params.category_id = category_id;
      ////console.log(`Adding category filter: ${category_id}`);
    }
    
    // Add status if it's defined (ensure it's 0 or 1)
    if (status !== null && status !== undefined) {
      params.status = status;
      ////console.log(`Adding status filter: ${status}`);
    }
    
    ////console.log(`Making API request to ${PRODUCT_ENDPOINTS.LIST} with params:`, params);
    
    const response = await apiService.get(`${PRODUCT_ENDPOINTS.LIST}`, {
      params
    });
    //console.log('response', response)
    
    // Type assertion for response
    const typedResponse = response as ProductModel;
    
    
    ////console.log('===== GET SELLER PRODUCT LIST REQUEST - END =====');
    
    return response;
  } catch (error) {
    console.error('===== GET SELLER PRODUCT LIST REQUEST - ERROR =====', error);
    throw error;
  }
};

export const getPosProductList = async (offset: number, ids: string[]) => {
  try {
    return await apiService.get(`${POS_ENDPOINTS.PRODUCT_LIST}`, {
      params: { limit: 10, offset, category_id: JSON.stringify(ids) }
    });
  } catch (error) {
    throw error;
  }
};

export const getSearchedPosProductList = async (search: string, ids: number) => {
  try {
    return await apiService.get(`${POS_ENDPOINTS.SEARCH_PRODUCTS}`, {
      params: { limit: 10, offset: 1, name: search, category_id: JSON.stringify(ids) }
    });
  } catch (error) {
    throw error;
  }
};

export const getStockLimitedProductList = async (offset: number, languageCode: string) => {
  try {
    return await apiService.get(`${PRODUCT_ENDPOINTS.STOCK_OUT}`, {
      params: { offset },
      headers: { 'Accept-Language': languageCode }
    });
  } catch (error) {
    throw error;
  }
};

export const getMostPopularProductList = async (offset: number = 1, limit: number = 10, languageCode: string = 'en') => {
  try {
    return await apiService.get(`${PRODUCT_ENDPOINTS.MOST_POPULAR}`, {
      params: { offset, limit },
      headers: { 'Accept-Language': languageCode }
    });
  } catch (error) {
    console.error('Error fetching most popular products:', error);
    throw error;
  }
};

export const getTopSellingProductList = async (offset: number = 1, limit: number = 10, languageCode: string = 'en') => {
  try {
    return await apiService.get(`${PRODUCT_ENDPOINTS.TOP_SELLING}`, {
      params: { offset, limit },
      headers: { 'Accept-Language': languageCode }
    });
  } catch (error) {
    console.error('Error fetching top selling products:', error);
    throw error;
  }
};

export const addProduct = async (productData: FormData) => {
  try {
    //console.log('===== PRODUCT ADD REQUEST - START =====');
    
    // Extract and log the product data from FormData
    const productDataJson = productData.get('product_data');
    
    if (productDataJson && typeof productDataJson === 'string') {
      try {
        const parsedProductData = JSON.parse(productDataJson);
        //console.log('Product Data (input):', parsedProductData);
        
        // Create a new FormData to structure the data properly for the API
        const apiFormData = new FormData();
        
        // Handle basic fields - pass through as is
        const basicFields = [
          'name', 'category_id', 'brand_id', 'product_type', 'unit', 
          'minimum_order_qty', 'thumbnail', 'unit_price', 'current_stock', 
          'description', 'discount_type', 'discount', 'tax', 'code',
          'tags', 'lang', 'meta_title', 'meta_description',
          'weight', 'width', 'height', 'length', 'tax_type', 'tax_model',
          'shipping_cost', 'color_image'
        ];
        
        // Add default values for missing required fields
        const defaultValues: Record<string, string> = {
          // Category structure
          'sub_category_id': '',
          'sub_sub_category_id': '',
          
          // Media
          'video_link': '',
          
          // SEO
          'meta_index': 'index',
          'meta_no_follow': 'follow',
          
          // Set defaults for multiplyQTY - changed from shipping_cost
          'multiplyQTY': '0',
          'color_image': '[]'
        };
        
        // Add basic fields from the product data
        basicFields.forEach(field => {
          if (parsedProductData[field] !== undefined) {
            // If it's already a string that looks like JSON, pass it as is
            if (typeof parsedProductData[field] === 'string' && 
                (parsedProductData[field].startsWith('[') || parsedProductData[field].startsWith('{'))) {
              apiFormData.append(field, parsedProductData[field]);
            } 
            // Otherwise stringify arrays and objects, or convert to string
            else if (Array.isArray(parsedProductData[field]) || 
                    (typeof parsedProductData[field] === 'object' && parsedProductData[field] !== null)) {
              apiFormData.append(field, JSON.stringify(parsedProductData[field]));
            }
            else {
              apiFormData.append(field, String(parsedProductData[field]));
            }
          }
        });
        
        
        // Add default values for missing fields
        Object.entries(defaultValues).forEach(([key, value]) => {
          if (parsedProductData[key] === undefined) {
            apiFormData.append(key, value);
          }
        });
        
        // Define interfaces for choice options and variations
        interface ChoiceOption {
          name: string;
          title: string;
          options: string[];
        }
        
        interface Variation {
          type: string;
          price: number;
          sku: string;
          qty: number;
        }
       
        
        // Handle choice options in the expected format
        if (parsedProductData.choice_options && Array.isArray(parsedProductData.choice_options)) {
          // Extract choice numbers (choice_1, choice_2, etc.)
          const choiceNumbers = parsedProductData.choice_options.map((_: any, index: number) => index + 1);
          apiFormData.append('choice_no', JSON.stringify(choiceNumbers));
          
          // Extract choice titles as an array
          const choiceTitles = parsedProductData.choice_options.map((option: ChoiceOption) => option.title);
          
          // Append choice array to form data
          apiFormData.append('choice', JSON.stringify(choiceTitles));
          
          // Extract choice attributes (often just the same as the choice numbers)
          apiFormData.append('choice_attributes', JSON.stringify(choiceNumbers));
          // Add individual choice options
          parsedProductData.choice_options.forEach((option: ChoiceOption, index: number) => {
            if (option.options && Array.isArray(option.options)) {
              apiFormData.append(`choice_options_${index + 1}`, JSON.stringify(option.options));
            }
          });
        } else {
          // Ensure default choice options are provided as JSON strings
          // This ensures API compatibility even when no choice_options are provided
          if (!apiFormData.get('choice_no')) {
            apiFormData.append('choice_no', '[]');
          }
          if (!apiFormData.get('choice')) {
            apiFormData.append('choice', '[]');
          }
          if (!apiFormData.get('choice_attributes')) {
            apiFormData.append('choice_attributes', '[]');
          }
        }

        

        
        
        
        
        if (parsedProductData.choice_attributes) {
          apiFormData.set('choice_attributes', typeof parsedProductData.choice_attributes === 'string'
            ? parsedProductData.choice_attributes
            : JSON.stringify(parsedProductData.choice_attributes));
        }
        
        // Set individual choice options if explicitly provided
        // Don't assume a fixed number of choices, instead dynamically handle them
        if (parsedProductData.choice_options && Array.isArray(parsedProductData.choice_options)) {
          // Process all choices dynamically instead of assuming a max number
          parsedProductData.choice_options.forEach((option: any, index: number) => {
            const optionKey = `choice_options_${index + 1}`;
            if (parsedProductData[optionKey]) {
              apiFormData.set(optionKey, typeof parsedProductData[optionKey] === 'string'
                ? parsedProductData[optionKey]
                : JSON.stringify(parsedProductData[optionKey]));
            }
          });
        } else {
          // Handle individual choice options if they exist without a choice_options array
          Object.keys(parsedProductData).forEach(key => {
            if (key.startsWith('choice_options_') && parsedProductData[key]) {
              apiFormData.set(key, typeof parsedProductData[key] === 'string'
                ? parsedProductData[key]
                : JSON.stringify(parsedProductData[key]));
            }
          });
        }
        
        // Handle variations in the expected format (price_S-Cotton, sku_S-Cotton, etc.)
        if (parsedProductData.variations && Array.isArray(parsedProductData.variations)) {
          parsedProductData.variations.forEach((variation: Variation) => {
            if (variation.type && variation.price !== undefined && variation.sku && variation.qty !== undefined) {
              apiFormData.append(`price_${variation.type}`, String(variation.price));
              apiFormData.append(`sku_${variation.type}`, variation.sku);
              apiFormData.append(`qty_${variation.type}`, String(variation.qty));
            }
          });
        }
        
        // Handle images in the expected format
        if (parsedProductData.images) {
          // If images is already a string in the correct format, use it as is
          if (typeof parsedProductData.images === 'string' && 
              parsedProductData.images.includes('image_name')) {
            apiFormData.append('images', parsedProductData.images);
          } 
          // If it's an array of strings, convert to the expected format
          else if (Array.isArray(parsedProductData.images)) {
            const formattedImages = parsedProductData.images.map((img: string) => {
              return { image_name: img };
            });
            apiFormData.append('images', JSON.stringify(formattedImages));
          }
        }
        
        // Log the final FormData as a JSON object
        //console.log('API FormData prepared with properly formatted strings');
        
        // Convert FormData to JSON for logging
        const formJson: Record<string, any> = {};
        apiFormData.forEach((value, key) => {
          formJson[key] = value;
        });
        //console.log('API FormData JSON 1 payload:', JSON.stringify(formJson, null, 2));
        
        return await apiService.postForm(`${PRODUCT_ENDPOINTS.ADD_PRODUCT}`, apiFormData);
        //return true;
        
      } catch (e) {
        console.error('Error parsing product_data JSON:', e);
        throw e;
      }
    } else {
      throw new Error('Product data not found or invalid');
    }
    
  } catch (error) {
    console.error('===== PRODUCT ADD REQUEST - ERROR =====');
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, productData: FormData) => {
  try {
    //console.log('===== PRODUCT UPDATE REQUEST - START =====');
    
    // Extract and log the product data from FormData
    const productDataJson = productData.get('product_data');
    
    if (productDataJson && typeof productDataJson === 'string') {
      try {
        const parsedProductData = JSON.parse(productDataJson);
        //console.log('Product Data (input):', parsedProductData);
        
        // Create a new FormData to structure the data properly for the API
        const apiFormData = new FormData();
        
        // Add ID to form data
        apiFormData.append('id', id);
        
        // Handle basic fields - pass through as is
        const basicFields = [
          'name', 'category_id', 'brand_id', 'product_type', 'unit', 
          'minimum_order_qty', 'thumbnail', 'unit_price', 'current_stock', 
          'description', 'discount_type', 'discount', 'tax', 'code',
          'tags', 'lang', 'meta_title', 'meta_description',
          'weight', 'width', 'height', 'length', 'tax_type', 'tax_model',
          'shipping_cost', 'color_image'
        ];
        
        // Add default values for missing required fields
        const defaultValues: Record<string, string> = {
          // Category structure
          'sub_category_id': '',
          'sub_sub_category_id': '',
          
          // Media
          'video_link': '',
          
          // SEO
          'meta_index': 'index',
          'meta_no_follow': 'follow',
          
          // Set defaults for multiplyQTY - changed from shipping_cost
          'multiplyQTY': '0',
          'color_image': '[]'
        };
        
        // Add basic fields from the product data
        basicFields.forEach(field => {
          if (parsedProductData[field] !== undefined) {
            // If it's already a string that looks like JSON, pass it as is
            if (typeof parsedProductData[field] === 'string' && 
                (parsedProductData[field].startsWith('[') || parsedProductData[field].startsWith('{'))) {
              apiFormData.append(field, parsedProductData[field]);
            } 
            // Otherwise stringify arrays and objects, or convert to string
            else if (Array.isArray(parsedProductData[field]) || 
                    (typeof parsedProductData[field] === 'object' && parsedProductData[field] !== null)) {
              apiFormData.append(field, JSON.stringify(parsedProductData[field]));
            }
            else {
              apiFormData.append(field, String(parsedProductData[field]));
            }
          }
        });
        
        
        // Add default values for missing fields
        Object.entries(defaultValues).forEach(([key, value]) => {
          if (parsedProductData[key] === undefined) {
            apiFormData.append(key, value);
          }
        });
        
        // Define interfaces for choice options and variations
        interface ChoiceOption {
          name: string;
          title: string;
          options: string[];
        }
        
        interface Variation {
          type: string;
          price: number;
          sku: string;
          qty: number;
        }
       
        
        // Handle choice options in the expected format
        if (parsedProductData.choice_options && Array.isArray(parsedProductData.choice_options)) {
          // Extract choice numbers (choice_1, choice_2, etc.)
          const choiceNumbers = parsedProductData.choice_options.map((_: any, index: number) => index + 1);
          apiFormData.append('choice_no', JSON.stringify(choiceNumbers));
          
          // Extract choice titles as an array
          const choiceTitles = parsedProductData.choice_options.map((option: ChoiceOption) => option.title);
          
          // Append choice array to form data
          apiFormData.append('choice', JSON.stringify(choiceTitles));
          
          // Extract choice attributes (often just the same as the choice numbers)
          apiFormData.append('choice_attributes', JSON.stringify(choiceNumbers));
          // Add individual choice options
          parsedProductData.choice_options.forEach((option: ChoiceOption, index: number) => {
            if (option.options && Array.isArray(option.options)) {
              apiFormData.append(`choice_options_${index + 1}`, JSON.stringify(option.options));
            }
          });
        } else {
          // Ensure default choice options are provided as JSON strings
          // This ensures API compatibility even when no choice_options are provided
          if (!apiFormData.get('choice_no')) {
            apiFormData.append('choice_no', '[]');
          }
          if (!apiFormData.get('choice')) {
            apiFormData.append('choice', '[]');
          }
          if (!apiFormData.get('choice_attributes')) {
            apiFormData.append('choice_attributes', '[]');
          }
        }

        const formJson: Record<string, any> = {};
        

        if (parsedProductData.choice_attributes) {
          apiFormData.set('choice_attributes', typeof parsedProductData.choice_attributes === 'string'
            ? parsedProductData.choice_attributes
            : JSON.stringify(parsedProductData.choice_attributes));
        }
        
        // Set individual choice options if explicitly provided
        // Don't assume a fixed number of choices, instead dynamically handle them
        if (parsedProductData.choice_options && Array.isArray(parsedProductData.choice_options)) {
          // Process all choices dynamically instead of assuming a max number
          parsedProductData.choice_options.forEach((option: any, index: number) => {
            const optionKey = `choice_options_${index + 1}`;
            if (parsedProductData[optionKey]) {
              apiFormData.set(optionKey, typeof parsedProductData[optionKey] === 'string'
                ? parsedProductData[optionKey]
                : JSON.stringify(parsedProductData[optionKey]));
            }
          });
        } else {
          // Handle individual choice options if they exist without a choice_options array
          Object.keys(parsedProductData).forEach(key => {
            if (key.startsWith('choice_options_') && parsedProductData[key]) {
              apiFormData.set(key, typeof parsedProductData[key] === 'string'
                ? parsedProductData[key]
                : JSON.stringify(parsedProductData[key]));
            }
          });
        }
        
        // Handle variations in the expected format (price_S-Cotton, sku_S-Cotton, etc.)
        if (parsedProductData.variations && Array.isArray(parsedProductData.variations)) {
          parsedProductData.variations.forEach((variation: Variation) => {
            if (variation.type && variation.price !== undefined && variation.sku && variation.qty !== undefined) {
              apiFormData.append(`price_${variation.type}`, String(variation.price));
              apiFormData.append(`sku_${variation.type}`, variation.sku);
              apiFormData.append(`qty_${variation.type}`, String(variation.qty));
            }
          });
        }
        
        // Handle images in the expected format
        if (parsedProductData.images) {
          // If images is already a string in the correct format, use it as is
          if (typeof parsedProductData.images === 'string' && 
              parsedProductData.images.includes('image_name')) {
            apiFormData.append('images', parsedProductData.images);
          } 
          // If it's an array of strings, convert to the expected format
          else if (Array.isArray(parsedProductData.images)) {
            const formattedImages = parsedProductData.images.map((img: string) => {
              return { image_name: img };
            });
            apiFormData.append('images', JSON.stringify(formattedImages));
          }
        }
        
        // Log the final FormData as a JSON object
        //console.log('API FormData prepared with properly formatted strings');
        
        apiFormData.forEach((value, key) => {
          formJson[key] = value;
        });
        //console.log('API FormData JSON 1 payload:', JSON.stringify(formJson, null, 2));
        
        // Use PRODUCT_ENDPOINTS.UPDATE_PRODUCT instead of ADD_PRODUCT
        return await apiService.put(`${PRODUCT_ENDPOINTS.UPDATE_PRODUCT}/${id}`, apiFormData);
        
      } catch (e) {
        console.error('Error parsing product_data JSON:', e);
        throw e;
      }
    } else {
      throw new Error('Product data not found or invalid');
    }
    
  } catch (error) {
    console.error('===== PRODUCT UPDATE REQUEST - ERROR =====');
    console.error('Error updating product:', error);
    throw error;
  }
};

export const isShowCookies = (): boolean => {
  return localStorage.getItem('showCookies') !== null;
};

export const setIsShowCookies = (): void => {
  localStorage.setItem('showCookies', 'cookies');
};

export const removeShowCookies = (): void => {
  localStorage.removeItem('showCookies');
};

// New function to upload a single image
export const uploadProductImage = async (imageFile: File, type: 'product' | 'thumbnail' | 'meta' | 'color', color?: string): Promise<UploadImageResponse> => {
  try {
    //console.log(`===== IMAGE UPLOAD REQUEST (${type}) - START =====`);
    //console.log(`File: ${imageFile.name} (${imageFile.size} bytes, ${imageFile.type})`);
    
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('type', type);
    
    // Only add these if color is used
    if (type === 'color' && color) {
      formData.append('color', color);
    }
    
    //console.log(`Sending to endpoint: ${PRODUCT_ENDPOINTS.UPLOAD_IMAGES}`);
    
    const response = await apiService.postForm(`${PRODUCT_ENDPOINTS.UPLOAD_IMAGES}`, formData);
    return response as UploadImageResponse;
  } catch (error) {
    console.error(`===== IMAGE UPLOAD REQUEST (${type}) - ERROR =====`);
    console.error(`Error uploading ${type} image:`, error);
    throw error;
  }
};

// Function to get product details by ID
export const getProductDetails = async (productId: string, languageCode: string = 'en') => {
  try {
    //console.log(`===== PRODUCT DETAILS REQUEST - START =====`);
    //console.log(`Fetching details for product ID: ${productId}`);
    
    const response = await apiService.get(`${PRODUCT_ENDPOINTS.PRODUCT_DETAILS}${productId}`, {
      headers: { 'Accept-Language': languageCode }
    });
    
    //console.log(`Successfully fetched product details`);
    return response;
  } catch (error) {
    console.error(`===== PRODUCT DETAILS REQUEST - ERROR =====`);
    console.error(`Error fetching product details:`, error);
    throw error;
  }
}; 