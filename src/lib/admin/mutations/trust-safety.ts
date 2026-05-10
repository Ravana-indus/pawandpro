'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { writeAdminAuditLog } from '../audit'
import { requireAdminPermission } from '../permissions'
import { reasonSchema } from '../../schemas/admin'
import type { Database } from '../../../types/supabase'

type ProfileRow = Database['public']['Tables']['profiles']['Row']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
type ModerationQueueRow = Database['public']['Tables']['moderation_queue']['Row']
type ModerationQueueUpdate = Database['public']['Tables']['moderation_queue']['Update']

export async function banAdminUser(
  userId: string,
  reason: string,
  durationDays: number | undefined,
) {
  try {
    const parsedReason = reasonSchema.parse(reason)
    const { supabase, userId: actorId } = await requireAdminPermission('manage_users')

    const { data: before, error: beforeError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (beforeError || !before) {
      return { success: false, error: beforeError?.message ?? 'User not found' }
    }

    const bannedUntil = durationDays
      ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString()
      : null

    const { data: after, error: updateError } = await supabase
      .from('profiles')
      .update({ banned_until: bannedUntil })
      .eq('id', userId)
      .select('*')
      .single()

    if (updateError || !after) {
      return { success: false, error: updateError?.message ?? 'Failed to ban user' }
    }

    await writeAdminAuditLog(supabase, {
      actorId,
      action: 'ban_user',
      targetType: 'profiles',
      targetId: userId,
      reason: parsedReason,
      before: before as ProfileRow,
      after: after as ProfileRow,
      metadata: { durationDays, bannedUntil },
    })

    revalidatePath('/admin/users')
    revalidatePath(`/admin/users/${userId}`)

    return { success: true, data: after }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? 'Reason is required' }
    }

    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function unbanAdminUser(userId: string, reason: string) {
  try {
    const parsedReason = reasonSchema.parse(reason)
    const { supabase, userId: actorId } = await requireAdminPermission('manage_users')

    const { data: before, error: beforeError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (beforeError || !before) {
      return { success: false, error: beforeError?.message ?? 'User not found' }
    }

    const { data: after, error: updateError } = await supabase
      .from('profiles')
      .update({ banned_until: null })
      .eq('id', userId)
      .select('*')
      .single()

    if (updateError || !after) {
      return { success: false, error: updateError?.message ?? 'Failed to unban user' }
    }

    await writeAdminAuditLog(supabase, {
      actorId,
      action: 'unban_user',
      targetType: 'profiles',
      targetId: userId,
      reason: parsedReason,
      before: before as ProfileRow,
      after: after as ProfileRow,
    })

    revalidatePath('/admin/users')
    revalidatePath(`/admin/users/${userId}`)

    return { success: true, data: after }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? 'Reason is required' }
    }

    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function reviewAdminVerification(
  sellerId: string,
  status: 'approved' | 'rejected',
  tier: 'Gold' | 'Silver' | 'Verified' | 'Shelter' | undefined,
  reason: string,
) {
  try {
    const parsedReason = reasonSchema.parse(reason)
    const { supabase, userId: actorId } = await requireAdminPermission('verify_sellers')

    const { data: before, error: beforeError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sellerId)
      .single()

    if (beforeError || !before) {
      return { success: false, error: beforeError?.message ?? 'Seller not found' }
    }

    const updatePayload: ProfileUpdate = {
      is_verified: status === 'approved',
      verification_status: status,
    }

    const { data: after, error: updateError } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', sellerId)
      .select('*')
      .single()

    if (updateError || !after) {
      return { success: false, error: updateError?.message ?? 'Failed to update verification' }
    }

    await writeAdminAuditLog(supabase, {
      actorId,
      action: 'review_verification',
      targetType: 'profiles',
      targetId: sellerId,
      reason: parsedReason,
      before: before as ProfileRow,
      after: after as ProfileRow,
      metadata: { status, tier },
    })

    revalidatePath('/admin/verifications')

    return { success: true, data: after }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? 'Reason is required' }
    }

    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function resolveAdminModerationItem(
  itemId: string,
  action: 'dismiss' | 'review' | 'remove',
  reason: string,
) {
  try {
    const parsedReason = reasonSchema.parse(reason)
    const { supabase, userId: actorId } = await requireAdminPermission('moderate_content')

    const { data: before, error: beforeError } = await supabase
      .from('moderation_queue')
      .select('*')
      .eq('id', itemId)
      .single()

    if (beforeError || !before) {
      return { success: false, error: beforeError?.message ?? 'Moderation item not found' }
    }

    const status = action === 'dismiss' ? 'dismissed' : action === 'remove' ? 'removed' : 'reviewed'

    const updatePayload: ModerationQueueUpdate = {
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: actorId,
    }

    const { data: after, error: updateError } = await supabase
      .from('moderation_queue')
      .update(updatePayload)
      .eq('id', itemId)
      .select('*')
      .single()

    if (updateError || !after) {
      return { success: false, error: updateError?.message ?? 'Failed to resolve moderation item' }
    }

    await writeAdminAuditLog(supabase, {
      actorId,
      action: 'resolve_moderation_item',
      targetType: 'moderation_queue',
      targetId: itemId,
      reason: parsedReason,
      before: before as ModerationQueueRow,
      after: after as ModerationQueueRow,
      metadata: { action },
    })

    revalidatePath('/admin/community/queue')

    return { success: true, data: after }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? 'Reason is required' }
    }

    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function removeAdminPost(id: string, reason: string) {
  try {
    const parsedReason = reasonSchema.parse(reason)
    const { supabase, userId: actorId } = await requireAdminPermission('moderate_content')

    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    await writeAdminAuditLog(supabase, {
      actorId,
      action: 'remove_post',
      targetType: 'community_posts',
      targetId: id,
      reason: parsedReason,
    })

    revalidatePath('/admin/community/posts')

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? 'Reason is required' }
    }

    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function removeAdminComment(id: string, reason: string) {
  try {
    const parsedReason = reasonSchema.parse(reason)
    const { supabase, userId: actorId } = await requireAdminPermission('moderate_content')

    const { error } = await supabase
      .from('community_comments')
      .delete()
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    await writeAdminAuditLog(supabase, {
      actorId,
      action: 'remove_comment',
      targetType: 'community_comments',
      targetId: id,
      reason: parsedReason,
    })

    revalidatePath('/admin/community/comments')

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? 'Reason is required' }
    }

    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
