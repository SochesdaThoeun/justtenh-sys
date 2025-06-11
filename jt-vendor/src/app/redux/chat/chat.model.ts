// Chat models definitions

// Common image types
export interface ImageFullUrl {
  key: string;
  path: string | null;
  status: number;
}

// Chat attachment model
export interface ChatAttachment {
  type: string;
  key: string;
  path: string;
  size: string;
}

export interface Storage {
  // Define storage properties if needed
}

// Customer in chat
export interface ChatCustomer {
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
  image_full_url: ImageFullUrl;
  storage: Storage[];
}

// Seller data
export interface ChatSellerData {
  id: number;
  f_name: string;
  l_name: string;
  phone: string;
  image: string;
  email: string;
  password: string;
  status: string;
  remember_token: string;
  created_at: string;
  updated_at: string;
  bank_name: string;
  branch: string;
  account_no: string;
  holder_name: string;
  auth_token: string;
  sales_commission_percentage: number | null;
  gst: string | null;
  cm_firebase_token: string;
  pos_status: number;
  minimum_order_amount: number;
  free_delivery_status: number;
  free_delivery_over_amount: number;
  app_language: string;
  image_full_url: ImageFullUrl;
  storage: Storage[];
}

// Chat message
export interface ChatMessage {
  id: number;
  user_id: number;
  seller_id: number;
  admin_id: number | null;
  delivery_man_id: number | null;
  message: string;
  attachment: ChatAttachment[] | string;
  sent_by_customer: boolean;
  sent_by_seller: boolean;
  sent_by_admin: boolean | null;
  sent_by_delivery_man: boolean | null;
  seen_by_customer: boolean;
  seen_by_seller: boolean;
  seen_by_admin: boolean | null;
  seen_by_delivery_man: boolean | null;
  status: boolean;
  notification_receiver: string;
  seen_notification: boolean;
  created_at: string;
  updated_at: string;
  shop_id: number;
  customer: ChatCustomer;
}

// For chat list message with unseen count
export interface ChatList extends ChatMessage {
  unseen_message_count: number;
}

// Chat list response model
export interface ChatListModel {
  data: ChatSellerData;
  total_size: number;
  limit: string;
  offset: string;
  chat: ChatList[];
}

// Chat message response model
export interface ChatMessageModel {
  data: ChatSellerData;
  total_size: number;
  limit: string;
  offset: string;
  message: ChatMessage[];
}
