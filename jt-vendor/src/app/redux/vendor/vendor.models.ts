export interface VendorBody {
  _method?: string;
  f_name?: string;
  l_name?: string;
  bank_name?: string;
  branch?: string;
  account_no?: string;
  holder_name?: string;
  password?: string;
  image?: File | null;
  cm_firebase_token?: string;
  pos_status?: number;
  minimum_order_amount?: number;
  free_delivery_status?: number;
  free_delivery_over_amount?: number;
  app_language?: string;
  free_delivery_features_status?: number;
  free_delivery_responsibility?: string;
  minimum_order_amount_by_seller?: number;
  phone?: string;
  email?: string;
}

export interface ImageFullUrl {
  key: string;
  path: string;
  status: number;
}

export interface Wallet {
  id?: number;
  seller_id?: number;
  total_earning?: number;
  withdrawn?: number;
  created_at?: string;
  updated_at?: string;
  commission_given?: number;
  pending_withdraw?: number;
  delivery_charge_earned?: number;
  collected_cash?: number;
  total_tax_collected?: number;
}

export interface DashboardData {
  orderStatus: {
    pending: number;
    confirmed: number;
    processing: number;
    out_for_delivery: number;
    delivered: number;
    canceled: number;
    returned: number;
    failed: number;
  };
  products_count: number;
  orders_count: number;
  total_earning: number;
  withdrawn: number;
  pending_withdraw: number;
  admin_commission: number;
  delivery_charge_earned: number;
  collected_cash: number;
  total_tax_collected: number;
}

export interface VendorInfoModel {
  id?: number;
  f_name?: string;
  l_name?: string;
  phone?: string;
  image?: string;
  image_full_url?: ImageFullUrl;
  email?: string;
  password?: string;
  status?: string;
  remember_token?: string;
  created_at?: string;
  updated_at?: string;
  bank_name?: string;
  branch?: string;
  account_no?: string;
  holder_name?: string;
  auth_token?: string;
  sales_commission_percentage?: number | null;
  gst?: string | null;
  cm_firebase_token?: string;
  pos_status?: number;
  minimum_order_amount?: number;
  free_delivery_status?: number;
  free_delivery_over_amount?: number;
  app_language?: string;
  product_count?: number;
  orders_count?: number;
  free_delivery_features_status?: number;
  free_delivery_responsibility?: string;
  minimum_order_amount_by_seller?: number;
  wallet?: Wallet;
  storage?: any[];
  vendorEarning?: number[];
  commissionEarn?: number[];
  labels?: string[];
  dateType?: string;
  dashboardData?: DashboardData;
  monthlyOrders?: number[];
  recentOrders?: any[];
}

export interface MethodFields {
  input_type?: string;
  input_name?: string;
  placeholder?: string;
  is_required?: number;
}

export interface WithdrawModel {
  id?: number;
  method_name?: string;
  method_fields?: MethodFields[];
  is_default?: boolean;
  is_active?: number;
  created_at?: string;
  updated_at?: string;
}

export interface VendorResponse {
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
  product_count: number;
  orders_count: number;
  free_delivery_features_status: number;
  free_delivery_responsibility: string;
  minimum_order_amount_by_seller: number;
  image_full_url: ImageFullUrl;
  wallet: Wallet;
  storage: any[];
  vendorEarning: number[];
  commissionEarn: number[];
  labels: string[];
  dateType: string;
  dashboardData: DashboardData;
  success: boolean;
  message: string;
  data: VendorInfoModel;
}

export interface DeleteAccountResponse {
  success: boolean;
  message: string;
}

export interface MonthlyOrdersResponse {
  data: number[];
}

export interface EarningStatisticsResponse {
  seller_earn: number[];
  commission_earn: number[];
}

export interface ShopInfoModel {
  id: number;
  seller_id: number;
  name: string;
  slug: string;
  address: string;
  contact: string;
  image: string;
  image_storage_type: string;
  bottom_banner: string;
  bottom_banner_storage_type: string;
  offer_banner: string | null;
  offer_banner_storage_type: string;
  vacation_start_date: string | null;
  vacation_end_date: string | null;
  vacation_note: string | null;
  vacation_status: boolean;
  temporary_close: boolean;
  created_at: string;
  updated_at: string;
  banner: string;
  banner_storage_type: string;
  rating: number;
  rating_count: number;
  image_full_url: ImageFullUrl;
  bottom_banner_full_url: ImageFullUrl;
  offer_banner_full_url: ImageFullUrl;
  banner_full_url: ImageFullUrl;
  minimum_order_amount?: number;
  free_delivery_status?: boolean;
  free_delivery_over_amount?: number;
}

export interface ShopInfoResponse {
  success?: boolean;
  message?: string;
  data?: ShopInfoModel;
}

export interface VacationModeData {
  status: boolean;
  startDate: string;
  endDate: string;
  note: string;
}

export interface LanguageChangeResponse {
  message: string;
}

export interface TemporaryCloseResponse {
  status: boolean;
}

export interface VacationModeResponse {
  status: boolean;
}
