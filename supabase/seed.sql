-- Extended Seed data for PawsAndPro

-- 1. Clear existing data (optional, but good for a clean demo)
TRUNCATE public.products, public.pet_listings, public.veterinarian_details, public.profiles CASCADE;

-- 2. Create some Demo profiles for Vets and Sellers
-- Note: In a real app, these would have matching auth.users records.
-- We use static UUIDs for consistency in demo links.
INSERT INTO public.profiles (id, full_name, role, contact_email, avatar_url) VALUES
('00000000-0000-0000-0000-000000000001', 'Dr. Elena Rodriguez', 'VET', 'elena@petzen.pro', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop'),
('00000000-0000-0000-0000-000000000002', 'Dr. Marcus Chen', 'VET', 'marcus@petzen.pro', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop'),
('00000000-0000-0000-0000-000000000003', 'Vogue Brides Breeders', 'SELLER', 'vogue@breeders.com', 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400&h=400&fit=crop');

-- 3. Add Veterinarian Details
INSERT INTO public.veterinarian_details (profile_id, specialization, slvc_number, experience_years, consultation_fee, is_verified, is_available_now) VALUES
('00000000-0000-0000-0000-000000000001', 'Feline Cardiology', 'SLVC-2024-001', 12, 3500, true, true),
('00000000-0000-0000-0000-000000000002', 'Orthopedic Surgery', 'SLVC-2024-002', 8, 4500, true, false);

-- 4. Add Clinical Products
INSERT INTO public.products (name, brand, category, price, stock_quantity, details) VALUES
('Gourmet Salmon & Sweet Potato', 'Clinical Core', 'Nutrition', 25000, 100, '{"tags": ["Grain-Free", "Skin Health"], "species": ["Dog"], "rating": 4.9, "reviewsCount": 124, "image": "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=400&h=400&fit=crop", "description": "Holistic formula for athletic performance."}'),
('Pulse Guard Pro Collar', 'SmartPet', 'Smart Health', 45000, 50, '{"tags": ["GPS", "Heart Monitor"], "species": ["Dog", "Cat"], "rating": 5.0, "reviewsCount": 89, "image": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop", "description": "Real-time AI health monitoring."}'),
('Omega Serum +', 'Clinical Core', 'Supplements', 8500, 200, '{"tags": ["Coat Vitality"], "species": ["Dog", "Cat"], "rating": 4.9, "reviewsCount": 340, "image": "https://images.unsplash.com/photo-1585232356843-d3c2202759d8?w=400&h=400&fit=crop", "description": "Essential fatty acids for skin health."}');

-- 5. Add Pet Listings (Marketplace)
INSERT INTO public.pet_listings (seller_id, name, species, breed, age, sex, price, type, certification_tier, image_url) VALUES
('00000000-0000-0000-0000-000000000003', 'Luna', 'Dog', 'Golden Retriever', '3 Months', 'Female', 120000, 'Buy', 'Gold', 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop'),
('00000000-0000-0000-0000-000000000003', 'Oliver', 'Cat', 'British Shorthair', '2 Months', 'Male', 85000, 'Buy', 'Verified', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop');
