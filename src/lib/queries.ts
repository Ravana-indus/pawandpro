import { createClient } from './supabase/server';
import { Product, PetListing, Vet, ProductDetails } from '@/types/models';

export async function getProducts(options: { 
  category?: string; 
  species?: string; 
  search?: string;
  limit?: number;
} = {}) {
  const supabase = await createClient();
  let query = supabase.from('products').select('*');

  if (options.category) query = query.eq('category', options.category);
  if (options.species) query = query.contains('details->species', [options.species]);
  if (options.search) query = query.ilike('name', `%${options.search}%`);
  if (options.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map(row => ({
    ...row,
    details: row.details as unknown as ProductDetails,
    inStock: row.stock_quantity > 0
  })) as Product[];
}

export async function getProductById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;

  return {
    ...data,
    details: data.details as unknown as ProductDetails,
    inStock: data.stock_quantity > 0
  } as Product;
}

export async function getPetListings(options: {
  species?: string;
  type?: 'Buy' | 'Adopt' | 'Rehome';
  limit?: number;
} = {}) {
  const supabase = await createClient();
  let query = supabase
    .from('pet_listings')
    .select('*, seller:profiles(*)');

  if (options.species) query = query.eq('species', options.species);
  if (options.type) query = query.eq('type', options.type);
  if (options.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map(row => ({
    ...row,
    image: row.image_url // map DB column to UI property if necessary, though PetListing model used DB names mostly
  })) as unknown as PetListing[];
}

export async function getPetListingById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('pet_listings')
    .select('*, seller:profiles(*)')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as unknown as PetListing;
}

export async function getVets() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*, details:veterinarian_details(*)')
    .eq('role', 'VET');

  if (error) throw error;
  
  return (data || []).map(row => ({
    ...row,
    details: row.details[0] // veterinarian_details is a 1:1 relation but returned as array in join
  })) as unknown as Vet[];
}

export async function getVetById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*, details:veterinarian_details(*)')
    .eq('id', id)
    .eq('role', 'VET')
    .single();

  if (error) return null;
  return {
    ...data,
    details: data.details[0]
  } as unknown as Vet;
}

export async function searchAll(query: string) {
  const supabase = await createClient();
  
  const [productsRes, petsRes, vetsRes] = await Promise.all([
    supabase.from('products').select('*').ilike('name', `%${query}%`).limit(5),
    supabase.from('pet_listings').select('*').ilike('name', `%${query}%`).limit(5),
    supabase.from('profiles').select('*, details:veterinarian_details(*)').eq('role', 'VET').ilike('full_name', `%${query}%`).limit(5)
  ]);

  return {
    products: (productsRes.data || []).map(row => ({
      ...row,
      details: row.details as unknown as ProductDetails,
      inStock: row.stock_quantity > 0
    })) as Product[],
    pets: (petsRes.data || []) as unknown as PetListing[],
    vets: (vetsRes.data || []).map(row => ({
      ...row,
      details: row.details[0]
    })) as unknown as Vet[]
  };
}
export async function getUserPets() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('owner_id', user.id);

  if (error) throw error;
  return data as any[];
}
