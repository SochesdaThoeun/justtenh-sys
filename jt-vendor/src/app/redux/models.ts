// Unified models file - imports and exports all models from across the redux folder

// Import and re-export auth models
export type {
  LoginModel,
  RegisterModel,
  AuthResponse,
  PasswordResetResponse
} from './auth/auth.models';

// Import and re-export product models
export type {
  ProductModel,
  Product,
  DigitalVariation,
  CategoryIds,
  ProductColors,
  ChoiceOptions,
  Variation,
  Rating,
  Reviews,
  Customer,
  Tags,
  MetaSeoInfo,
  StockLimitStatus,
  TopSellingProductModel,
  Products
} from './product/product.models';

// Import and re-export category models
export type {
  Category,
  CategoryImageFullUrl,
  CategoryTranslation,
  CategoryState
} from './category/category.models';

// Import and re-export vendor models
export type {
  VendorBody,
  ImageFullUrl,
  Wallet,
  DashboardData,
  VendorInfoModel,
  MethodFields,
  WithdrawModel,
  VendorResponse,
  DeleteAccountResponse
} from './vendor/vendor.models';

// Import and re-export order models
export type {
  BusinessAnalyticsFilterDataModel,
  OrderModel,
  Order,
  BillingAddressData,
  ShippingAddressData,
  Shipping,
  OfflinePayments,
  PaymentInfo,
  PlaceDetailsModel,
  Result,
  AddressComponents,
  Geometry,
  Location,
  Viewport,
  Photos,
  PredictionModel,
  DeliveryMan,
  OrderDetailsModel,
  VerificationImages,
  ProductDetails,
  Colores
} from './order/order.models';

// Import and re-export bank models
export type {
  BankInfoBody,
  BankInfoData,
  BankInfoResponse,
  UpdateBankResponse
} from './bank/bank.models';

// Import and re-export review models
export type {
  Review,
  ReviewCustomer,
  ReviewResponse,
  ImageFullUrl as ReviewImageFullUrl
} from './review/review.models';

// Import and re-export customer models
export type {
  CustomerModel,
  CustomerImageFullUrl,
  CustomerStorage,
  CustomersResponse
} from './customer/customer.models';

// Import and re-export POS models
export type {
  PosState,
  PosResponse
} from './pos/pos.models';

// Import and re-export chat models
export type {
  ChatListModel,
  ChatMessageModel,
  ChatMessage,
  ChatList,
  ChatCustomer,
  ChatSellerData,
  ImageFullUrl as ChatImageFullUrl,
  Storage as ChatStorage
} from './chat/chat.model';

// Import and re-export statistics models
export type {
  SalesChartParams,
  SalesChartResponse,
  CustomerOrdersParams,
  CustomerOrderStats,
  CustomerOrdersResponse,
  OrdersPerDayParams,
  OrdersPerDayStats,
  OrdersPerDayResponse,
  ShippingCostParams,
  ShippingCostStats,
  ShippingCostResponse,
  ReturnOrdersParams,
  ReturnOrderStats,
  ReturnOrdersResponse,
  ProductPerformanceParams,
  ProductPerformanceStats,
  ProductPerformanceResponse,
  StatisticState
} from './statistic/statistic.models';

// Add these interfaces to fix import errors
export interface MonthlyOrdersResponse {
  data: number[];
}

export interface EarningStatisticsResponse {
  seller_earn: number[];
  commission_earn: number[];
}

// Shop info interfaces
export interface ShopInfoModel {
  id: number;
  name: string;
  logo: string;
  address: string;
  contact: string;
  image: string;
  banner: string;
  [key: string]: any;
}

export interface ShopInfoResponse {
  data: ShopInfoModel;
  status: boolean;
  message?: string;
}
