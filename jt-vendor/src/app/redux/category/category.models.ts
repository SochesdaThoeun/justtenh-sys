// Category models

/**
 * Category image URL structure
 * Contains paths and storage details for the category image
 */
export interface CategoryImageFullUrl {
  key: string;
  path: string;
  status: number;
}

/**
 * Category translation interface
 * Supports multilingual category names and descriptions
 */
export interface CategoryTranslation {
  id?: number;
  category_id?: number;
  name?: string;
  description?: string;
  lang?: string;
}

/**
 * Single category interface
 * Represents a complete category with all its data
 */
export interface Category {
  id: number;
  name: string;
  image: string;
  image_storage_type: string;
  image_alt_text: string | null;
  home_status: number; // 1 = active, 0 = inactive
  created_at: string;
  updated_at: string;
  image_full_url: CategoryImageFullUrl;
  icon_full_url: CategoryImageFullUrl;
  translations: CategoryTranslation[];
}

/**
 * Categories state interface
 * Used in Redux to store the complete category state
 */
export interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}
