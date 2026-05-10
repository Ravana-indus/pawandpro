'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
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

async function requireAdmin(action: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'SUPER_ADMIN')) {
    throw new Error('Unauthorized: Admin access required')
  }

  return { supabase, userId: user.id, profile }
}

async function logAudit(
  action: string,
  targetType: string,
  targetId: string,
  details?: any
) {
  try {
    const supabase = await createClient()
    await (supabase.from as any)('audit_log').insert({
      action,
      target_type: targetType,
      target_id: targetId,
      details: details ?? null,
      created_at: new Date().toISOString(),
    } as any)
  } catch {
    console.error('Audit log failed:', action, targetType, targetId)
  }
}

// Task 2: Users + Verifications

export async function updateUser(id: string, formData: FormData) {
  try {
    const { supabase } = await requireAdmin('updateUser')

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

    await logAudit('update_user', 'profiles', id, { fields: Object.keys(validated) })
    revalidatePath('/admin/users')
    return { success: true }
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message }
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function banUser(formData: FormData) {
  try {
    const { supabase } = await requireAdmin('banUser')

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

    await logAudit('ban_user', 'profiles', validated.userId, {
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
    await requireAdmin('unbanUser')

    const supabase = await createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ banned_until: null })
      .eq('id', userId)

    if (error) return { error: error.message }

    await logAudit('unban_user', 'profiles', userId, {})
    revalidatePath('/admin/users')
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function handleVerification(formData: FormData) {
  try {
    const { supabase } = await requireAdmin('handleVerification')

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
      reviewed_by: (await requireAdmin('handleVerification')).userId,
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

    await logAudit('handle_verification', 'seller_verifications', validated.sellerId, {
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
    await requireAdmin('createProduct')

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

    const supabase = await createClient()
    const { data: product, error } = await supabase
      .from('products')
      .insert(validated as any)
      .select()
      .single()

    if (error) return { error: error.message }

    await logAudit('create_product', 'products', product.id, { name: validated.name })
    revalidatePath('/admin/marketplace/products')
    return { success: true, product }
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message }
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    await requireAdmin('updateProduct')

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

    const supabase = await createClient()
    const { error } = await supabase
      .from('products')
      .update(data as any)
      .eq('id', id)

    if (error) return { error: error.message }

    await logAudit('update_product', 'products', id, { fields: Object.keys(data) })
    revalidatePath('/admin/marketplace/products')
    revalidatePath(`/admin/marketplace/products/${id}`)
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function deleteProduct(id: string) {
  try {
    await requireAdmin('deleteProduct')

    const supabase = await createClient()
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) return { error: error.message }

    await logAudit('delete_product', 'products', id, {})
    revalidatePath('/admin/marketplace/products')
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function createListing(formData: FormData) {
  try {
    await requireAdmin('createListing')

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

    const supabase = await createClient()
    const { data: listing, error } = await (supabase.from as any)('listings')
      .insert(validated as any)
      .select()
      .single()

    if (error) return { error: error.message }

    await logAudit('create_listing', 'listings', (listing as any).id, { name: validated.name })
    revalidatePath('/admin/marketplace/listings')
    return { success: true, listing }
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message }
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function updateListing(id: string, formData: FormData) {
  try {
    await requireAdmin('updateListing')

    const data: Record<string, unknown> = {}
    const fields = ['name', 'species', 'breed', 'sex', 'age', 'price', 'seller_id', 'type', 'status', 'certification_tier', 'image_url']
    for (const field of fields) {
      const value = formData.get(field)
      if (value !== null && value !== '') {
        if (field === 'price') {
          data[field] = Number(value)
        } else {
          data[field] = value
        }
      }
    }

    const supabase = await createClient()
    const { error } = await (supabase.from as any)('listings').update(data as any).eq('id', id)

    if (error) return { error: error.message }

    await logAudit('update_listing', 'listings', id, { fields: Object.keys(data) as any })
    revalidatePath('/admin/marketplace/listings')
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function deleteListing(id: string) {
  try {
    await requireAdmin('deleteListing')

    const supabase = await createClient()
    const { error } = await (supabase.from as any)('listings').delete().eq('id', id)

    if (error) return { error: error.message }

    await logAudit('delete_listing', 'listings', id, {})
    revalidatePath('/admin/marketplace/listings')
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    await requireAdmin('updateOrderStatus')

    const validated = orderStatusSchema.parse(status)

    const supabase = await createClient()
    const { error } = await supabase
      .from('orders')
      .update({ status: validated as any, updated_at: new Date().toISOString() } as any)
      .eq('id', id)

    if (error) return { error: error.message }

    await logAudit('update_order_status', 'orders', id, { status: validated })
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
    await requireAdmin('createHospital')

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

    const supabase = await createClient()
    const { data: hospital, error } = await supabase
      .from('hospitals')
      .insert(validated)
      .select()
      .single()

    if (error) return { error: error.message }

    await logAudit('create_hospital', 'hospitals', hospital.id, { name: validated.name })
    revalidatePath('/admin/services/vets')
    return { success: true, hospital }
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message }
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function updateHospital(id: string, formData: FormData) {
  try {
    await requireAdmin('updateHospital')

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

    const supabase = await createClient()
    const { error } = await supabase
      .from('hospitals')
      .update({ ...data, updated_at: new Date().toISOString() } as any)
      .eq('id', id)

    if (error) return { error: error.message }

    await logAudit('update_hospital', 'hospitals', id, { fields: Object.keys(data) })
    revalidatePath('/admin/services/vets')
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function linkVetToHospital(vetId: string, hospitalId: string) {
  try {
    await requireAdmin('linkVetToHospital')

    const supabase = await createClient()
    const { error } = await supabase
      .from('hospital_vets')
      .insert({ vet_id: vetId, hospital_id: hospitalId })

    if (error) return { error: error.message }

    await logAudit('link_vet_to_hospital', 'hospital_vets', `${vetId}-${hospitalId}`, { vetId, hospitalId })
    revalidatePath('/admin/services/vets')
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function createAdoptionCenter(formData: FormData) {
  try {
    await requireAdmin('createAdoptionCenter')

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

    const supabase = await createClient()
    const { data: center, error } = await supabase
      .from('adoption_centers')
      .insert(validated)
      .select()
      .single()

    if (error) return { error: error.message }

    await logAudit('create_adoption_center', 'adoption_centers', center.id, { name: validated.name })
    return { success: true, center }
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message }
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function updateAdoptionCenter(id: string, formData: FormData) {
  try {
    await requireAdmin('updateAdoptionCenter')

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

    const supabase = await createClient()
    const { error } = await supabase
      .from('adoption_centers')
      .update(data as any)
      .eq('id', id)

    if (error) return { error: error.message }

    await logAudit('update_adoption_center', 'adoption_centers', id, { fields: Object.keys(data) })
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function deleteAdoptionCenter(id: string) {
  try {
    await requireAdmin('deleteAdoptionCenter')

    const supabase = await createClient()
    const { error } = await supabase.from('adoption_centers').delete().eq('id', id)

    if (error) return { error: error.message }

    await logAudit('delete_adoption_center', 'adoption_centers', id, {})
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function updateProviderStatus(id: string, isVerified: boolean) {
  try {
    await requireAdmin('updateProviderStatus')

    const supabase = await createClient()
    const { error } = await supabase
      .from('service_provider_details')
      .update({ is_verified: isVerified })
      .eq('id', id)

    if (error) return { error: error.message }

    await logAudit('update_provider_status', 'service_provider_details', id, { is_verified: isVerified })
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function updateBookingStatus(id: string, status: string) {
  try {
    await requireAdmin('updateBookingStatus')

    const supabase = await createClient()
    const { error } = await supabase
      .from('appointments')
      .update({ status: status as any, updated_at: new Date().toISOString() } as any)
      .eq('id', id)

    if (error) return { error: error.message }

    await logAudit('update_booking_status', 'appointments', id, { status })
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function approvePost(id: string) {
  try {
    await requireAdmin('approvePost')

    const supabase = await createClient()
    const { error } = await supabase
      .from('community_posts')
      .update({ is_approved: true })
      .eq('id', id)

    if (error) return { error: error.message }

    await logAudit('approve_post', 'community_posts', id, {})
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function deletePost(id: string) {
  try {
    await requireAdmin('deletePost')

    const supabase = await createClient()
    const { error } = await supabase.from('community_posts').delete().eq('id', id)

    if (error) return { error: error.message }

    await logAudit('delete_post', 'community_posts', id, {})
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function togglePinPost(id: string, isPinned: boolean) {
  try {
    await requireAdmin('togglePinPost')

    const supabase = await createClient()
    const { error } = await supabase
      .from('community_posts')
      .update({ is_pinned: isPinned })
      .eq('id', id)

    if (error) return { error: error.message }

    await logAudit('toggle_pin_post', 'community_posts', id, { is_pinned: isPinned })
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function approveComment(id: string) {
  try {
    await requireAdmin('approveComment')

    const supabase = await createClient()
    const { error } = await supabase
      .from('community_comments')
      .update({ is_approved: true })
      .eq('id', id)

    if (error) return { error: error.message }

    await logAudit('approve_comment', 'community_comments', id, {})
    return { success: true }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function deleteComment(id: string) {
  try {
    await requireAdmin('deleteComment')

    const supabase = await createClient()
    const { error } = await supabase.from('community_comments').delete().eq('id', id)

    if (error) return { error: error.message }

    await logAudit('delete_comment', 'community_comments', id, {})
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

    await logAudit('resolve_moderation', 'moderation_queue', validated.itemId, {
      action: validated.action,
      notes: validated.notes,
    })
    return { success: true }
  } catch (e) {
    if (e instanceof z.ZodError) return { error: e.issues[0].message }
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}
