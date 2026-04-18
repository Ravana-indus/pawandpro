-- Create Enums
CREATE TYPE user_role AS ENUM ('PARENT', 'SELLER', 'VET', 'ADMIN');
CREATE TYPE pet_species AS ENUM ('Dog', 'Cat', 'Bird', 'Fish', 'Small Pet', 'Reptile');
CREATE TYPE pet_sex AS ENUM ('Male', 'Female');
CREATE TYPE listing_type AS ENUM ('Buy', 'Adopt', 'Rehome');
CREATE TYPE certification_tier AS ENUM ('Gold', 'Silver', 'Verified', 'Shelter');
CREATE TYPE listing_status AS ENUM ('Available', 'Pending', 'Sold');
CREATE TYPE order_status AS ENUM ('Processing', 'In Transit', 'Delivered', 'Cancelled');
CREATE TYPE appointment_status AS ENUM ('Scheduled', 'Completed', 'Cancelled');

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role DEFAULT 'PARENT',
  full_name TEXT,
  avatar_url TEXT,
  contact_email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pets table
CREATE TABLE IF NOT EXISTS public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species pet_species NOT NULL,
  breed TEXT,
  age TEXT,
  sex pet_sex,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  price NUMERIC NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pet Listings table
CREATE TABLE IF NOT EXISTS public.pet_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species pet_species NOT NULL,
  breed TEXT,
  age TEXT,
  sex pet_sex,
  price NUMERIC NOT NULL,
  type listing_type NOT NULL,
  certification_tier certification_tier DEFAULT 'Verified',
  status listing_status DEFAULT 'Available',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Veterinarian Details table
CREATE TABLE IF NOT EXISTS public.veterinarian_details (
  profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  specialization TEXT,
  slvc_number TEXT,
  experience_years INTEGER,
  consultation_fee NUMERIC,
  is_verified BOOLEAN DEFAULT FALSE,
  is_available_now BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vet_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status appointment_status DEFAULT 'Scheduled',
  notes TEXT,
  fee NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  total_amount NUMERIC NOT NULL,
  status order_status DEFAULT 'Processing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price_at_purchase NUMERIC NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veterinarian_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Trigger for profile creation on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, contact_email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
