'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createHospital(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'ADMIN' && profile.role !== 'SUPER_ADMIN') {
    return { error: 'Unauthorized' }
  }

  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const license_number = formData.get('license_number') as string
  const admin_id = formData.get('admin_id') as string

  const { data, error } = await supabase
    .from('hospitals')
    .insert({
      name,
      address,
      phone,
      email,
      license_number,
      admin_id
    })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/admin/services/vets')
  return { success: true, hospital: data }
}

export async function updateHospital(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'ADMIN' && profile.role !== 'SUPER_ADMIN') {
    return { error: 'Unauthorized' }
  }

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const license_number = formData.get('license_number') as string

  const { error } = await supabase
    .from('hospitals')
    .update({
      name,
      address,
      phone,
      email,
      license_number,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/services/vets')
  return { success: true }
}

export async function addVetToHospital(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'ADMIN' && profile.role !== 'SUPER_ADMIN') {
    return { error: 'Unauthorized' }
  }

  const hospitalId = formData.get('hospitalId') as string
  const vetId = formData.get('vetId') as string

  const { error } = await supabase
    .from('hospital_vets')
    .insert({
      hospital_id: hospitalId,
      vet_id: vetId
    })

  if (error) return { error: error.message }

  revalidatePath('/admin/services/vets')
  return { success: true }
}

export async function removeVetFromHospital(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'ADMIN' && profile.role !== 'SUPER_ADMIN') {
    return { error: 'Unauthorized' }
  }

  const hospitalId = formData.get('hospitalId') as string
  const vetId = formData.get('vetId') as string

  const { error } = await supabase
    .from('hospital_vets')
    .delete()
    .eq('hospital_id', hospitalId)
    .eq('vet_id', vetId)

  if (error) return { error: error.message }

  revalidatePath('/admin/services/vets')
  return { success: true }
}

export async function deleteHospital(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'ADMIN' && profile.role !== 'SUPER_ADMIN') {
    return { error: 'Unauthorized' }
  }

  const id = formData.get('id') as string

  const { error } = await supabase
    .from('hospitals')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/services/vets')
  return { success: true }
}