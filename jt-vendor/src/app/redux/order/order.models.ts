// All TypeScript interfaces for the Order feature

export interface BusinessAnalyticsFilterDataModel {
    pending?: number;
    confirmed?: number;
    processing?: number;
    outForDelivery?: number;
    delivered?: number;
    canceled?: number;
    returned?: number;
    failed?: number;
}
  
export interface OrderModel {
    total_size: number;
    limit?: number;
    offset?: number;
    orders?: Order[];
    customers?: Customer[]; // new field to hold customer list
}
  
// Merged Order interface
export interface Order {
    id: number; // from duplicate definitions, id is required
    customer_id?: number;
    customer_type?: string;
    payment_status?: string;
    order_status?: string;
    payment_method?: string;
    transaction_ref?: string;
    order_amount?: number;
    shipping_address_data?: ShippingAddressData;
    billing_address_data?: BillingAddressData;
    shipping_cost?: number;
    created_at?: string;
    updated_at?: string;
    discount_amount?: number;
    discount_type?: string;
    customer?: Customer;
    delivery_man_id?: number;
    order_note?: string;
    order_type?: string;
    shipping?: Shipping;
    extra_discount?: number;
    extra_discount_type?: string;
    delivery_type?: string;
    third_party_service_name?: string;
    third_party_tracking_id?: string;
    deliveryman_charge?: number;
    expected_delivery_date?: string;
    delivery_man?: DeliveryMan;
    offline_payments?: OfflinePayments;
    t_ref?: string;
    payment_by?: string;
    payment_note?: string;
    is_guest?: boolean;
    verification_code?: string;
    total_product_price?: number;
    total_product_discount?: number;
    total_tax_amount?: number;
    order_details?: OrderDetailsModel[];
    shipping_method_id?: string;
    delivery_service_name?: string;
    third_party_delivery_tracking_id?: string;
}
  
// Updated Customer model based on API response
export interface Customer {
    id: number;
    name: string | null;
    f_name: string | null;
    l_name: string | null;
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
    image_full_url: {
      key: string;
      path: string | null;
      status: number;
    };
    storage: any[];
}
  
// Merged ImageFullUrl interface
export interface ImageFullUrl {
    url: string;
}
  
export interface BillingAddressData {
    id?: number;
    contact_person_name?: string;
    addressType?: string;
    address?: string;
    state?: string;
    city?: string;
    zip?: string;
    phone?: string;
    email?: string;
    createdAt?: string;
    updatedAt?: string;
    country?: string;
    latitude?: string;
    longitude?: string;
}

export interface ShippingAddressData {
    id?: number;
    contact_person_name?: string;
    addressType?: string;
    address?: string;
    state?: string;
    city?: string;
    zip?: string;
    phone?: string;
    email?: string;
    createdAt?: string;
    updatedAt?: string;
    country?: string;
    latitude?: string;
    longitude?: string;
}
  
export interface Shipping{
    id?: number;
    creatorId?: number;
    creatorType?: string;
    title?: string;
    cost?: number;
    duration?: string;
    status?: number;
    createdAt?: string;
    updatedAt?: string;
}
  
export interface OfflinePayments {
    id?: number;
    infoKey?: string[];
    infoValue?: string[];
    createdAt?: string;
}
  
export interface PaymentInfo {
    methodId?: string;
    methodName?: string;
    transactionId?: string;
    accountNumber?: string;
    accountHolderName?: string;
}
  
export interface PlaceDetailsModel {
    result?: Result;
    status?: string;
}
  
export interface Result {
    addressComponents?: AddressComponents[];
    adrAddress?: string;
    formattedAddress?: string;
    geometry?: Geometry;
    icon?: string;
    iconBackgroundColor?: string;
    iconMaskBaseUri?: string;
    name?: string;
    photos?: Photos[];
    placeId?: string;
    reference?: string;
    types?: string[];
    url?: string;
    utcOffset?: number;
    website?: string;
}
  
export interface AddressComponents {
    longName?: string;
    shortName?: string;
    types?: string[];
}
  
export interface Geometry {
    location?: Location;
    viewport?: Viewport;
}
  
export interface Location {
    lat?: number;
    lng?: number;
}
  
export interface Viewport {
    northeast?: Location;
    southwest?: Location;
}
  
export interface Photos {
    height?: number;
    htmlAttributions?: string[];
    photoReference?: string;
    width?: number;
}
  
export interface PredictionModel {
    description?: string;
    id?: string;
    distanceMeters?: number;
    placeId?: string;
    reference?: string;
}
  
// Additional placeholder interfaces
export interface DeliveryMan {
    id?: number;
    name?: string;
}
  
// Merged OrderDetailsModel interface
export interface OrderDetailsModel {
    id?: number;
    order_id?: number;
    product_id?: number;
    seller_id?: number;
    digital_file_after_sell?: string;
    product_details?: ProductDetails;
    qty?: number;
    product_name?: string;
    quantity?: number;
    price?: number;
    tax?: number;
    discount?: number;
    tax_model?: string;
    delivery_status?: string;
    payment_status?: string;
    created_at?: string;
    updated_at?: string;
    shipping_method_id?: string;
    variant?: string;
    variation?: string;
    discount_type?: string;
    refund_request?: number;
    verification_images?: VerificationImages[];
    digital_file_after_sell_full_url?: ImageFullUrl;
    digital_file_ready_full_url?: ImageFullUrl;
    order?: Order;
    histories?: OrderHistory[];
    is_stock_decreased?: number;
    product_all_status?: ProductAllStatus;
    storage?: any[];
}
  
export interface VerificationImages {
    id?: number;
    orderId?: number;
    image?: string;
    imageFullUrl?: ImageFullUrl;
    createdAt?: string;
    updatedAt?: string;
}
  
export interface DigitalVariation {
    id?: number;
    productId?: number;
    variantKey?: string;
    sku?: string;
    price?: number;
    file?: string;
    createdAt?: string;
    updatedAt?: string;
}
  
export interface ProductDetails {
    id?: number;
    addedBy?: string;
    userId?: number;
    name?: string;
    productType?: string;
    categoryIds?: CategoryIds[];
    brandId?: number;
    unit?: string;
    minQty?: number;
    images?: string[];
    thumbnail?: string;
    colors?: Colores[];
    choiceOptions?: ChoiceOptions[];
    variation?: Variation[];
    unitPrice?: number;
    purchasePrice?: number;
    tax?: number;
    taxModel?: string;
    taxType?: string;
    discount?: number;
    discountType?: string;
    currentStock?: number;
    details?: string;
    freeShipping?: number;
    createdAt?: string;
    updatedAt?: string;
    digitalProductType?: string;
    digitalFileReady?: string;
    thumbnailFullUrl?: ImageFullUrl;
    digitalVariation?: DigitalVariation[];
    digitalFileReadyFullUrl?: ImageFullUrl;
}
  
export interface CategoryIds {
    id: string;
    position?: number;
}
  
export interface Colores {
    name?: string;
    code?: string;
}
  
export interface ChoiceOptions {
    name?: string;
    title?: string;
    options?: string[];
}
  
export interface Variation {
    type?: string;
    price?: number;
    sku?: string;
    qty?: number;
}

export interface OrderHistory {
    id?: number;
    order_id?: number;
    user_id?: number;
    user_type?: string;
    status?: string;
    cause?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface ProductAllStatus {
    id?: number;
    added_by?: string;
    user_id?: number;
    name?: string;
    slug?: string;
    product_type?: string;
    category_ids?: string | any[];
    category_id?: number;
    sub_category_id?: number | null;
    sub_sub_category_id?: number | null;
    brand_id?: number;
    unit?: string;
    min_qty?: number;
    refundable?: number;
    digital_product_type?: string | null;
    digital_file_ready?: string;
    digital_file_ready_storage_type?: string;
    images?: string | any[];
    color_image?: string | any[];
    thumbnail?: string;
    thumbnail_storage_type?: string;
    featured?: number;
    flash_deal?: string | null;
    video_provider?: string;
    video_url?: string | null;
    colors?: string | any[];
    variant_product?: number;
    attributes?: string | any[];
    choice_options?: string | any[];
    variation?: string | any[];
    digital_product_file_types?: any[];
    digital_product_extensions?: any[];
    published?: number;
    unit_price?: number;
    purchase_price?: number;
    tax?: number;
    tax_type?: string;
    tax_model?: string;
    discount?: number;
    discount_type?: string;
    current_stock?: number;
    minimum_order_qty?: number;
    details?: string;
    free_shipping?: number;
    attachment?: string | null;
    created_at?: string;
    updated_at?: string;
    status?: number;
    featured_status?: number;
    meta_title?: string | null;
    meta_description?: string | null;
    meta_image?: string;
    request_status?: number;
    denied_note?: string | null;
    shipping_cost?: number;
    multiply_qty?: number;
    temp_shipping_cost?: string | null;
    is_shipping_cost_updated?: string | null;
    code?: string;
    is_shop_temporary_close?: number;
    thumbnail_full_url?: ImageFullUrl | {
        key: string;
        path: string | null;
        status: number;
    };
    color_images_full_url?: any[];
    meta_image_full_url?: {
        key: string;
        path: string | null;
        status: number;
    };
    images_full_url?: {
        key: string;
        path: string | null;
        status: number;
    }[];
    digital_file_ready_full_url?: {
        key: string;
        path: string | null;
        status: number;
    };
    translations?: any[];
    reviews?: ProductReview[];
}

export interface ProductReview {
    id?: number;
    product_id?: number;
    customer_id?: number;
    delivery_man_id?: number | null;
    order_id?: number;
    comment?: string;
    attachment?: any[];
    rating?: number;
    status?: number;
    is_saved?: boolean;
    created_at?: string;
    updated_at?: string;
    attachment_full_url?: any[];
}
