import { Database } from './supabase';

export type ProductRow = Database['public']['Tables']['products']['Row'];
export type PetListingRow = Database['public']['Tables']['pet_listings']['Row'];
export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type VetDetailRow = Database['public']['Tables']['veterinarian_details']['Row'];

export interface ProductDetails {
  image: string;
  rating: number;
  reviewsCount: number;
  species: string[];
  tags: string[];
  description: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  originalPrice?: number;
  expiryDate?: string;
  subscribeDiscountPercent?: number;
}

export interface Product extends Omit<ProductRow, 'details'> {
  details: ProductDetails;
  inStock: boolean; // derived from stock_quantity > 0
}

export interface PetListing extends PetListingRow {
  seller?: ProfileRow;
}

export interface Vet extends ProfileRow {
  details: VetDetailRow;
}

export interface CartItem {
  productId: string;
  quantity: number;
  isSubscription?: boolean;
  product?: Product;
}

export type OrderStatus = Database['public']['Enums']['order_status'];

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: { product: Product; quantity: number }[];
}
