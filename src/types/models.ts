// Loosened types — the generated Database types are stale and don't include
// all tables (veterinarian_details, orders, order_items, etc.).
// These manual interfaces give us just enough structure for the UI layer
// while we rely on `as any` Supabase casts at the data-access boundary.

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

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock_quantity: number;
  details: ProductDetails;
  inStock: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PetListing {
  id: string;
  name: string;
  species: string;
  breed: string;
  sex: string;
  age: string;
  price: number;
  type: 'Buy' | 'Adopt' | 'Rehome';
  status: string;
  image_url?: string;
  certification_tier?: string;
  location?: string;
  seller_id?: string;
  seller?: any;
  created_at?: string;
  [key: string]: any; // allow additional fields
}

export interface VetDetails {
  specialization: string;
  slvc_number: string;
  slvc_registration?: string;
  experience_years: number;
  consultation_fee: number;
  rating: number;
  is_available_now: boolean;
  [key: string]: any;
}

export interface Vet {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  details: VetDetails;
  [key: string]: any;
}

export interface CartItem {
  productId: string;
  quantity: number;
  isSubscription?: boolean;
  product?: Product;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: { product: Product; quantity: number }[];
}
