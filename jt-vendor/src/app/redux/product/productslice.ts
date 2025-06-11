import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as productAPI from './product.service';
import { TopSellingProductModel, ProductModel, Product } from './product.models';

interface ProductState {
  sellerProductModel: ProductModel | null;
  posProductModel: ProductModel | null;
  stockOutProductList: Product[];
  mostPopularProductList: Product[];
  topSellingProductModel: TopSellingProductModel | null;
  isLoading: boolean;
  error: string | null;
  productAdded: boolean;
  productUpdated: boolean;
  // Pagination state
  currentPage: number;
  entriesPerPage: number;
  totalSize: number;
  // Filter state
  currentSellerId: string;
  currentSearch: string;
  currentCategoryId: string | null;
  currentStatus: number | null | boolean;
  // Product details
  productDetails: Product | null;
}

const initialState: ProductState = {
  sellerProductModel: null,
  posProductModel: null,
  stockOutProductList: [],
  mostPopularProductList: [],
  topSellingProductModel: null,
  isLoading: false,
  error: null,
  productAdded: false,
  productUpdated: false,
  // Initialize pagination state
  currentPage: 1,
  entriesPerPage: 10,
  totalSize: 0,
  // Initialize filter state
  currentSellerId: '',
  currentSearch: '',
  currentCategoryId: null,
  currentStatus: null,
  // Initialize product details
  productDetails: null,
};

// Async thunk for fetching seller product list
export const fetchSellerProductList = createAsyncThunk(
  'product/fetchSellerProductList',
  async (
    { 
      sellerId, 
      offset, 
      limit, 
      search, 
      category_id, 
      status 
    }: { 
      sellerId: string; 
      offset: number; 
      limit: number; 
      search: string; 
      category_id?: string | null; 
      status?: number | null | boolean;
    },
    thunkAPI
  ) => {
    try {
      // Convert category_id to integer if it exists
      const parsedCategoryId = category_id ? parseInt(category_id) : null;
      
      // Handle status as a boolean value (0 or 1)
      let parsedStatus: number | null = null;
      if (typeof status === 'boolean') {
        parsedStatus = status ? 1 : 0;
      } else if (status !== null && status !== undefined) {
        parsedStatus = parseInt(status.toString()) === 1 ? 1 : 0;
      }
      
      const data = await productAPI.getSellerProductList(
        sellerId, 
        offset, 
        limit, 
        search, 
        parsedCategoryId !== null ? parsedCategoryId.toString() : null,
        parsedStatus
      );
      
      // Return both the API data and the request parameters to update state values
      return {
        data,
        params: {
          sellerId,
          search,
          category_id,
          status
        }
      };
    } catch (error: any) {
      console.error('Error fetching seller products:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for handling pagination
export const changePage = createAsyncThunk(
  'product/changePage',
  async (page: number, { getState, dispatch }) => {
    const state = getState() as { product: ProductState };
    
    ////console.log('State:', state);
    // Get the search params from current state to preserve filters
    const limit = state.product.entriesPerPage;
    const search = state.product.currentSearch;
    const category_id = state.product.currentCategoryId;
    const status = state.product.currentStatus;
    const sellerId = state.product.currentSellerId;
    
    // Dispatch with all the preserved filter values
    
    
    await dispatch(fetchSellerProductList({
      sellerId,
      offset: page,
      limit,
      search,
      category_id,
      status
    }));

    return page;
  }
);

// Async thunk for fetching POS product list
export const fetchPosProductList = createAsyncThunk(
  'product/fetchPosProductList',
  async ({ offset, ids }: { offset: number; ids: string[] }, thunkAPI) => {
    try {
      ////console.log('Fetching POS products with params:', { offset, ids });
      const data = await productAPI.getPosProductList(offset, ids);
      ////console.log('Fetched POS products:', data);
      return data;
    } catch (error: any) {
      console.error('Error fetching POS products:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// New async thunk for fetching stock limited product list
export const fetchStockLimitedProductList = createAsyncThunk(
  'product/fetchStockLimitedProductList',
  async ({ offset, languageCode }: { offset: number; languageCode: string }, thunkAPI) => {
    try {
      ////console.log('Fetching stock limited products with params:', { offset, languageCode });
      const data = await productAPI.getStockLimitedProductList(offset, languageCode);
      ////console.log('Fetched stock limited products:', data);
      return data;
    } catch (error: any) {
      console.error('Error fetching stock limited products:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// New async thunk for fetching most popular product list
export const fetchMostPopularProductList = createAsyncThunk(
  'product/fetchMostPopularProductList',
  async ({ offset, limit, languageCode }: { offset: number; limit?: number; languageCode: string }, thunkAPI) => {
    try {
      ////console.log('Fetching most popular products with params:', { offset, limit, languageCode });
      const data = await productAPI.getMostPopularProductList(offset, limit, languageCode);
      ////console.log('Fetched most popular products:', data);
      return data;
    } catch (error: any) {
      console.error('Error fetching most popular products:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// New async thunk for fetching top selling product list
export const fetchTopSellingProductList = createAsyncThunk(
  'product/fetchTopSellingProductList',
  async ({ offset, limit, languageCode }: { offset: number; limit?: number; languageCode: string }, thunkAPI) => {
    try {
      ////console.log('Fetching top selling products with params:', { offset, limit, languageCode });
      const data = await productAPI.getTopSellingProductList(offset, limit, languageCode);
      ////console.log('Fetched top selling products:', data);
      return data;
    } catch (error: any) {
      console.error('Error fetching top selling products:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for adding a product
export const addProduct = createAsyncThunk(
  'product/addProduct',
  async (formData: FormData, thunkAPI) => {
    try {
      // The formData now contains a single 'product_data' field with the JSON string
      // The service will properly format this data for the API
      
      const data = await productAPI.addProduct(formData);
      //console.log('Product successfully added:', data);
      return data;
    } catch (error: any) {
      console.error('Error in addProduct thunk:', error);
      
      // Handle Laravel validation error format
      if (error.response && error.response.data) {
        const responseData = error.response.data;
        
        // Check for Laravel validation errors in the format: {errors: {field: [error1, error2]}}
        if (responseData.errors && typeof responseData.errors === 'object') {
          // Convert Laravel errors to array of {code: field, message: errorMessage}
          const formattedErrors = [];
          for (const [field, messages] of Object.entries(responseData.errors)) {
            if (Array.isArray(messages)) {
              messages.forEach(message => {
                formattedErrors.push({ code: field, message: message });
              });
            } else if (typeof messages === 'string') {
              formattedErrors.push({ code: field, message: messages });
            }
          }
          
          if (formattedErrors.length > 0) {
            return thunkAPI.rejectWithValue(formattedErrors);
          }
        }
        
        // Handle other response formats
        if (responseData.message) {
          return thunkAPI.rejectWithValue(responseData.message);
        }
        
        return thunkAPI.rejectWithValue(JSON.stringify(responseData));
      }
      
      // Handle direct error message
      if (error.message) {
        return thunkAPI.rejectWithValue(error.message);
      }
      
      // Fallback
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Async thunk for updating a product
export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, formData }: { id: string; formData: FormData }, thunkAPI) => {
    try {
      const data = await productAPI.updateProduct(id, formData);
      //console.log('Product successfully updated:', data);
      return data;
    } catch (error: any) {
      console.error('Error in updateProduct thunk:', error);
      
      // Handle Laravel validation error format
      if (error.response && error.response.data) {
        const responseData = error.response.data;
        
        // Check for Laravel validation errors in the format: {errors: {field: [error1, error2]}}
        if (responseData.errors && typeof responseData.errors === 'object') {
          // Convert Laravel errors to array of {code: field, message: errorMessage}
          const formattedErrors = [];
          for (const [field, messages] of Object.entries(responseData.errors)) {
            if (Array.isArray(messages)) {
              messages.forEach(message => {
                formattedErrors.push({ code: field, message: message });
              });
            } else if (typeof messages === 'string') {
              formattedErrors.push({ code: field, message: messages });
            }
          }
          
          if (formattedErrors.length > 0) {
            return thunkAPI.rejectWithValue(formattedErrors);
          }
        }
        
        // Handle other response formats
        if (responseData.message) {
          return thunkAPI.rejectWithValue(responseData.message);
        }
        
        return thunkAPI.rejectWithValue(JSON.stringify(responseData));
      }
      
      // Handle direct error message
      if (error.message) {
        return thunkAPI.rejectWithValue(error.message);
      }
      
      // Fallback
      return thunkAPI.rejectWithValue('Failed to update product. Please try again.');
    }
  }
);

// Async thunk for fetching product details
export const fetchProductDetails = createAsyncThunk(
  'product/fetchProductDetails',
  async ({ productId, languageCode = 'en' }: { productId: string; languageCode?: string }, thunkAPI) => {
    try {
      //console.log('Fetching product details for ID:', productId);
      const data = await productAPI.getProductDetails(productId, languageCode);
      //console.log('Product details fetched successfully:', data);
      return data;
    } catch (error: any) {
      console.error('Error fetching product details:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // Add synchronous reducers if needed, e.g., for local state updates.
    resetProductAdded: (state) => {
      state.productAdded = false;
    },
    resetProductUpdated: (state) => {
      state.productUpdated = false;
    },
    // Pagination actions
    changeEntriesPerPage: (state, action: PayloadAction<number>) => {
      state.entriesPerPage = action.payload;
      state.currentPage = 1; // Reset to first page when changing entries per page
    },
    // Filter actions
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.currentSearch = action.payload;
      state.currentPage = 1; // Reset page when changing search
    },
    setCategoryId: (state, action: PayloadAction<string | null>) => {
      state.currentCategoryId = action.payload;
      state.currentPage = 1; // Reset page when changing category
    },
    setStatus: (state, action: PayloadAction<number | null | boolean>) => {
      state.currentStatus = action.payload;
      state.currentPage = 1; // Reset page when changing status
    },
    setSellerId: (state, action: PayloadAction<string>) => {
      state.currentSellerId = action.payload;
    },
    // Reset filters action
    resetFilters: (state) => {
      state.currentPage = 1;
      state.currentSearch = '';
      state.currentCategoryId = null;
      state.currentStatus = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProductList.pending, (state) => {
        ////console.log('fetchSellerProductList.pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSellerProductList.fulfilled, (state, action) => {
        ////console.log('fetchSellerProductList.fulfilled:', action.payload);
        state.isLoading = false;
        
        // Extract data and params from the payload
        const { data, params } = action.payload as { 
          data: ProductModel; 
          params: {
            sellerId: string;
            search: string;
            category_id?: string | null;
            status?: number | null | boolean;
          }
        };
        
        // Store the API response
        state.sellerProductModel = data;
        
        // Update pagination info from the response
        if (data.total_size !== undefined) {
          state.totalSize = data.total_size;
        }
        // Update limit if returned from API
        if (data.limit !== undefined) {
          state.entriesPerPage = data.limit;
        }
        
        // Update filter state with the values used in the request
        state.currentSellerId = params.sellerId;
        state.currentSearch = params.search;
        state.currentCategoryId = params.category_id || null;
        state.currentStatus = params.status !== undefined ? params.status : null;
      })
      .addCase(fetchSellerProductList.rejected, (state, action) => {
        ////console.log('fetchSellerProductList.rejected:', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPosProductList.pending, (state) => {
        ////console.log('fetchPosProductList.pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosProductList.fulfilled, (state, action) => {
        ////console.log('fetchPosProductList.fulfilled:', action.payload);
        state.isLoading = false;
        // For illustration, assume we store the fetched POS products into posProductModel
        state.posProductModel = action.payload as ProductModel;
      })
      .addCase(fetchPosProductList.rejected, (state, action) => {
        ////console.log('fetchPosProductList.rejected:', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // New cases for stock limited products
      .addCase(fetchStockLimitedProductList.pending, (state) => {
        ////console.log('fetchStockLimitedProductList.pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStockLimitedProductList.fulfilled, (state, action) => {
        ////console.log('fetchStockLimitedProductList.fulfilled:', action.payload);
        state.isLoading = false;
        // Assuming the API returns an object with a 'products' array
        const payload = action.payload as { products?: Product[] };
        state.stockOutProductList = payload.products || [];
      })
      .addCase(fetchStockLimitedProductList.rejected, (state, action) => {
        ////console.log('fetchStockLimitedProductList.rejected:', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // New cases for most popular products
      .addCase(fetchMostPopularProductList.pending, (state) => {
        ////console.log('fetchMostPopularProductList.pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMostPopularProductList.fulfilled, (state, action) => {
        ////console.log('fetchMostPopularProductList.fulfilled:', action.payload);
        state.isLoading = false;
        const payload = action.payload as { products?: Product[] };
        state.mostPopularProductList = payload.products || [];
      })
      .addCase(fetchMostPopularProductList.rejected, (state, action) => {
        ////console.log('fetchMostPopularProductList.rejected:', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // New cases for top selling products
      .addCase(fetchTopSellingProductList.pending, (state) => {
        ////console.log('fetchTopSellingProductList.pending');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTopSellingProductList.fulfilled, (state, action) => {
        ////console.log('fetchTopSellingProductList.fulfilled:', action.payload);
        state.isLoading = false;
        state.topSellingProductModel = action.payload as TopSellingProductModel;
      })
      .addCase(fetchTopSellingProductList.rejected, (state, action) => {
        ////console.log('fetchTopSellingProductList.rejected:', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add product cases
      .addCase(addProduct.pending, (state) => {
        ////console.log('addProduct.pending');
        state.isLoading = true;
        state.error = null;
        state.productAdded = false;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        ////console.log('addProduct.fulfilled:', action.payload);
        state.isLoading = false;
        state.productAdded = true;
      })
      .addCase(addProduct.rejected, (state, action) => {
        ////console.log('addProduct.rejected:', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
        state.productAdded = false;
      })
      // Update product cases
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.productUpdated = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productUpdated = true;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.productUpdated = false;
      })
      // Add new cases for fetchProductDetails
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload as Product;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
  },
});

export const { 
  resetProductAdded,
  resetProductUpdated,
  changeEntriesPerPage, 
  resetFilters, 
  setSearchTerm, 
  setCategoryId, 
  setStatus, 
  setSellerId 
} = productSlice.actions;
export default productSlice.reducer;
