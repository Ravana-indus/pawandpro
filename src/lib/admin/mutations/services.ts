'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { writeAdminAuditLog } from '../audit'
import { requireAdminPermission } from '../permissions'
import { adoptionCenterSchema, hospitalSchema, reasonSchema } from '../../schemas/admin'
import type { Database } from '../../../types/supabase'

type BookingRow = Database['public']['Tables']['service_bookings']['Row']
type ProviderRow = Database['public']['Tables']['service_provider_details']['Row']
type HospitalRow = Database['public']['Tables']['hospitals']['Row']
type AdoptionCenterRow = Database['public']['Tables']['adoption_centers']['Row']
type HospitalUpdate = Database['public']['Tables']['hospitals']['Update']
type AdoptionCenterUpdate = Database['public']['Tables']['adoption_centers']['Update']

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value : ''
}

function getOptionalFormValue(formData: FormData, key: string) {
  const value = getFormValue(formData, key).trim()
  return value ? value : undefined
}

function getOptionalNullableFormValue(formData: FormData, key: string) {
  const value = getFormValue(formData, key).trim()
  return value ? value : null
}

function getOptionalBooleanFormValue(formData: FormData, key: string) {
  const raw = getOptionalFormValue(formData, key)
  if (raw === undefined) return undefined
  if (raw === 'true' || raw === 'on') return true
  if (raw === 'false') return false
  return undefined
}

export async function cancelAdminBooking(id: string, reason: string) {
  try {
    const parsedReason = reasonSchema.parse(reason)
    const { supabase, userId } = await requireAdminPermission('manage_services')

    const { data: before, error: beforeError } = await supabase
      .from('service_bookings')
      .select('*')
      .eq('id', id)
      .single()

    if (beforeError || !before) {
      return { success: false, error: beforeError?.message ?? 'Booking not found' }
    }

    const { data: after, error: updateError } = await supabase
      .from('service_bookings')
      .update({ status: 'Cancelled' })
      .eq('id', id)
      .select('*')
      .single()

    if (updateError || !after) {
      return { success: false, error: updateError?.message ?? 'Failed to cancel booking' }
    }

    await writeAdminAuditLog(supabase, {
      actorId: userId,
      action: 'cancel_booking',
      targetType: 'service_bookings',
      targetId: id,
      reason: parsedReason,
      before: before as BookingRow,
      after: after as BookingRow,
    })

    revalidatePath('/admin/services/bookings')
    revalidatePath(`/admin/services/bookings/${id}`)

    return { success: true, data: after }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? 'Reason is required' }
    }

    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function updateAdminProviderVerification(
  id: string,
  isVerified: boolean,
  reason: string,
) {
  try {
    const parsedReason = reasonSchema.parse(reason)
    const { supabase, userId } = await requireAdminPermission('manage_services')

    const { data: before, error: beforeError } = await supabase
      .from('service_provider_details')
      .select('*')
      .eq('id', id)
      .single()

    if (beforeError || !before) {
      return { success: false, error: beforeError?.message ?? 'Provider not found' }
    }

    const { data: after, error: updateError } = await supabase
      .from('service_provider_details')
      .update({
        is_verified: isVerified,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single()

    if (updateError || !after) {
      return { success: false, error: updateError?.message ?? 'Failed to update provider verification' }
    }

    await writeAdminAuditLog(supabase, {
      actorId: userId,
      action: 'update_provider_verification',
      targetType: 'service_provider_details',
      targetId: id,
      reason: parsedReason,
      before: before as ProviderRow,
      after: after as ProviderRow,
      metadata: {
        is_verified: isVerified,
      },
    })

    revalidatePath('/admin/services/providers')
    revalidatePath(`/admin/services/providers/${id}`)

    return { success: true, data: after }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? 'Reason is required' }
    }

    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function updateAdminHospitalMetadata(id: string, formData: FormData) {
  try {
    const { supabase, userId } = await requireAdminPermission('manage_vets')

    const { data: before, error: beforeError } = await supabase
      .from('hospitals')
      .select('*')
      .eq('id', id)
      .single()

    if (beforeError || !before) {
      return { success: false, error: beforeError?.message ?? 'Hospital not found' }
    }

    const parsed = hospitalSchema.parse({
      name: getFormValue(formData, 'name'),
      address: getOptionalFormValue(formData, 'address'),
      phone: getOptionalFormValue(formData, 'phone'),
      email: getOptionalFormValue(formData, 'email'),
      license_number: getOptionalFormValue(formData, 'license_number'),
      admin_id: getOptionalFormValue(formData, 'admin_id'),
      is_verified: getOptionalBooleanFormValue(formData, 'is_verified'),
    })

    const updatePayload: HospitalUpdate = {
      name: parsed.name,
      address: getOptionalNullableFormValue(formData, 'address'),
      phone: getOptionalNullableFormValue(formData, 'phone'),
      email: getOptionalNullableFormValue(formData, 'email'),
      license_number: getOptionalNullableFormValue(formData, 'license_number'),
      admin_id: getOptionalNullableFormValue(formData, 'admin_id'),
      updated_at: new Date().toISOString(),
    }

    if (parsed.is_verified !== undefined) {
      updatePayload.is_verified = parsed.is_verified
    }

    const { data: after, error: updateError } = await supabase
      .from('hospitals')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single()

    if (updateError || !after) {
      return { success: false, error: updateError?.message ?? 'Failed to update hospital' }
    }

    await writeAdminAuditLog(supabase, {
      actorId: userId,
      action: 'update_hospital',
      targetType: 'hospitals',
      targetId: id,
      before: before as HospitalRow,
      after: after as HospitalRow,
    })

    revalidatePath('/admin/services/vets')
    revalidatePath(`/admin/services/vets/hospitals/${id}`)

    return { success: true, data: after }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? 'Invalid hospital metadata' }
    }

    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function updateAdminAdoptionCenterMetadata(id: string, formData: FormData) {
  try {
    const { supabase, userId } = await requireAdminPermission('manage_adoption')

    const { data: before, error: beforeError } = await supabase
      .from('adoption_centers')
      .select('*')
      .eq('id', id)
      .single()

    if (beforeError || !before) {
      return { success: false, error: beforeError?.message ?? 'Adoption center not found' }
    }

    const parsed = adoptionCenterSchema.parse({
      name: getFormValue(formData, 'name'),
      type: getOptionalFormValue(formData, 'type'),
      address: getOptionalFormValue(formData, 'address'),
      phone: getOptionalFormValue(formData, 'phone'),
      email: getOptionalFormValue(formData, 'email'),
      license_number: getOptionalFormValue(formData, 'license_number'),
      owner_id: getOptionalFormValue(formData, 'owner_id'),
      is_verified: getOptionalBooleanFormValue(formData, 'is_verified'),
    })

    const updatePayload: AdoptionCenterUpdate = {
      name: parsed.name,
      type: getOptionalNullableFormValue(formData, 'type'),
      address: getOptionalNullableFormValue(formData, 'address'),
      phone: getOptionalNullableFormValue(formData, 'phone'),
      email: getOptionalNullableFormValue(formData, 'email'),
      license_number: getOptionalNullableFormValue(formData, 'license_number'),
      owner_id: getOptionalNullableFormValue(formData, 'owner_id'),
      updated_at: new Date().toISOString(),
    }

    if (parsed.is_verified !== undefined) {
      updatePayload.is_verified = parsed.is_verified
    }

    const { data: after, error: updateError } = await supabase
      .from('adoption_centers')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single()

    if (updateError || !after) {
      return { success: false, error: updateError?.message ?? 'Failed to update adoption center' }
    }

    await writeAdminAuditLog(supabase, {
      actorId: userId,
      action: 'update_adoption_center',
      targetType: 'adoption_centers',
      targetId: id,
      before: before as AdoptionCenterRow,
      after: after as AdoptionCenterRow,
    })

    revalidatePath('/admin/services/adoption')
    revalidatePath(`/admin/services/adoption/${id}`)

    return { success: true, data: after }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message ?? 'Invalid adoption center metadata' }
    }

    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
