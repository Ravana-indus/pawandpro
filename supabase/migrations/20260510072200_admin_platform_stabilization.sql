-- Admin platform stabilization: schema drift, indexing, and function hardening.

-- Add missing updated_at columns used by admin workflows.
ALTER TABLE IF EXISTS public.orders
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

ALTER TABLE IF EXISTS public.service_bookings
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Legacy admin actions still update appointments.updated_at.
ALTER TABLE IF EXISTS public.appointments
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add targeted FK/composite indexes from Task 5, guarded for schema drift.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'orders'
      AND column_name = 'buyer_id'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON public.orders (buyer_id)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'orders'
      AND column_name IN ('status', 'created_at')
    GROUP BY table_schema, table_name
    HAVING COUNT(*) = 2
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_orders_status_created_at ON public.orders (status, created_at DESC)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'order_items'
      AND column_name = 'order_id'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'order_items'
      AND column_name = 'product_id'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items (product_id)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'order_items'
      AND column_name = 'pet_listing_id'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_order_items_pet_listing_id ON public.order_items (pet_listing_id)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'products'
      AND column_name = 'seller_id'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_products_seller_id ON public.products (seller_id)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'pet_listings'
      AND column_name = 'seller_id'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_pet_listings_seller_id ON public.pet_listings (seller_id)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'pet_listings'
      AND column_name IN ('status', 'created_at')
    GROUP BY table_schema, table_name
    HAVING COUNT(*) = 2
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_pet_listings_status_created_at ON public.pet_listings (status, created_at DESC)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'service_bookings'
      AND column_name = 'provider_id'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_service_bookings_provider_id ON public.service_bookings (provider_id)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'service_bookings'
      AND column_name = 'customer_id'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_service_bookings_customer_id ON public.service_bookings (customer_id)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'service_bookings'
      AND column_name = 'pet_id'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_service_bookings_pet_id ON public.service_bookings (pet_id)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'service_bookings'
      AND column_name IN ('status', 'scheduled_at')
    GROUP BY table_schema, table_name
    HAVING COUNT(*) = 2
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_service_bookings_status_scheduled_at ON public.service_bookings (status, scheduled_at DESC)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'audit_logs'
      AND column_name = 'actor_id'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs (actor_id)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'audit_logs'
      AND column_name IN ('target_type', 'target_id', 'created_at')
    GROUP BY table_schema, table_name
    HAVING COUNT(*) = 3
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON public.audit_logs (target_type, target_id, created_at DESC)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'appointments'
      AND column_name = 'vet_id'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_appointments_vet_id ON public.appointments (vet_id)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'appointments'
      AND column_name = 'parent_id'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_appointments_parent_id ON public.appointments (parent_id)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'appointments'
      AND column_name = 'pet_id'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_appointments_pet_id ON public.appointments (pet_id)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'community_comments'
      AND column_name = 'parent_comment_id'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_community_comments_parent_comment_id ON public.community_comments (parent_comment_id)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'hospital_vets'
      AND column_name = 'vet_id'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_hospital_vets_vet_id ON public.hospital_vets (vet_id)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'moderation_queue'
      AND column_name = 'flagged_by'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_moderation_queue_flagged_by ON public.moderation_queue (flagged_by)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'moderation_queue'
      AND column_name = 'reviewed_by'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_moderation_queue_reviewed_by ON public.moderation_queue (reviewed_by)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'moderation_queue'
      AND column_name IN ('status', 'created_at')
    GROUP BY table_schema, table_name
    HAVING COUNT(*) = 2
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_moderation_queue_status_created_at ON public.moderation_queue (status, created_at DESC)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'pets'
      AND column_name = 'owner_id'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_pets_owner_id ON public.pets (owner_id)';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'seller_verifications'
      AND column_name = 'reviewed_by'
  ) THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_seller_verifications_reviewed_by ON public.seller_verifications (reviewed_by)';
  END IF;
END
$$;

-- Harden function execution and search paths.
ALTER FUNCTION IF EXISTS public.decrement_product_stock(uuid, integer) SET search_path = public, auth;
ALTER FUNCTION IF EXISTS public.handle_new_user() SET search_path = public, auth;
ALTER FUNCTION IF EXISTS public.log_audit(text, text, uuid, jsonb) SET search_path = public, auth;
ALTER FUNCTION IF EXISTS public.rls_auto_enable() SET search_path = public, auth;

DO $$
BEGIN
  IF to_regprocedure('public.decrement_product_stock(uuid, integer)') IS NOT NULL THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.decrement_product_stock(uuid, integer) FROM PUBLIC, anon, authenticated';
  END IF;

  IF to_regprocedure('public.handle_new_user()') IS NOT NULL THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated';
  END IF;

  IF to_regprocedure('public.log_audit(text, text, uuid, jsonb)') IS NOT NULL THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.log_audit(text, text, uuid, jsonb) FROM PUBLIC, anon, authenticated';
  END IF;

  IF to_regprocedure('public.rls_auto_enable()') IS NOT NULL THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated';
  END IF;
END
$$;

ALTER FUNCTION IF EXISTS private.is_super_admin() SET search_path = private, public, auth;
ALTER FUNCTION IF EXISTS private.is_admin() SET search_path = private, public, auth;
ALTER FUNCTION IF EXISTS private.is_marketplace_staff() SET search_path = private, public, auth;
ALTER FUNCTION IF EXISTS private.has_permission(TEXT) SET search_path = private, public, auth;

DO $$
BEGIN
  IF to_regprocedure('private.is_super_admin()') IS NOT NULL THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION private.is_super_admin() FROM PUBLIC, anon';
    EXECUTE 'GRANT EXECUTE ON FUNCTION private.is_super_admin() TO authenticated';
  END IF;

  IF to_regprocedure('private.is_admin()') IS NOT NULL THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION private.is_admin() FROM PUBLIC, anon';
    EXECUTE 'GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated';
  END IF;

  IF to_regprocedure('private.is_marketplace_staff()') IS NOT NULL THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION private.is_marketplace_staff() FROM PUBLIC, anon';
    EXECUTE 'GRANT EXECUTE ON FUNCTION private.is_marketplace_staff() TO authenticated';
  END IF;

  IF to_regprocedure('private.has_permission(text)') IS NOT NULL THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION private.has_permission(TEXT) FROM PUBLIC, anon';
    EXECUTE 'GRANT EXECUTE ON FUNCTION private.has_permission(TEXT) TO authenticated';
  END IF;
END
$$;
