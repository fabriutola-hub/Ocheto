import type { ProductCategory } from '@/types';

export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  long_description: string | null;
  price: number;
  image_url: string;
  color: string;
  tags: string[];
  origin: string | null;
  roast: 'light' | 'medium' | 'medium-dark' | 'dark' | null;
  notes: string[] | null;
  caffeine: 'normal' | 'high' | 'low' | 'none' | null;
  temperature: 'hot' | 'iced' | 'both' | null;
  bestseller: boolean;
  new: boolean;
  vegan: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BranchMenuItemRow {
  id: string;
  branch_id: string;
  section_title: string;
  section_subtitle: string | null;
  item_name: string;
  item_description: string | null;
  price_regular: number;
  price_grande: number | null;
  sort_order: number;
  image_url: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeaturedProductRow {
  id: string;
  product_id: string;
  position: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FavoriteRow {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface ProfileRow {
  id: string;
  email: string;
  role: 'customer' | 'admin';
  full_name: string | null;
  must_change_password: boolean;
  created_at: string;
  updated_at: string;
}
