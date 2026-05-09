-- Create private schema (if not exists)
CREATE SCHEMA IF NOT EXISTS private;

-- Check if current user is Super Admin
CREATE OR REPLACE FUNCTION private.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current user is Admin (or higher)
CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ADMIN')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current user is Marketplace Staff (or higher)
CREATE OR REPLACE FUNCTION private.is_marketplace_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ADMIN', 'MARKETPLACE_STAFF')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has specific admin permission (from admin_permissions JSONB)
CREATE OR REPLACE FUNCTION private.has_permission(perm TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  perms JSONB;
BEGIN
  -- Admins always have all permissions
  IF private.is_admin() THEN
    RETURN TRUE;
  END IF;

  SELECT admin_permissions INTO perms
  FROM public.profiles WHERE id = auth.uid();

  RETURN COALESCE(perms->perm, 'false')::BOOLEAN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute on these functions to authenticated users
GRANT EXECUTE ON FUNCTION private.is_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_marketplace_staff() TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_permission(TEXT) TO authenticated;