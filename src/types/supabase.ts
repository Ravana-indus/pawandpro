export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      adoption_centers: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          is_verified: boolean | null
          license_number: string | null
          name: string
          owner_id: string | null
          phone: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_verified?: boolean | null
          license_number?: string | null
          name: string
          owner_id?: string | null
          phone?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_verified?: boolean | null
          license_number?: string | null
          name?: string
          owner_id?: string | null
          phone?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adoption_centers_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          created_at: string | null
          fee: number | null
          id: string
          notes: string | null
          parent_id: string | null
          pet_id: string | null
          scheduled_at: string
          status: Database["public"]["Enums"]["appointment_status"] | null
          vet_id: string | null
        }
        Insert: {
          created_at?: string | null
          fee?: number | null
          id?: string
          notes?: string | null
          parent_id?: string | null
          pet_id?: string | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          vet_id?: string | null
        }
        Update: {
          created_at?: string | null
          fee?: number | null
          id?: string
          notes?: string | null
          parent_id?: string | null
          pet_id?: string | null
          scheduled_at?: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          vet_id?: string | null
        }
        Relationships: [
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
          },
          {
            foreignKeyName: "appointments_vet_id_fkey"
            columns: ["vet_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_comments: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string | null
          id: string
          is_approved: boolean | null
          parent_comment_id: string | null
          post_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          parent_comment_id?: string | null
          post_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          parent_comment_id?: string | null
          post_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string | null
          id: string
          is_approved: boolean | null
          is_pinned: boolean | null
          title: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_pinned?: boolean | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_pinned?: boolean | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hospital_vets: {
        Row: {
          hospital_id: string
          joined_at: string | null
          vet_id: string
        }
        Insert: {
          hospital_id: string
          joined_at?: string | null
          vet_id: string
        }
        Update: {
          hospital_id?: string
          joined_at?: string | null
          vet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hospital_vets_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hospital_vets_vet_id_fkey"
            columns: ["vet_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          address: string | null
          admin_id: string | null
          created_at: string | null
          email: string | null
          id: string
          is_verified: boolean | null
          license_number: string | null
          name: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          admin_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_verified?: boolean | null
          license_number?: string | null
          name: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          admin_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_verified?: boolean | null
          license_number?: string | null
          name?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hospitals_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_queue: {
        Row: {
          created_at: string | null
          flag_reason: string | null
          flagged_by: string | null
          id: string
          item_id: string
          item_type: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          flag_reason?: string | null
          flagged_by?: string | null
          id?: string
          item_id: string
          item_type: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          flag_reason?: string | null
          flagged_by?: string | null
          id?: string
          item_id?: string
          item_type?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "moderation_queue_flagged_by_fkey"
            columns: ["flagged_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moderation_queue_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string | null
          pet_listing_id: string | null
          price_at_purchase: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          id?: string
          order_id?: string | null
          pet_listing_id?: string | null
          price_at_purchase: number
          product_id?: string | null
          quantity: number
        }
        Update: {
          id?: string
          order_id?: string | null
          pet_listing_id?: string | null
          price_at_purchase?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
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
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string | null
          created_at: string | null
          id: string
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
        }
        Insert: {
          buyer_id?: string | null
          created_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
        }
        Update: {
          buyer_id?: string | null
          created_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_listings: {
        Row: {
          age: string | null
          breed: string | null
          certification_tier:
            | Database["public"]["Enums"]["certification_tier"]
            | null
          created_at: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          seller_id: string | null
          sex: Database["public"]["Enums"]["pet_sex"] | null
          species: Database["public"]["Enums"]["pet_species"]
          status: Database["public"]["Enums"]["listing_status"] | null
          type: Database["public"]["Enums"]["listing_type"]
        }
        Insert: {
          age?: string | null
          breed?: string | null
          certification_tier?:
            | Database["public"]["Enums"]["certification_tier"]
            | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          seller_id?: string | null
          sex?: Database["public"]["Enums"]["pet_sex"] | null
          species: Database["public"]["Enums"]["pet_species"]
          status?: Database["public"]["Enums"]["listing_status"] | null
          type: Database["public"]["Enums"]["listing_type"]
        }
        Update: {
          age?: string | null
          breed?: string | null
          certification_tier?:
            | Database["public"]["Enums"]["certification_tier"]
            | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          seller_id?: string | null
          sex?: Database["public"]["Enums"]["pet_sex"] | null
          species?: Database["public"]["Enums"]["pet_species"]
          status?: Database["public"]["Enums"]["listing_status"] | null
          type?: Database["public"]["Enums"]["listing_type"]
        }
        Relationships: [
          {
            foreignKeyName: "pet_listings_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          age: string | null
          breed: string | null
          created_at: string | null
          id: string
          image_url: string | null
          name: string
          owner_id: string | null
          sex: Database["public"]["Enums"]["pet_sex"] | null
          species: Database["public"]["Enums"]["pet_species"]
        }
        Insert: {
          age?: string | null
          breed?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          owner_id?: string | null
          sex?: Database["public"]["Enums"]["pet_sex"] | null
          species: Database["public"]["Enums"]["pet_species"]
        }
        Update: {
          age?: string | null
          breed?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          owner_id?: string | null
          sex?: Database["public"]["Enums"]["pet_sex"] | null
          species?: Database["public"]["Enums"]["pet_species"]
        }
        Relationships: [
          {
            foreignKeyName: "pets_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          category: string | null
          created_at: string | null
          details: Json | null
          id: string
          name: string
          price: number
          seller_id: string | null
          stock_quantity: number | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          name: string
          price: number
          seller_id?: string | null
          stock_quantity?: number | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          name?: string
          price?: number
          seller_id?: string | null
          stock_quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          admin_permissions: Json | null
          avatar_url: string | null
          banned_until: string | null
          contact_email: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          verification_status: string | null
        }
        Insert: {
          admin_permissions?: Json | null
          avatar_url?: string | null
          banned_until?: string | null
          contact_email?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Update: {
          admin_permissions?: Json | null
          avatar_url?: string | null
          banned_until?: string | null
          contact_email?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      seller_verifications: {
        Row: {
          documents: Json | null
          id: string
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          role_at_verification: string | null
          seller_id: string | null
          status: string | null
          tier: string | null
        }
        Insert: {
          documents?: Json | null
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          role_at_verification?: string | null
          seller_id?: string | null
          status?: string | null
          tier?: string | null
        }
        Update: {
          documents?: Json | null
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          role_at_verification?: string | null
          seller_id?: string | null
          status?: string | null
          tier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seller_verifications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seller_verifications_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_bookings: {
        Row: {
          created_at: string | null
          customer_id: string | null
          fee: number | null
          id: string
          notes: string | null
          pet_id: string | null
          provider_id: string | null
          scheduled_at: string
          service_type: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          fee?: number | null
          id?: string
          notes?: string | null
          pet_id?: string | null
          provider_id?: string | null
          scheduled_at: string
          service_type: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          fee?: number | null
          id?: string
          notes?: string | null
          pet_id?: string | null
          provider_id?: string | null
          scheduled_at?: string
          service_type?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bookings_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_provider_details: {
        Row: {
          experience_years: number | null
          id: string
          is_available_now: boolean | null
          is_verified: boolean | null
          license_number: string | null
          profile_id: string | null
          service_areas: Json | null
          service_fee: number | null
          service_type: string
          specialization: string | null
          updated_at: string | null
        }
        Insert: {
          experience_years?: number | null
          id?: string
          is_available_now?: boolean | null
          is_verified?: boolean | null
          license_number?: string | null
          profile_id?: string | null
          service_areas?: Json | null
          service_fee?: number | null
          service_type: string
          specialization?: string | null
          updated_at?: string | null
        }
        Update: {
          experience_years?: number | null
          id?: string
          is_available_now?: boolean | null
          is_verified?: boolean | null
          license_number?: string | null
          profile_id?: string | null
          service_areas?: Json | null
          service_fee?: number | null
          service_type?: string
          specialization?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_provider_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      veterinarian_details: {
        Row: {
          consultation_fee: number | null
          experience_years: number | null
          is_available_now: boolean | null
          is_verified: boolean | null
          profile_id: string
          slvc_number: string | null
          specialization: string | null
          updated_at: string | null
        }
        Insert: {
          consultation_fee?: number | null
          experience_years?: number | null
          is_available_now?: boolean | null
          is_verified?: boolean | null
          profile_id: string
          slvc_number?: string | null
          specialization?: string | null
          updated_at?: string | null
        }
        Update: {
          consultation_fee?: number | null
          experience_years?: number | null
          is_available_now?: boolean | null
          is_verified?: boolean | null
          profile_id?: string
          slvc_number?: string | null
          specialization?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "veterinarian_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_product_stock: {
        Args: { prod_id: string; qty: number }
        Returns: undefined
      }
      log_audit: {
        Args: {
          p_action: string
          p_details?: Json
          p_target_id?: string
          p_target_type?: string
        }
        Returns: string
      }
    }
    Enums: {
      appointment_status: "Scheduled" | "Completed" | "Cancelled"
      certification_tier: "Gold" | "Silver" | "Verified" | "Shelter"
      listing_status: "Available" | "Pending" | "Sold"
      listing_type: "Buy" | "Adopt" | "Rehome"
      order_status: "Processing" | "In Transit" | "Delivered" | "Cancelled"
      pet_sex: "Male" | "Female"
      pet_species: "Dog" | "Cat" | "Bird" | "Fish" | "Small Pet" | "Reptile"
      user_role:
        | "PARENT"
        | "SELLER"
        | "VET"
        | "ADMIN"
        | "SUPER_ADMIN"
        | "MARKETPLACE_STAFF"
        | "CUSTOMER"
        | "BREEDER"
        | "INDIVIDUAL_SELLER"
        | "ADOPTION_PROVIDER"
        | "GROOMER"
        | "PET_TRAINER"
        | "TRANSPORTER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_status: ["Scheduled", "Completed", "Cancelled"],
      certification_tier: ["Gold", "Silver", "Verified", "Shelter"],
      listing_status: ["Available", "Pending", "Sold"],
      listing_type: ["Buy", "Adopt", "Rehome"],
      order_status: ["Processing", "In Transit", "Delivered", "Cancelled"],
      pet_sex: ["Male", "Female"],
      pet_species: ["Dog", "Cat", "Bird", "Fish", "Small Pet", "Reptile"],
      user_role: [
        "PARENT",
        "SELLER",
        "VET",
        "ADMIN",
        "SUPER_ADMIN",
        "MARKETPLACE_STAFF",
        "CUSTOMER",
        "BREEDER",
        "INDIVIDUAL_SELLER",
        "ADOPTION_PROVIDER",
        "GROOMER",
        "PET_TRAINER",
        "TRANSPORTER",
      ],
    },
  },
} as const
