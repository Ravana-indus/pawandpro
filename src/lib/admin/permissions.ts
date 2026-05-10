import type { AdminPermission } from "./types"

type AdminProfile = {
  id?: string
  full_name?: string | null
  role: string | null
  admin_permissions?: unknown
}

function hasExplicitPermission(
  adminPermissions: unknown,
  permission: AdminPermission,
) {
  if (!adminPermissions || typeof adminPermissions !== "object" || Array.isArray(adminPermissions)) {
    return false
  }

  return (adminPermissions as Record<string, unknown>)[permission] === true
}

function hasAnyExplicitPermission(adminPermissions: unknown) {
  if (!adminPermissions || typeof adminPermissions !== "object" || Array.isArray(adminPermissions)) {
    return false
  }

  return Object.values(adminPermissions).some((value) => value === true)
}

export function profileHasAdminPermission(
  profile: { role: string | null; admin_permissions?: unknown } | null,
  permission: AdminPermission,
) {
  if (!profile?.role) return false
  if (profile.role === "SUPER_ADMIN") return true
  if (profile.role === "ADMIN") return permission !== "manage_admins"
  if (profile.role === "MARKETPLACE_STAFF") {
    return hasExplicitPermission(profile.admin_permissions, permission)
  }

  return false
}

export function profileCanAccessAdmin(
  profile: { role: string | null; admin_permissions?: unknown } | null,
) {
  if (!profile?.role) return false
  if (profile.role === "SUPER_ADMIN" || profile.role === "ADMIN") return true
  if (profile.role === "MARKETPLACE_STAFF") {
    return hasAnyExplicitPermission(profile.admin_permissions)
  }

  return false
}

export async function requireAdminPermission(permission: AdminPermission) {
  const { createClient } = await import("../supabase/server")
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, full_name, admin_permissions")
    .eq("id", user.id)
    .single()

  if (!profileHasAdminPermission(profile as AdminProfile | null, permission)) {
    throw new Error(`Unauthorized: ${permission} permission required`)
  }

  return { supabase, userId: user.id, profile }
}
