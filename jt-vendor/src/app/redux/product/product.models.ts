// All data models for the product feature

export interface ProductModel {
    total_size?: number;
    limit?: number;
    offset?: number;
    products?: Product[];
  }
  
  export interface Product {
    quantity: number;
    id?: number;
    added_by?: string;
    user_id?: number;
    name?: string | string[];
    slug?: string;
    product_type?: string;
    code?: string;
    brand_id?: number;
    category_ids?: CategoryIds[];
    category_id?: number;
    sub_category_id?: number | null;
    sub_sub_category_id?: number | null;
    unit?: string;
    min_qty?: number;
    refundable?: number;
    images?: string[] | string;
    color_image?: string;
    thumbnail?: string;
    thumbnail_storage_type?: string;
    featured?: number;
    flash_deal?: string | null;
    video_provider?: string;
    video_url?: string | null;
    colors?: ProductColors[];
    colors_active?: boolean;
    variant_product?: number;
    attributes?: number[];
    choice_options?: ChoiceOptions[];
    variation?: Variation[];
    variant?: string;
    weight?: number | string;
    width?: number | string;
    height?: number | string;
    length?: number | string;
    lang?: string[];
    choice?: string[];
    choice_no?: number[];
    
    // Variant specific properties
    variant_id?: number;
    variant_type?: string;
    price?: number;
    sku?: string;
    
    digital_product_file_types?: string[];
    digital_product_extensions?: { [key: string]: string[] };
    published?: number;
    unit_price?: number;
    purchase_price?: number;
    tax?: number;
    tax_model?: string;
    tax_type?: string;
    discount?: number;
    discount_type?: string;
    current_stock?: number;
    description?: string;
    details?: string | string[] | { [key: string]: string };
    free_shipping?: number;
    attachment?: string | null;
    created_at?: string;
    updated_at?: string;
    status?: number;
    featured_status?: number;
    request_status?: number;
    rating?: Rating[];
    meta_title?: string | null;
    meta_description?: string | null;
    meta_image?: string;
    meta_index?: string;
    meta_no_follow?: string;
    denied_note?: string | null;
    shipping_cost?: number;
    multiply_qty?: number;
    multiply_with_quantity?: number;
    minimum_order_qty?: number;
    temp_shipping_cost?: number | null;
    is_shipping_cost_updated?: number | null;
    digital_product_type?: string | null;
    digital_file_ready?: string;
    digital_file_ready_storage_type?: string;
    reviews_count?: number;
    average_review?: string;
    reviews?: Reviews[];
    tags?: Tags[];
    meta_seo_info?: MetaSeoInfo;
    digital_variation?: DigitalVariation[];
    translations?: any[];
    is_shop_temporary_close?: number;
    thumbnail_full_url?: ImageFullUrl;
    color_images_full_url?: any[];
    meta_image_full_url?: ImageFullUrl;
    images_full_url?: ImageFullUrl[];
    digital_file_ready_full_url?: ImageFullUrl;
  }
  
  export interface ImageFullUrl {
    key: string;
    path: string | null;
    status: number;
  }
  
  export interface DigitalVariation {
    id?: number;
    product_id?: number;
    variant_key?: string;
    sku?: string;
    price?: number;
    file?: string;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface CategoryIds {
    id?: string;
    position?: number;
  }
  
  export interface ProductColors {
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
  
  export interface Rating {
    average?: string;
    product_id?: number;
    attachment_full_url?: any[];
  }
  
  export interface Reviews {
    id?: number;
    product_id?: number;
    customer_id?: number;
    delivery_man_id?: number | null;
    order_id?: number;
    comment?: string;
    attachment?: any[] | string;
    rating?: number;
    status?: number;
    is_saved?: boolean;
    created_at?: string;
    updated_at?: string;
    customer?: Customer;
    attachment_full_url?: any[];
  }
  
  export interface Customer {
    id?: number;
    f_name?: string;
    l_name?: string;
    phone?: string;
    image?: string;
    email?: string;
  }
  
  export interface Tags {
    id?: number;
    tag?: string;
  }
  
  export interface MetaSeoInfo {
    meta_id?: number;
    meta_product_id?: number;
    meta_title?: string;
    meta_description?: string;
    meta_index?: string;
    meta_no_follow?: string;
    meta_no_image_index?: string;
    meta_no_archive?: string;
    meta_no_snippet?: string;
    meta_max_snippet?: string;
    meta_max_snippet_value?: string;
    meta_max_video_preview?: string;
    meta_max_video_preview_value?: string;
    meta_max_image_preview?: string;
    meta_max_image_preview_value?: string;
    meta_image?: string;
    meta_created_at?: string;
    meta_updated_at?: string;
  }
  
  export interface StockLimitStatus {
    status?: string;
    product_count?: number;
    product?: Product;
  }
  
  export interface TopSellingProductModel {
    total_size?: number;
    limit?: string;
    offset?: string;
    products?: Products[];
  }
  
  export interface Products {
    product_id?: number;
    count?: string;
    product?: Product;
    digital_file_after_sell_full_url?: ImageFullUrl;
    storage?: any[];
  }
  