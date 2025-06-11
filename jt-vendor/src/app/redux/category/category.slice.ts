import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Category, CategoryState } from './category.models';
import { fetchCategories } from './category.service';

// Initial state
const initialState: CategoryState = {
  categories: [],
  isLoading: false,
  error: null,
};

// Async thunk for fetching categories
export const getCategories = createAsyncThunk(
  'category/getCategories',
  async (_, { rejectWithValue }) => {
    ////console.log('🚀 CategorySlice: getCategories async thunk started');
    try {
      const response = await fetchCategories();
      ////console.log('📦 CategorySlice: Categories received from service:', response);
      return response;
    } catch (error) {
      console.error('⚠️ CategorySlice: getCategories async thunk error:', error);
      return rejectWithValue(error);
    }
  }
);

// Create the category slice
const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // Additional reducers can be added here if needed
  },
  extraReducers: (builder) => {
    builder
      // Handle getCategories
      .addCase(getCategories.pending, (state) => {
        ////console.log('⏳ CategorySlice: getCategories.pending - Setting loading state');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        ////console.log('✅ CategorySlice: getCategories.fulfilled - Updating state with categories');
        ////console.log('📊 CategorySlice: Number of categories received:', action.payload.length);
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        console.error('❌ CategorySlice: getCategories.rejected - Error:', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default categorySlice.reducer;
