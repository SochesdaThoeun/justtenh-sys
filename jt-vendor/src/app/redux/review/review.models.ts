// Review models

// Import types used in reviews
import { 
  Product, 
  CategoryIds, 
  ChoiceOptions, 
  Variation 
} from '../product/product.models';

// Customer data in review
export interface ReviewCustomer {
  id: number;
  name: string;
  f_name: string;
  l_name: string;
  phone: string;
  image: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  street_address: string | null;
  country: string | null;
  city: string | null;
  zip: string | null;
  house_no: string | null;
  apartment_no: string | null;
  cm_firebase_token: string | null;
  is_active: boolean;
  payment_card_last_four: string | null;
  payment_card_brand: string | null;
  payment_card_fawry_token: string | null;
  login_medium: string | null;
  social_id: string | null;
  is_phone_verified: boolean;
  temporary_token: string | null;
  is_email_verified: boolean;
  wallet_balance: number | null;
  loyalty_point: number | null;
  login_hit_count: number;
  is_temp_blocked: boolean;
  temp_block_time: string | null;
  referral_code: string;
  referred_by: string | null;
  app_language: string;
  image_full_url: {
    key: string;
    path: string | null;
    status: number;
  };
  storage: any[];
}

// Image URL object
export interface ImageFullUrl {
  key: string;
  path: string | null;
  status: number;
}

// Review model
export interface Review {
  id: number;
  product_id: number;
  customer_id: number;
  delivery_man_id: number | null;
  order_id: number;
  comment: string;
  attachment: any[];
  rating: number;
  status: number;
  is_saved: boolean;
  created_at: string;
  updated_at: string;
  attachment_full_url: any[];
  product?: Product;
  customer?: ReviewCustomer;
  reply?: any | null;
}

// Review response model
export interface ReviewResponse {
  total_size: number;
  limit: string;
  offset: string;
  reviews: Review[];
}
