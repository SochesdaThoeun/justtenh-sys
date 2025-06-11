import React from 'react';
import { Reviews } from '@/app/redux/product/product.models';

interface ReviewTabProps {
  productId: string;
  reviews?: Reviews[];
}

const ReviewTab: React.FC<ReviewTabProps> = ({ productId, reviews = [] }) => {
  // Function to render star ratings
  const renderStarRating = (rating: number = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <div key={i} className={`rating-label ${i > rating ? '' : 'checked'}`}>
          <i className={`ki-solid ki-star fs-6`}></i>
        </div>
      );
    }
    return stars;
  };

  // Function to format date
  const formatDate = (dateString: string = '') => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div 
      className="tab-pane fade" 
      id="kt_ecommerce_add_product_reviews" 
      role="tab-panel"
    >
      <div className="d-flex flex-column gap-7 gap-lg-10">
        <div className="card card-flush py-4">
          <div className="card-header">
            <div className="card-title">
              <h2>Product Reviews</h2>
            </div>
          </div>
          <div className="card-body pt-0">
            <table className="table align-middle table-row-dashed fs-6 gy-5" id="kt_ecommerce_product_reviews">
              <thead>
                <tr className="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                  <th className="min-w-175px">Rating</th>
                  <th className="min-w-100px text-end">Date</th>
                </tr>
              </thead>
              <tbody className="fw-semibold text-gray-600">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <tr key={review.id}>
                      <td data-order={`rating-${review.rating}`}>
                        <div className="rating justify-content-start">
                          {renderStarRating(review.rating)}
                        </div>
                        <div className="mt-3">
                          <span className="fw-bold text-gray-800 cursor-pointer">
                            Order #{review.order_id}
                            {review.customer && (
                              <span className="ms-2 text-gray-600">
                                by {review.customer.f_name} {review.customer.l_name}
                              </span>
                            )}
                          </span>
                          <p className="text-gray-600 fs-7 mt-1">{review.comment}</p>
                          {review.attachment_full_url && review.attachment_full_url.length > 0 && (
                            <div className="mt-2">
                              {review.attachment_full_url.map((url, index) => (
                                <img 
                                  key={index}
                                  src={typeof url === 'string' ? url : url.path || ''}
                                  alt={`Review attachment ${index + 1}`}
                                  className="h-50px me-2 mb-2"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="text-end">
                        <span className="fw-bold">{formatDate(review.created_at)}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center">
                      <span className="text-gray-500">No reviews available</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewTab; 