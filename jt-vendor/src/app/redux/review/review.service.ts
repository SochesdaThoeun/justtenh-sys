import apiService from '@/app/services/api.service';
import { REVIEW_ENDPOINTS } from '../../constants/api.constants';
import { ReviewResponse } from './review.models';

interface GetReviewsParams {
  limit?: string;
  offset?: string;
  search?: string;
  rating?: string;
  start_date?: string;
  end_date?: string;
}

const reviewService = {
  /**
   * Get product reviews for the seller's shop
   * @param params Query parameters for filtering reviews
   * @returns Promise with review data
   */
  getReviews: (params: GetReviewsParams): Promise<ReviewResponse> => {
    const queryParams = new URLSearchParams();
    
    // Add parameters to query string if they exist
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.offset) queryParams.append('offset', params.offset);
    if (params.search) queryParams.append('search', params.search);
    if (params.rating) queryParams.append('rating', params.rating);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    
    // Build the URL with query parameters
    const url = `${REVIEW_ENDPOINTS.PRODUCT_REVIEWS}?${queryParams.toString()}`;
    
    return apiService.get<ReviewResponse>(url);
  },
  
  /**
   * Update review status (approve/reject)
   * @param reviewId ID of the review to update
   * @param status Status to set (0 for reject, 1 for approve)
   * @returns Promise with response data
   */
  updateReviewStatus: (reviewId: number, status: 0 | 1): Promise<any> => {
    const data = {
      id: reviewId,
      status
    };
    
    return apiService.post<any>(REVIEW_ENDPOINTS.REVIEW_STATUS_UPDATE, data);
  },
  
  /**
   * Reply to a review
   * @param reviewId ID of the review to reply to
   * @param reply Reply message
   * @returns Promise with response data
   */
  replyToReview: (reviewId: number, reply: string): Promise<any> => {
    const data = {
      id: reviewId,
      reply
    };
    
    return apiService.post<any>(REVIEW_ENDPOINTS.REPLY, data);
  }
};

export default reviewService;
