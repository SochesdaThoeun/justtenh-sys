export interface CustomerImageFullUrl {
  key: string;
  path: string | null;
  status: number;
}

export interface CustomerStorage {
  // Define storage properties if needed
}

export interface CustomerOrderModel {
  id: number;
  customer_id: number;
  seller_id: number;
  status: string;
  order_status: string;
  total: string;
  order_amount: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerOrdersResponse {
  total: number;
  limit: number;
  offset: number;
  orders: CustomerOrderModel[];
}

export interface TransactionRow {
  orderNo: string;
  status: string;
  amount: string;
  rewards: string;
  date: string;
}

export interface CustomerModel {
  id: number;
  name: string | null;
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
  login_medium: string;
  social_id: string;
  is_phone_verified: boolean;
  temporary_token: string;
  is_email_verified: boolean;
  wallet_balance: number | null;
  loyalty_point: number | null;
  login_hit_count: number;
  is_temp_blocked: boolean;
  temp_block_time: string | null;
  referral_code: string;
  referred_by: string | null;
  app_language: string;
  image_full_url: CustomerImageFullUrl;
  storage: CustomerStorage[];
}

export interface CustomersResponse {
  total: number;
  limit: number;
  offset: number;
  customers: CustomerModel[];
}

export interface AddCustomerParams {
  f_name: string;
  l_name: string;
  email: string;
  phone?: string;
  country: string;
  city: string;
  zip_code: string;
  address: string;
}

export interface AddCustomerFormData extends AddCustomerParams {
  // Same as AddCustomerParams for now, can be extended if needed
}
