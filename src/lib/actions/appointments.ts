'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function bookAppointment(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const vet_id = formData.get('vet_id') as string
  const pet_id = formData.get('pet_id') as string
  const scheduled_at = formData.get('scheduled_at') as string
  const notes = formData.get('notes') as string
  const fee = Number(formData.get('fee'))
  const service_type = formData.get('service_type') as string || 'vet_consultation'

  const { data, error } = await supabase
    .from('service_bookings')
    .insert({
      provider_id: vet_id,
      customer_id: user.id,
      pet_id,
      service_type,
      scheduled_at,
      notes,
      fee,
      status: 'Scheduled'
    })
    .select()
    .single()

  if (error) {
    console.error('Booking error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/veterinary')

  return { success: true, booking: data }
}

export async function cancelAppointment(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const bookingId = formData.get('booking_id') as string

  const { error } = await supabase
    .from('service_bookings')
    .update({ status: 'Cancelled' })
    .eq('id', bookingId)
    .eq('customer_id', user.id)

  if (error) {
    console.error('Cancel error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/appointments')

  return { success: true }
}

export async function completeAppointment(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const bookingId = formData.get('booking_id') as string

  const { data: booking } = await supabase
    .from('service_bookings')
    .select('provider_id')
    .eq('id', bookingId)
    .single()

  if (!booking || booking.provider_id !== user.id) {
    return { error: 'Not authorized' }
  }

  const { error } = await supabase
    .from('service_bookings')
    .update({ status: 'Completed' })
    .eq('id', bookingId)

  if (error) {
    console.error('Complete error:', error)
    return { error: error.message }
  }

  revalidatePath('/vet-portal')
  revalidatePath('/vet-portal/appointments')

  return { success: true }
}
