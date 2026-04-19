'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function bookAppointment(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const vet_id = formData.get('vet_id') as string
  const pet_id = formData.get('pet_id') as string
  const scheduled_at = formData.get('scheduled_at') as string
  const notes = formData.get('notes') as string
  const fee = Number(formData.get('fee'))

  const { error } = await supabase
    .from('appointments')
    .insert({
      vet_id,
      parent_id: user.id,
      pet_id,
      scheduled_at,
      notes,
      fee,
      status: 'Scheduled'
    } as any)

  if (error) {
    console.error('Booking error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/veterinary')
  
  return redirect('/dashboard?message=Appointment booked successfully')
}
