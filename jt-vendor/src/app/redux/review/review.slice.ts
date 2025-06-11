import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Review, ReviewResponse } from './review.models';
import reviewService from './review.service';
import { toast } from 'sonner';

// Define the state interface
interface ReviewState {
  reviews: Review[];
  totalSize: number;
  loading: boolean;
  error: string | null;
  statusUpdating: boolean;
  replySubmitting: boolean;
}

// Initial state
const initialState: ReviewState = {
  reviews: [],
  totalSize: 0,
  loading: false,
  error: null,
  statusUpdating: false,
  replySubmitting: false
};

// Async thunks for API calls
export const fetchReviews = createAsyncThunk(
  'review/fetchReviews',
  async (params: {
    limit?: string;
    page?: string;
    search?: string;
    rating?: string;
    start_date?: string;
    end_date?: string;
  }, { rejectWithValue }) => {
    try {
   

      // Create new params object with offset
      const apiParams = {
        ...params,
        offset: params.page,
        limit: params.limit,
      };
      delete (apiParams as any).page; // Remove page parameter before sending to API

      // Log the parameters being sent to the service
      //console.log('Fetching reviews with params:', apiParams);

      const response = await reviewService.getReviews(apiParams);
      return response;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return rejectWithValue(error);
    }
  }
);

export const updateReviewStatus = createAsyncThunk(
  'review/updateStatus',
  async ({ reviewId, status }: { reviewId: number; status: 0 | 1 }, { rejectWithValue }) => {
    try {
      const response = await reviewService.updateReviewStatus(reviewId, status);
      return { reviewId, status, response };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const replyToReview = createAsyncThunk(
  'review/reply',
  async ({ reviewId, reply }: { reviewId: number; reply: string }, { rejectWithValue }) => {
    try {
      const response = await reviewService.replyToReview(reviewId, reply);
      return { reviewId, reply, response };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Create the review slice
const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
      state.totalSize = 0;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchReviews lifecycle
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action: PayloadAction<ReviewResponse>) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.totalSize = action.payload.total_size;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Handle updateReviewStatus lifecycle
      .addCase(updateReviewStatus.pending, (state) => {
        state.statusUpdating = true;
        state.error = null;
      })
      .addCase(updateReviewStatus.fulfilled, (state, action) => {
        state.statusUpdating = false;
        // Update the review status in the state
        const { reviewId, status } = action.payload;
        const reviewIndex = state.reviews.findIndex(review => review.id === reviewId);
        if (reviewIndex !== -1) {
          state.reviews[reviewIndex].status = status;
        }
        toast.success('Review status updated successfully');
      })
      .addCase(updateReviewStatus.rejected, (state, action) => {
        state.statusUpdating = false;
        state.error = action.payload as string;
      })
      
      // Handle replyToReview lifecycle
      .addCase(replyToReview.pending, (state) => {
        state.replySubmitting = true;
        state.error = null;
      })
      .addCase(replyToReview.fulfilled, (state, action) => {
        state.replySubmitting = false;
        // Update the review reply in the state
        const { reviewId, reply } = action.payload;
        const reviewIndex = state.reviews.findIndex(review => review.id === reviewId);
        if (reviewIndex !== -1) {
          state.reviews[reviewIndex].reply = reply;
        }
        toast.success('Reply submitted successfully');
      })
      .addCase(replyToReview.rejected, (state, action) => {
        state.replySubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearReviews, clearErrors } = reviewSlice.actions;
export default reviewSlice.reducer;
