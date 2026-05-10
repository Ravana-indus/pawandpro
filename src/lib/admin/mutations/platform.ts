'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { writeAdminAuditLog } from '../audit'
import { requireAdminPermission } from '../permissions'
import type { AdminPermission } from '../types'
import type { Database } from '../../../types/supabase'

type ProfileRow = Database['public']['Tables']['profiles']['Row']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

const VALID_ROLES = ['ADMIN', 'SUPER_ADMIN'] as const
const emailSchema = z.string().email({ message: 'Email is required' })

export async function inviteAdmin(email: string, role: string) {
  try {
    const parsedEmail = emailSchema.parse(email.trim())

    if (!VALID_ROLES.includes(role as typeof VALID_ROLES[number])) {
      return { success: false, error: 'Invalid role' }
    }

    const { supabase, userId: actorId } = await requireAdminPermission('manage_admins')

    const { data: profile, error: findError } = await supabase
      .from('profiles')
      .select('*')
      .eq('contact_email', parsedEmail)
      .single()

    if (findError || !profile) {
      return { success: false, error: 'User not found with that email' }
    }

    const before = { ...profile } as ProfileRow

    const updatePayload: ProfileUpdate = {
      role: role as 'ADMIN' | 'SUPER_ADMIN',
    }

    const { data: after, error: updateError } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', profile.id)
      .select('*')
      .single()

    if (updateError || !after) {
      return { success: false, error: updateError?.message ?? 'Failed to invite admin' }
    }

    await writeAdminAuditLog(supabase, {
      actorId,
      action: 'invite_admin',
      targetType: 'profiles',
      targetId: profile.id,
      before,
      after: after as ProfileRow,
      metadata: { email: parsedEmail, role },
    })

    revalidatePath('/admin/settings/admins')

    return { success: true, data: after }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? 'Invalid email' }
    }

    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function removeAdmin(userId: string) {
  try {
    const { supabase, userId: actorId } = await requireAdminPermission('manage_admins')

    const { data: before, error: beforeError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (beforeError || !before) {
      return { success: false, error: 'User not found' }
    }

    const updatePayload: ProfileUpdate = {
      role: null,
      admin_permissions: null,
    }

    const { data: after, error: updateError } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', userId)
      .select('*')
      .single()

    if (updateError || !after) {
      return { success: false, error: updateError?.message ?? 'Failed to remove admin' }
    }

    await writeAdminAuditLog(supabase, {
      actorId,
      action: 'remove_admin',
      targetType: 'profiles',
      targetId: userId,
      before: before as ProfileRow,
      after: after as ProfileRow,
    })

    revalidatePath('/admin/settings/admins')

    return { success: true, data: after }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

const VALID_PERMISSIONS: AdminPermission[] = [
  'manage_users',
  'manage_marketplace',
  'manage_orders',
  'verify_sellers',
  'manage_services',
  'manage_vets',
  'manage_adoption',
  'moderate_content',
  'view_analytics',
  'manage_payments',
  'audit_logs',
  'manage_admins',
  'manage_platform_settings',
]

export async function updateAdminPermission(
  userId: string,
  permission: string,
  granted: boolean,
) {
  try {
    if (!VALID_PERMISSIONS.includes(permission as AdminPermission)) {
      return { success: false, error: 'Invalid permission key' }
    }

    const { supabase, userId: actorId } = await requireAdminPermission('manage_admins')

    const { data: before, error: beforeError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (beforeError || !before) {
      return { success: false, error: 'User not found' }
    }

    const currentPermissions = (before.admin_permissions as Record<string, boolean>) ?? {}

    const updatePayload: ProfileUpdate = {
      admin_permissions: {
        ...currentPermissions,
        [permission]: granted,
      },
    }

    const { data: after, error: updateError } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', userId)
      .select('*')
      .single()

    if (updateError || !after) {
      return { success: false, error: updateError?.message ?? 'Failed to update permission' }
    }

    await writeAdminAuditLog(supabase, {
      actorId,
      action: 'update_admin_permission',
      targetType: 'profiles',
      targetId: userId,
      before: before as ProfileRow,
      after: after as ProfileRow,
      metadata: {
        permission,
        granted,
      },
    })

    revalidatePath('/admin/settings/admins')

    return { success: true, data: after }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
