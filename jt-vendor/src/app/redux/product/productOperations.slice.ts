import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as productAPI from './productOperations.service';
import { StockLimitStatus, Product } from './product.models';

interface ProductOperationsState {
  // Delete digital product state
  isDeleteDigitalLoading: boolean;
  deleteDigitalError: string | null;
  deleteDigitalSuccess: boolean;
  
  // Update quantity state
  isQuantityUpdateLoading: boolean;
  quantityUpdateError: string | null;
  quantityUpdateSuccess: boolean;
  
  // Update status state
  isStatusUpdateLoading: boolean;
  statusUpdateError: string | null;
  statusUpdateSuccess: boolean;
  
  // Delete product state
  isDeleteProductLoading: boolean;
  deleteProductError: string | null;
  deleteProductSuccess: boolean;
  
  // Generate barcode state
  isBarcodeGenerating: boolean;
  barcodeError: string | null;
  barcodeData: Blob | null;
  
  // Delete image state
  isDeleteImageLoading: boolean;
  deleteImageError: string | null;
  deleteImageSuccess: boolean;
  
  // Stock limit status state
  isStockLimitLoading: boolean;
  stockLimitError: string | null;
  stockLimitStatus: StockLimitStatus | null;
}

const initialState: ProductOperationsState = {
  // Delete digital product state
  isDeleteDigitalLoading: false,
  deleteDigitalError: null,
  deleteDigitalSuccess: false,
  
  // Update quantity state
  isQuantityUpdateLoading: false,
  quantityUpdateError: null,
  quantityUpdateSuccess: false,
  
  // Update status state
  isStatusUpdateLoading: false,
  statusUpdateError: null,
  statusUpdateSuccess: false,
  
  // Delete product state
  isDeleteProductLoading: false,
  deleteProductError: null,
  deleteProductSuccess: false,
  
  // Generate barcode state
  isBarcodeGenerating: false,
  barcodeError: null,
  barcodeData: null,
  
  // Delete image state
  isDeleteImageLoading: false,
  deleteImageError: null,
  deleteImageSuccess: false,
  
  // Stock limit status state
  isStockLimitLoading: false,
  stockLimitError: null,
  stockLimitStatus: null,
};

// Async thunk for deleting a digital product
export const deleteDigitalProduct = createAsyncThunk(
  'productOperations/deleteDigitalProduct',
  async ({ productId, variantKey }: { productId: number; variantKey: string }, thunkAPI) => {
    try {
      //console.log('Deleting digital product for product ID:', productId, 'with variant key:', variantKey);
      const data = await productAPI.deleteDigitalProduct(productId, variantKey);
      return data;
    } catch (error: any) {
      console.error('Error deleting digital product:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating product quantity
export const updateProductQuantity = createAsyncThunk(
  'productOperations/updateProductQuantity',
  async (
    { 
      productId, 
      currentStock, 
      variation 
    }: { 
      productId: number; 
      currentStock: number; 
      variation?: Array<{ type: string; qty: number; price?: number; sku?: string }> 
    }, 
    thunkAPI
  ) => {
    try {
      //console.log({productId, currentStock, variation});
      
      //console.log('Updating product quantity for product ID:', productId, 'to', currentStock);
      const data = await productAPI.updateProductQuantity(productId, currentStock, variation);
      return true;
    } catch (error: any) {
      console.error('Error updating product quantity:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating product status
export const updateProductStatus = createAsyncThunk(
  'productOperations/updateProductStatus',
  async ({ productId, status }: { productId: number; status: 0 | 1 }, thunkAPI) => {
    try {
      //console.log('Updating product status for product ID:', productId, 'to', status);
      const data = await productAPI.updateProductStatus(productId, status);
      return data;
    } catch (error: any) {
      console.error('Error updating product status:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for deleting a product
export const deleteProduct = createAsyncThunk(
  'productOperations/deleteProduct',
  async (productId: number, thunkAPI) => {
    try {
      //console.log('Deleting product with ID:', productId);
      const data = await productAPI.deleteProduct(productId);
      return data;
    } catch (error: any) {
      console.error('Error deleting product:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for generating barcode
export const generateBarcode = createAsyncThunk(
  'productOperations/generateBarcode',
  async ({ productId, quantity }: { productId: number; quantity: number }, thunkAPI) => {
    try {
      //console.log('Generating barcode for product ID:', productId, 'quantity:', quantity);
      const data = await productAPI.generateBarcode(productId, quantity);
      return data;
    } catch (error: any) {
      console.error('Error generating barcode:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for deleting a product image
export const deleteProductImage = createAsyncThunk(
  'productOperations/deleteProductImage',
  async (
    { 
      productId, 
      imageName, 
      color 
    }: { 
      productId: number; 
      imageName: string; 
      color?: string 
    }, 
    thunkAPI
  ) => {
    try {
      //console.log('Deleting image for product ID:', productId, 'image name:', imageName);
      const data = await productAPI.deleteProductImage(productId, imageName, color);
      return data;
    } catch (error: any) {
      console.error('Error deleting product image:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk for getting stock limit status
export const fetchStockLimitStatus = createAsyncThunk(
  'productOperations/fetchStockLimitStatus',
  async (_, thunkAPI) => {
    try {
      //console.log('Fetching stock limit status');
      const data = await productAPI.getStockLimitStatus();
      return data;
    } catch (error: any) {
      console.error('Error fetching stock limit status:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const productOperationsSlice = createSlice({
  name: 'productOperations',
  initialState,
  reducers: {
    // Reset success states after UI has processed them
    resetDeleteDigitalSuccess: (state) => {
      state.deleteDigitalSuccess = false;
    },
    resetQuantityUpdateSuccess: (state) => {
      state.quantityUpdateSuccess = false;
    },
    resetStatusUpdateSuccess: (state) => {
      state.statusUpdateSuccess = false;
    },
    resetDeleteProductSuccess: (state) => {
      state.deleteProductSuccess = false;
    },
    resetDeleteImageSuccess: (state) => {
      state.deleteImageSuccess = false;
    },
    clearBarcodeData: (state) => {
      state.barcodeData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Delete digital product reducers
      .addCase(deleteDigitalProduct.pending, (state) => {
        //console.log('deleteDigitalProduct.pending');
        state.isDeleteDigitalLoading = true;
        state.deleteDigitalError = null;
        state.deleteDigitalSuccess = false;
      })
      .addCase(deleteDigitalProduct.fulfilled, (state, action) => {
        //console.log('deleteDigitalProduct.fulfilled:', action.payload);
        state.isDeleteDigitalLoading = false;
        state.deleteDigitalSuccess = true;
      })
      .addCase(deleteDigitalProduct.rejected, (state, action) => {
        //console.log('deleteDigitalProduct.rejected:', action.payload);
        state.isDeleteDigitalLoading = false;
        state.deleteDigitalError = action.payload as string;
      })
      
      // Update product quantity reducers
      .addCase(updateProductQuantity.pending, (state) => {
        //console.log('updateProductQuantity.pending');
        state.isQuantityUpdateLoading = true;
        state.quantityUpdateError = null;
        state.quantityUpdateSuccess = false;
      })
      .addCase(updateProductQuantity.fulfilled, (state, action) => {
        //console.log('updateProductQuantity.fulfilled:', action.payload);
        state.isQuantityUpdateLoading = false;
        state.quantityUpdateSuccess = true;
      })
      .addCase(updateProductQuantity.rejected, (state, action) => {
        //console.log('updateProductQuantity.rejected:', action.payload);
        state.isQuantityUpdateLoading = false;
        state.quantityUpdateError = action.payload as string;
      })
      
      // Update product status reducers
      .addCase(updateProductStatus.pending, (state) => {
        //console.log('updateProductStatus.pending');
        state.isStatusUpdateLoading = true;
        state.statusUpdateError = null;
        state.statusUpdateSuccess = false;
      })
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        //console.log('updateProductStatus.fulfilled:', action.payload);
        state.isStatusUpdateLoading = false;
        state.statusUpdateSuccess = true;
      })
      .addCase(updateProductStatus.rejected, (state, action) => {
        //console.log('updateProductStatus.rejected:', action.payload);
        state.isStatusUpdateLoading = false;
        state.statusUpdateError = action.payload as string;
      })
      
      // Delete product reducers
      .addCase(deleteProduct.pending, (state) => {
        //console.log('deleteProduct.pending');
        state.isDeleteProductLoading = true;
        state.deleteProductError = null;
        state.deleteProductSuccess = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        //console.log('deleteProduct.fulfilled:', action.payload);
        state.isDeleteProductLoading = false;
        state.deleteProductSuccess = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        //console.log('deleteProduct.rejected:', action.payload);
        state.isDeleteProductLoading = false;
        state.deleteProductError = action.payload as string;
      })
      
      // Generate barcode reducers
      .addCase(generateBarcode.pending, (state) => {
        //console.log('generateBarcode.pending');
        state.isBarcodeGenerating = true;
        state.barcodeError = null;
        state.barcodeData = null;
      })
      .addCase(generateBarcode.fulfilled, (state, action) => {
        //console.log('generateBarcode.fulfilled: Blob received');
        state.isBarcodeGenerating = false;
        state.barcodeData = action.payload as Blob;
      })
      .addCase(generateBarcode.rejected, (state, action) => {
        //console.log('generateBarcode.rejected:', action.payload);
        state.isBarcodeGenerating = false;
        state.barcodeError = action.payload as string;
      })
      
      // Delete product image reducers
      .addCase(deleteProductImage.pending, (state) => {
        //console.log('deleteProductImage.pending');
        state.isDeleteImageLoading = true;
        state.deleteImageError = null;
        state.deleteImageSuccess = false;
      })
      .addCase(deleteProductImage.fulfilled, (state, action) => {
        //console.log('deleteProductImage.fulfilled:', action.payload);
        state.isDeleteImageLoading = false;
        state.deleteImageSuccess = true;
      })
      .addCase(deleteProductImage.rejected, (state, action) => {
        //console.log('deleteProductImage.rejected:', action.payload);
        state.isDeleteImageLoading = false;
        state.deleteImageError = action.payload as string;
      })
      
      // Fetch stock limit status reducers
      .addCase(fetchStockLimitStatus.pending, (state) => {
        //console.log('fetchStockLimitStatus.pending');
        state.isStockLimitLoading = true;
        state.stockLimitError = null;
      })
      .addCase(fetchStockLimitStatus.fulfilled, (state, action) => {
        //console.log('fetchStockLimitStatus.fulfilled:', action.payload);
        state.isStockLimitLoading = false;
        state.stockLimitStatus = action.payload as StockLimitStatus;
      })
      .addCase(fetchStockLimitStatus.rejected, (state, action) => {
        //console.log('fetchStockLimitStatus.rejected:', action.payload);
        state.isStockLimitLoading = false;
        state.stockLimitError = action.payload as string;
      });
  },
});

export const { 
  resetDeleteDigitalSuccess, 
  resetQuantityUpdateSuccess, 
  resetStatusUpdateSuccess, 
  resetDeleteProductSuccess, 
  resetDeleteImageSuccess,
  clearBarcodeData
} = productOperationsSlice.actions;

export default productOperationsSlice.reducer; 