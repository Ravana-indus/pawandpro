-- =============================================================================
-- Data Migration: Update existing data to new schema
-- Run this ONCE after all new tables and RLS policies are in place
-- =============================================================================

-- 1. Migrate PARENT → CUSTOMER, SELLER → INDIVIDUAL_SELLER
UPDATE public.profiles SET role = 'CUSTOMER' WHERE role = 'PARENT';
UPDATE public.profiles SET role = 'INDIVIDUAL_SELLER' WHERE role = 'SELLER';

-- 2. Migrate veterinarian_details → service_provider_details
-- This assumes veterinarian_details still exists (it's not dropped, just superseded)
INSERT INTO public.service_provider_details (profile_id, service_type, specialization, license_number, experience_years, service_fee, is_verified, updated_at)
SELECT 
  profile_id, 
  'vet' as service_type, 
  specialization, 
  slvc_number, 
  experience_years, 
  consultation_fee, 
  is_verified, 
  updated_at
FROM public.veterinarian_details
ON CONFLICT (profile_id) DO NOTHING;

-- 3. Migrate appointments → service_bookings
-- Note: We keep appointments table for backward compatibility, but copy data to service_bookings
INSERT INTO public.service_bookings (id, provider_id, customer_id, pet_id, service_type, scheduled_at, status, fee, notes, created_at)
SELECT 
  id, 
  vet_id as provider_id, 
  parent_id as customer_id, 
  pet_id, 
  'vet_consultation' as service_type, 
  scheduled_at, 
  status, 
  fee, 
  notes, 
  created_at
FROM public.appointments
ON CONFLICT (id) DO NOTHING;

-- 4. Add default admin_permissions for existing ADMIN users
UPDATE public.profiles 
SET admin_permissions = '{
  "manage_users": true,
  "manage_marketplace": true,
  "verify_sellers": true,
  "manage_vets": true,
  "manage_adoption": true,
  "moderate_content": true,
  "view_analytics": true,
  "manage_payments": true,
  "audit_logs": true
}'::JSONB
WHERE role = 'ADMIN';

-- 5. Add default admin_permissions for existing MARKETPLACE_STAFF users (if any)
UPDATE public.profiles 
SET admin_permissions = '{
  "manage_marketplace": true,
  "verify_sellers": true,
  "moderate_content": true
}'::JSONB
WHERE role = 'MARKETPLACE_STAFF';

-- 6. Log migration completion
DO $$
BEGIN
  RAISE NOTICE 'Data migration completed successfully';
END;
$$;
