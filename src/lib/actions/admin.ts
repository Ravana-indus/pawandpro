'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { writeAdminAuditLog } from '@/lib/admin/audit'
import type { AdminAuditWriterClient } from '@/lib/admin/audit'
import { requireAdminPermission } from '@/lib/admin/permissions'
import type { AdminPermission } from '@/lib/admin/types'
import { deleteAdminListing, updateAdminListingMetadata } from '@/lib/admin/mutations/marketplace'
import {
  updateUserSchema,
  banUserSchema,
  productSchema,
  listingSchema,
  orderStatusSchema,
  hospitalSchema,
  adoptionCenterSchema,
  postSchema,
  moderationActionSchema,
  verificationActionSchema,
} from '@/lib/schemas/admin'

const ADMIN_ACTION_PERMISSION: Record<string, AdminPermission> = {
  updateUser: 'manage_users',
  banUser: 'manage_users',
  unbanUser: 'manage_users',
  handleVerification: 'verify_sellers',
  createProduct: 'manage_marketplace',
  updateProduct: 'manage_marketplace',
  deleteProduct: 'manage_marketplace',
  createListing: 'manage_marketplace',
  updateListing: 'manage_marketplace',
  deleteListing: 'manage_marketplace',
  updateOrderStatus: 'manage_orders',
  cancelOrder: 'manage_orders',
  createHospital: 'manage_vets',
  updateHospital: 'manage_vets',
  linkVetToHospital: 'manage_vets',
  createAdoptionCenter: 'manage_adoption',
  updateAdoptionCenter: 'manage_adoption',
  deleteAdoptionCenter: 'manage_adoption',
  updateProviderStatus: 'manage_services',
  updateBookingStatus: 'manage_services',
  cancelBooking: 'manage_services',
  approvePost: 'moderate_content',
  deletePost: 'moderate_content',
  togglePinPost: 'moderate_content',
  approveComment: 'moderate_content',
  deleteComment: 'moderate_content',
  resolveModerationItem: 'moderate_content',
}

async function requireAdmin(action: string) {
  const requiredPermission = ADMIN_ACTION_PERMISSION[action] ?? 'manage_platform_settings'
  const adminContext = await requireAdminPermission(requiredPermission)

  if (!adminContext.profile) {
    throw new Error(`Unauthorized: ${action} requires admin access`)
  }

  return adminContext
}

async function logAudit(
  supabase: AdminAuditWriterClient,
  actorId: string,
  action: string,
  targetType: string,
  targetId: string,
  details?: Record<string, unknown>
) {
  const reason = typeof details?.reason === 'string' ? details.reason : undefined
  const before = details && 'before' in details ? details.before : undefined
  const after = details && 'after' in details ? details.after : undefined
  const metadata = details
    ? Object.fromEntries(
        Object.entries(details).filter(([key]) => key !== 'reason' && key !== 'before' && key !== 'after')
      )
    : undefined

  try {
    await writeAdminAuditLog(supabase, {
      actorId,
      action,
      targetType,
      targetId,
      reason,
      before,
      after,
      metadata,
    })
  } catch {
    console.error('Audit log failed:', action, targetType, targetId)
  }
}

// Task 2: Users + Verifications

export async function updateUser(id: string, formData: FormData) {
  try {
    const { supabase, userId } = await requireAdmin('updateUser')

    const data = {
      full_name: formData.get('full_name') as string,
      contact_email: formData.get('contact_email') as string,
      phone: formData.get('phone') as string | undefined,
      role: formData.get('role') as string,
      is_verified: formData.get('is_verified') === 'true',
      verification_status: formData.get('verification_status') as string | undefined,
    }

    const validated = updateUserSchema.parse(data)

    const { error } = await supabase
      .from('profiles')
      .update(validated)
      .eq('id', id)

    if (error) return { error: error.message }

    await logAudit(supabase, userId, 'update_user', 'profiles', id, { fields: Object.keys(validated) })
    revalidatePath('/admin/users')
    return { success: true }
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message }
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function banUser(formData: FormData) {
  try {
    const { supabase, userId } = await requireAdmin('banUser')

    const data = {
      userId: formData.get('userId') as string,
      reason: formData.get('reason') as string,
      durationDays: formData.get('durationDays') ? Number(formData.get('durationDays')) : undefined,
    }

    const validated = banUserSchema.parse(data)

    const bannedUntil = validated.durationDays
      ? new Date(Date.now() + validated.durationDays * 24 * 60 * 60 * 1000).toISOString()
      : null

    const { error } = await supabase
      .from('profiles')
      .update({ banned_until: bannedUntil })
      .eq('id', validated.userId)

    if (error) return { error: error.message }

    await logAudit(supabase, userId, 'ban_user', 'profiles', validated.userId, {
      reason: validated.reason,
      durationDays: validated.durationDays,
      bannedUntil,
    })
    revalidatePath('/admin/users')
    return { success: true }
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message }
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function unbanUser(userId: string) {
  try {
    const { supabase, userId: actorId } = await requireAdmin('unbanUser')
    const { error } = await supabase
      .from('profiles')
      .update({ banned_until: null })
      .eq('id', userId)

    if (error) return { error: error.message }

    await logAudit(supabase, actorId, 'unban_user', 'profiles', userId, {})
    revalidatePath('/admin/users')
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function handleVerification(formData: FormData) {
  try {
    const { supabase, userId } = await requireAdmin('handleVerification')

    const data = {
      sellerId: formData.get('sellerId') as string,
      status: formData.get('status') as 'approved' | 'rejected',
      tier: formData.get('tier') as 'Gold' | 'Silver' | 'Verified' | 'Shelter' | undefined,
      notes: formData.get('notes') as string | undefined,
    }

    const validated = verificationActionSchema.parse(data)

    const verificationUpdate: Record<string, unknown> = {
      status: validated.status === 'approved' ? 'approved' : 'rejected',
      reviewed_at: new Date().toISOString(),
      reviewed_by: userId,
    }

    if (validated.tier) {
      verificationUpdate.certification_tier = validated.tier
    }

    const { error: verifyError } = await supabase
      .from('seller_verifications')
      .update(verificationUpdate as any)
      .eq('seller_id', validated.sellerId)

    if (verifyError) return { error: verifyError.message }

    const profileUpdate: Record<string, unknown> = {
      is_verified: validated.status === 'approved',
      verification_status: validated.status,
    }

    await supabase
      .from('profiles')
      .update(profileUpdate as any)
      .eq('id', validated.sellerId)

    await logAudit(supabase, userId, 'handle_verification', 'seller_verifications', validated.sellerId, {
      status: validated.status,
      tier: validated.tier,
      notes: validated.notes,
    })
    revalidatePath('/admin/verifications')
    return { success: true }
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message }
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

// Task 3: Marketplace

export async function createProduct(formData: FormData) {
  try {
    const { supabase, userId } = await requireAdmin('createProduct')

    const data = {
      name: formData.get('name') as string,
      brand: formData.get('brand') as string | undefined,
      category: formData.get('category') as string | undefined,
      price: Number(formData.get('price')),
      stock_quantity: Number(formData.get('stock_quantity')),
      seller_id: formData.get('seller_id') as string | undefined,
      details: formData.get('details') ? JSON.parse(formData.get('details') as string) : undefined,
    }

    const validated = productSchema.parse(data)

    const { data: product, error } = await supabase
      .from('products')
      .insert(validated as any)
      .select()
      .single()

    if (error) return { error: error.message }

    await logAudit(supabase, userId, 'create_product', 'products', product.id, { name: validated.name })
    revalidatePath('/admin/marketplace/products')
    return { success: true, product }
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message }
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const { supabase, userId } = await requireAdmin('updateProduct')

    const data: Record<string, unknown> = {}
    const fields = ['name', 'brand', 'category', 'price', 'stock_quantity', 'seller_id', 'details']
    for (const field of fields) {
      const value = formData.get(field)
      if (value !== null && value !== '') {
        if (field === 'price' || field === 'stock_quantity') {
          data[field] = Number(value)
        } else if (field === 'details') {
          data[field] = JSON.parse(value as string)
        } else {
          data[field] = value
        }
      }
    }

    const { error } = await supabase
      .from('products')
      .update(data as any)
      .eq('id', id)

    if (error) return { error: error.message }

    await logAudit(supabase, userId, 'update_product', 'products', id, { fields: Object.keys(data) })
    revalidatePath('/admin/marketplace/products')
    revalidatePath(`/admin/marketplace/products/${id}`)
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function deleteProduct(id: string) {
  try {
    const { supabase, userId } = await requireAdmin('deleteProduct')
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) return { error: error.message }

    await logAudit(supabase, userId, 'delete_product', 'products', id, {})
    revalidatePath('/admin/marketplace/products')
    revalidatePath(`/admin/marketplace/products/${id}`)
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function createListing(formData: FormData) {
  try {
    const { supabase, userId } = await requireAdmin('createListing')

    const data = {
      name: formData.get('name') as string,
      species: formData.get('species') as 'Dog' | 'Cat' | 'Bird' | 'Fish' | 'Small Pet' | 'Reptile',
      breed: formData.get('breed') as string | undefined,
      sex: formData.get('sex') as 'Male' | 'Female' | undefined,
      age: formData.get('age') as string | undefined,
      price: Number(formData.get('price')),
      seller_id: formData.get('seller_id') as string | undefined,
      type: formData.get('type') as 'Buy' | 'Adopt' | 'Rehome',
      status: formData.get('status') as 'Available' | 'Pending' | 'Sold' | undefined,
      certification_tier: formData.get('certification_tier') as 'Gold' | 'Silver' | 'Verified' | 'Shelter' | undefined,
      image_url: formData.get('image_url') as string | undefined,
    }

    const validated = listingSchema.parse(data)

    const { data: listing, error } = await supabase
      .from('pet_listings')
      .insert(validated as any)
      .select()
      .single()

    if (error) return { error: error.message }

    await logAudit(supabase, userId, 'create_listing', 'pet_listings', listing.id, { name: validated.name })
    revalidatePath('/admin/marketplace/listings')
    return { success: true, listing }
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message }
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function updateListing(id: string, formData: FormData) {
  return updateAdminListingMetadata(id, formData)
}

export async function deleteListing(id: string, reason?: string) {
  return deleteAdminListing(id, reason ?? '')
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    const { supabase, userId } = await requireAdmin('updateOrderStatus')

    const validated = orderStatusSchema.parse(status)

    const { error } = await supabase
      .from('orders')
      .update({ status: validated as any, updated_at: new Date().toISOString() } as any)
      .eq('id', id)

    if (error) return { error: error.message }

    await logAudit(supabase, userId, 'update_order_status', 'orders', id, { status: validated })
    revalidatePath('/admin/marketplace/orders')
    revalidatePath(`/admin/marketplace/orders/${id}`)
    return { success: true }
  } catch (e) {
    if (e instanceof z.ZodError) return { error: 'Invalid status' }
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function cancelOrder(id: string) {
  return updateOrderStatus(id, 'Cancelled')
}

// Task 4: Services + Community

export async function createHospital(formData: FormData) {
  try {
    const { supabase, userId } = await requireAdmin('createHospital')

    const data = {
      name: formData.get('name') as string,
      address: formData.get('address') as string | undefined,
      phone: formData.get('phone') as string | undefined,
      email: formData.get('email') as string | undefined,
      license_number: formData.get('license_number') as string | undefined,
      admin_id: formData.get('admin_id') as string | undefined,
      is_verified: formData.get('is_verified') === 'true',
    }

    const validated = hospitalSchema.parse(data)

    const { data: hospital, error } = await supabase
      .from('hospitals')
      .insert(validated)
      .select()
      .single()

    if (error) return { error: error.message }

    await logAudit(supabase, userId, 'create_hospital', 'hospitals', hospital.id, { name: validated.name })
    revalidatePath('/admin/services/vets')
    return { success: true, hospital }
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message }
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function updateHospital(id: string, formData: FormData) {
  try {
    const { supabase, userId } = await requireAdmin('updateHospital')

    const data: Record<string, unknown> = {}
    const fields = ['name', 'address', 'phone', 'email', 'license_number', 'admin_id', 'is_verified']
    for (const field of fields) {
      const value = formData.get(field)
      if (value !== null && value !== '') {
        if (field === 'is_verified') {
          data[field] = value === 'true'
        } else {
          data[field] = value
        }
      }
    }

    const { error } = await supabase
      .from('hospitals')
      .update({ ...data, updated_at: new Date().toISOString() } as any)
      .eq('id', id)

    if (error) return { error: error.message }

    await logAudit(supabase, userId, 'update_hospital', 'hospitals', id, { fields: Object.keys(data) })
    revalidatePath('/admin/services/vets')
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function linkVetToHospital(vetId: string, hospitalId: string) {
  try {
    const { supabase, userId } = await requireAdmin('linkVetToHospital')
    const { error } = await supabase
      .from('hospital_vets')
      .insert({ vet_id: vetId, hospital_id: hospitalId })

    if (error) return { error: error.message }

    await logAudit(supabase, userId, 'link_vet_to_hospital', 'hospital_vets', `${vetId}-${hospitalId}`, { vetId, hospitalId })
    revalidatePath('/admin/services/vets')
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function createAdoptionCenter(formData: FormData) {
  try {
    const { supabase, userId } = await requireAdmin('createAdoptionCenter')

    const data = {
      name: formData.get('name') as string,
      type: formData.get('type') as string | undefined,
      address: formData.get('address') as string | undefined,
      phone: formData.get('phone') as string | undefined,
      email: formData.get('email') as string | undefined,
      license_number: formData.get('license_number') as string | undefined,
      owner_id: formData.get('owner_id') as string | undefined,
      is_verified: formData.get('is_verified') === 'true',
    }

    const validated = adoptionCenterSchema.parse(data)

    const { data: center, error } = await supabase
      .from('adoption_centers')
      .insert(validated)
      .select()
      .single()

    if (error) return { error: error.message }

    await logAudit(supabase, userId, 'create_adoption_center', 'adoption_centers', center.id, { name: validated.name })
    return { success: true, center }
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message }
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function updateAdoptionCenter(id: string, formData: FormData) {
  try {
    const { supabase, userId } = await requireAdmin('updateAdoptionCenter')

    const data: Record<string, unknown> = {}
    const fields = ['name', 'type', 'address', 'phone', 'email', 'license_number', 'owner_id', 'is_verified']
    for (const field of fields) {
      const value = formData.get(field)
      if (value !== null && value !== '') {
        if (field === 'is_verified') {
          data[field] = value === 'true'
        } else {
          data[field] = value
        }
      }
    }

    const { error } = await supabase
      .from('adoption_centers')
      .update(data as any)
      .eq('id', id)

    if (error) return { error: error.message }

    await logAudit(supabase, userId, 'update_adoption_center', 'adoption_centers', id, { fields: Object.keys(data) })
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function deleteAdoptionCenter(id: string) {
  try {
    const { supabase, userId } = await requireAdmin('deleteAdoptionCenter')
    const { error } = await supabase.from('adoption_centers').delete().eq('id', id)

    if (error) return { error: error.message }

    await logAudit(supabase, userId, 'delete_adoption_center', 'adoption_centers', id, {})
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function updateProviderStatus(id: string, isVerified: boolean) {
  try {
    const { supabase, userId } = await requireAdmin('updateProviderStatus')
    const { error } = await supabase
      .from('service_provider_details')
      .update({ is_verified: isVerified })
      .eq('id', id)

    if (error) return { error: error.message }

    await logAudit(supabase, userId, 'update_provider_status', 'service_provider_details', id, { is_verified: isVerified })
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function updateBookingStatus(id: string, status: string) {
  try {
    const { supabase, userId } = await requireAdmin('updateBookingStatus')
    const { error } = await supabase
      .from('appointments')
      .update({ status: status as any, updated_at: new Date().toISOString() } as any)
      .eq('id', id)

    if (error) return { error: error.message }

    await logAudit(supabase, userId, 'update_booking_status', 'appointments', id, { status })
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function cancelBooking(id: string) {
  try {
    const { supabase, userId } = await requireAdmin('cancelBooking')
    const { error } = await supabase
      .from('service_bookings')
      .update({ status: 'Cancelled', updated_at: new Date().toISOString() } as any)
      .eq('id', id)

    if (error) return { error: error.message }

    await logAudit(supabase, userId, 'cancel_booking', 'service_bookings', id, { status: 'Cancelled' })
    revalidatePath('/admin/services/bookings')
    revalidatePath(`/admin/services/bookings/${id}`)
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function approvePost(id: string) {
  try {
    const { supabase, userId } = await requireAdmin('approvePost')
    const { error } = await supabase
      .from('community_posts')
      .update({ is_approved: true })
      .eq('id', id)

    if (error) return { error: error.message }

    await logAudit(supabase, userId, 'approve_post', 'community_posts', id, {})
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function deletePost(id: string) {
  try {
    const { supabase, userId } = await requireAdmin('deletePost')
    const { error } = await supabase.from('community_posts').delete().eq('id', id)

    if (error) return { error: error.message }

    await logAudit(supabase, userId, 'delete_post', 'community_posts', id, {})
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function togglePinPost(id: string, isPinned: boolean) {
  try {
    const { supabase, userId } = await requireAdmin('togglePinPost')
    const { error } = await supabase
      .from('community_posts')
      .update({ is_pinned: isPinned })
      .eq('id', id)

    if (error) return { error: error.message }

    await logAudit(supabase, userId, 'toggle_pin_post', 'community_posts', id, { is_pinned: isPinned })
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function approveComment(id: string) {
  try {
    const { supabase, userId } = await requireAdmin('approveComment')
    const { error } = await supabase
      .from('community_comments')
      .update({ is_approved: true })
      .eq('id', id)

    if (error) return { error: error.message }

    await logAudit(supabase, userId, 'approve_comment', 'community_comments', id, {})
    revalidatePath('/admin/community/comments')
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function deleteComment(id: string) {
  try {
    const { supabase, userId } = await requireAdmin('deleteComment')
    const { error } = await supabase.from('community_comments').delete().eq('id', id)

    if (error) return { error: error.message }

    await logAudit(supabase, userId, 'delete_comment', 'community_comments', id, {})
    revalidatePath('/admin/community/comments')
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function resolveModerationItem(formData: FormData) {
  try {
    const { supabase, userId } = await requireAdmin('resolveModerationItem')

    const data = {
      itemId: formData.get('itemId') as string,
      action: formData.get('action') as 'dismiss' | 'review' | 'remove',
      notes: formData.get('notes') as string | undefined,
    }

    const validated = moderationActionSchema.parse(data)

    const status = validated.action === 'dismiss' ? 'dismissed' : validated.action === 'remove' ? 'removed' : 'reviewed'

    const { error } = await supabase
      .from('moderation_queue')
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: userId,
        notes: validated.notes ?? null,
      } as any)
      .eq('id', validated.itemId)

    if (error) return { error: error.message }

    await logAudit(supabase, userId, 'resolve_moderation', 'moderation_queue', validated.itemId, {
      action: validated.action,
      notes: validated.notes,
    })
    return { success: true }
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message }
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}
