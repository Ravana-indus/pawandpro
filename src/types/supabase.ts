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
        Relationships: [
          {
            foreignKeyName: "veterinarian_details_profile_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "veterinarian_details"
            referencedColumns: ["profile_id"]
          }
        ]
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          buyer_id: string | null
          total_amount: number
          status: 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          buyer_id?: string | null
          total_amount: number
          status?: 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          buyer_id?: string | null
          total_amount?: number
          status?: 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["order_id"]
          }
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string | null
          pet_listing_id: string | null
          quantity: number
          price_at_purchase: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id?: string | null
          pet_listing_id?: string | null
          quantity: number
          price_at_purchase: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string | null
          pet_listing_id?: string | null
          quantity?: number
          price_at_purchase?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_pet_listing_id_fkey"
            columns: ["pet_listing_id"]
            isOneToOne: false
            referencedRelation: "pet_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
      veterinarian_details: {
        Row: {
          profile_id: string
          specialization: string | null
          slvc_number: string | null
          experience_years: number | null
          consultation_fee: number | null
          is_verified: boolean | null
          is_available_now: boolean | null
          updated_at: string
        }
        Insert: {
          profile_id: string
          specialization?: string | null
          slvc_number?: string | null
          experience_years?: number | null
          consultation_fee?: number | null
          is_verified?: boolean | null
          is_available_now?: boolean | null
          updated_at?: string
        }
        Update: {
          profile_id?: string
          specialization?: string | null
          slvc_number?: string | null
          experience_years?: number | null
          consultation_fee?: number | null
          is_verified?: boolean | null
          is_available_now?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "veterinarian_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      appointments: {
        Row: {
          id: string
          vet_id: string | null
          parent_id: string | null
          pet_id: string | null
          scheduled_at: string
          status: 'Scheduled' | 'Completed' | 'Cancelled'
          notes: string | null
          fee: number | null
          created_at: string
        }
        Insert: {
          id?: string
          vet_id?: string | null
          parent_id?: string | null
          pet_id?: string | null
          scheduled_at: string
          status?: 'Scheduled' | 'Completed' | 'Cancelled'
          notes?: string | null
          fee?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          vet_id?: string | null
          parent_id?: string | null
          pet_id?: string | null
          scheduled_at?: string
          status?: 'Scheduled' | 'Completed' | 'Cancelled'
          notes?: string | null
          fee?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_vet_id_fkey"
            columns: ["vet_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {}
    Functions: {
      decrement_product_stock: {
        Args: { prod_id: string; qty: number }
        Returns: void
      }
    }
    Enums: {
      order_status: 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled'
      listing_status: 'Available' | 'Pending' | 'Sold'
    }
  }
}
