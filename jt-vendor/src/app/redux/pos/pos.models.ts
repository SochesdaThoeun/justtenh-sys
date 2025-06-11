import { Category } from '../category/category.models';
import { Product, ProductModel } from '../product/product.models';

export interface PosState {
  categories: Category[];
  products: PosProductsResponse;
  loading: boolean;
  error: string | null;
  orderSubmitting: boolean;
  orderSubmitError: string | null;
  orderSubmitSuccess: boolean;
  createdOrderId: number | null;
}

export interface PosResponse {
  data: Category[];
}

// This interface includes properties needed for POS products
export interface PosProduct {
  // Base product properties
  id?: number;
  name?: string | string[];
  slug?: string;
  code?: string;
  unit?: string;
  unit_price?: number;
  purchase_price?: number;
  tax?: number;
  tax_model?: string;
  discount?: number;
  discount_type?: string;
  current_stock?: number;
  minimum_order_qty?: number;
  thumbnail?: string;
  category_ids?: Array<{id?: string; position?: number}>;
  variation?: Array<{type?: string; price?: number; sku?: string; qty?: number}>;
  rating?: Array<{average?: string; product_id?: number}>;
  
  // POS specific properties
  thumbnail_full_url: {
    key: string;
    path: string;
    status: number;
  };
  color_images_full_url: any[];
  meta_image_full_url: {
    key: string | null;
    path: string | null;
    status: number;
  };
  images_full_url: Array<{
    key: string;
    path: string;
    status: number;
  }>;
  digital_file_ready_full_url: {
    key: string | null;
    path: string | null;
    status: number;
  };
  
  // Additional properties as needed
  [key: string]: any;
}

export interface PosProductsResponse {
  total_size: number;
  limit: string;
  offset: string;
  products: PosProduct[];
}
