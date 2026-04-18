export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'PARENT' | 'SELLER' | 'VET' | 'ADMIN'
          full_name: string | null
          avatar_url: string | null
          contact_email: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'PARENT' | 'SELLER' | 'VET' | 'ADMIN'
          full_name?: string | null
          avatar_url?: string | null
          contact_email?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'PARENT' | 'SELLER' | 'VET' | 'ADMIN'
          full_name?: string | null
          avatar_url?: string | null
          contact_email?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      pets: {
        Row: {
          id: string
          owner_id: string
          name: string
          species: 'Dog' | 'Cat' | 'Bird' | 'Fish' | 'Small Pet' | 'Reptile'
          breed: string | null
          age: string | null
          sex: 'Male' | 'Female' | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          species: 'Dog' | 'Cat' | 'Bird' | 'Fish' | 'Small Pet' | 'Reptile'
          breed?: string | null
          age?: string | null
          sex?: 'Male' | 'Female' | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          species?: 'Dog' | 'Cat' | 'Bird' | 'Fish' | 'Small Pet' | 'Reptile'
          breed?: string | null
          age?: string | null
          sex?: 'Male' | 'Female' | null
          image_url?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          seller_id: string | null
          name: string
          brand: string | null
          category: string | null
          price: number
          stock_quantity: number
          details: Json
          created_at: string
        }
        Insert: {
          id?: string
          seller_id?: string | null
          name: string
          brand?: string | null
          category?: string | null
          price: number
          stock_quantity?: number
          details?: Json
          created_at?: string
        }
        Update: {
          id?: string
          seller_id?: string | null
          name?: string
          brand?: string | null
          category?: string | null
          price?: number
          stock_quantity?: number
          details?: Json
          created_at?: string
        }
      }
      pet_listings: {
        Row: {
          id: string
          seller_id: string
          name: string
          species: 'Dog' | 'Cat' | 'Bird' | 'Fish' | 'Small Pet' | 'Reptile'
          breed: string | null
          age: string | null
          sex: 'Male' | 'Female' | null
          price: number
          type: 'Buy' | 'Adopt' | 'Rehome'
          certification_tier: 'Gold' | 'Silver' | 'Verified' | 'Shelter'
          status: 'Available' | 'Pending' | 'Sold'
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          name: string
          species: 'Dog' | 'Cat' | 'Bird' | 'Fish' | 'Small Pet' | 'Reptile'
          breed?: string | null
          age?: string | null
          sex?: 'Male' | 'Female' | null
          price: number
          type: 'Buy' | 'Adopt' | 'Rehome'
          certification_tier?: 'Gold' | 'Silver' | 'Verified' | 'Shelter'
          status?: 'Available' | 'Pending' | 'Sold'
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          name?: string
          species?: 'Dog' | 'Cat' | 'Bird' | 'Fish' | 'Small Pet' | 'Reptile'
          breed?: string | null
          age?: string | null
          sex?: 'Male' | 'Female' | null
          price?: number
          type?: 'Buy' | 'Adopt' | 'Rehome'
          certification_tier?: 'Gold' | 'Silver' | 'Verified' | 'Shelter'
          status?: 'Available' | 'Pending' | 'Sold'
          image_url?: string | null
          created_at?: string
        }
      }
    }
  }
}
