'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { writeAdminAuditLog } from '../audit'
import { requireAdminPermission } from '../permissions'
import { listingMetadataSchema, reasonSchema } from '../../schemas/admin'
import type { Database } from '../../../types/supabase'

type PetListingUpdate = Database['public']['Tables']['pet_listings']['Update']

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value : ''
}

function getNullableFormValue(formData: FormData, key: string) {
  const value = getFormValue(formData, key).trim()
  return value === '' ? null : value
}

export async function updateAdminListingMetadata(id: string, formData: FormData) {
  try {
    const { supabase, userId } = await requireAdminPermission('manage_marketplace')
    const { data: before, error: beforeError } = await supabase
      .from('pet_listings')
      .select('*')
      .eq('id', id)
      .single()

    if (beforeError || !before) {
      return { success: false, error: beforeError?.message ?? 'Listing not found' }
    }

    const parsed = listingMetadataSchema.parse({
      name: getFormValue(formData, 'name'),
      species: getFormValue(formData, 'species'),
      breed: getNullableFormValue(formData, 'breed'),
      sex: getNullableFormValue(formData, 'sex'),
      age: getNullableFormValue(formData, 'age'),
      price: Number(getFormValue(formData, 'price')),
      type: getFormValue(formData, 'type'),
      status: getFormValue(formData, 'status') || undefined,
      certification_tier: getNullableFormValue(formData, 'certification_tier'),
      image_url: getNullableFormValue(formData, 'image_url'),
    })

    const updatePayload: PetListingUpdate = {
      name: parsed.name,
      species: parsed.species,
      breed: parsed.breed ?? null,
      sex: parsed.sex ?? null,
      age: parsed.age ?? null,
      price: parsed.price,
      type: parsed.type,
      certification_tier: parsed.certification_tier ?? null,
      image_url: parsed.image_url ?? null,
    }

    if (parsed.status !== undefined) {
      updatePayload.status = parsed.status
    }

    const { data: after, error: updateError } = await supabase
      .from('pet_listings')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single()

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    await writeAdminAuditLog(supabase, {
      actorId: userId,
      action: 'update_listing',
      targetType: 'pet_listings',
      targetId: id,
      before,
      after,
    })

    revalidatePath('/admin/marketplace/listings')
    revalidatePath(`/admin/marketplace/listings/${id}`)

    return { success: true, data: after }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? 'Invalid listing metadata' }
    }

    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function deleteAdminListing(id: string, reason: string) {
  try {
    const parsedReason = reasonSchema.parse(reason)
    const { supabase, userId } = await requireAdminPermission('manage_marketplace')
    const { data: before, error: beforeError } = await supabase
      .from('pet_listings')
      .select('*')
      .eq('id', id)
      .single()

    if (beforeError || !before) {
      return { success: false, error: beforeError?.message ?? 'Listing not found' }
    }

    const { error: deleteError } = await supabase
      .from('pet_listings')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return { success: false, error: deleteError.message }
    }

    await writeAdminAuditLog(supabase, {
      actorId: userId,
      action: 'delete_listing',
      targetType: 'pet_listings',
      targetId: id,
      reason: parsedReason,
      before,
    })

    revalidatePath('/admin/marketplace/listings')
    revalidatePath(`/admin/marketplace/listings/${id}`)

    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? 'Reason is required' }
    }

    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
