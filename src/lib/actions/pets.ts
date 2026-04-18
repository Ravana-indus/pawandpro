'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPet(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const name = formData.get('name') as string
  const species = formData.get('species') as any
  const breed = formData.get('breed') as string
  const sex = formData.get('sex') as any
  const age = formData.get('age') as string
  const image_url = formData.get('image_url') as string

  const { data, error } = await supabase
    .from('pets')
    .insert({
      owner_id: user.id,
      name,
      species: species.charAt(0).toUpperCase() + species.slice(1), // Match enum case
      breed,
      sex: sex.charAt(0).toUpperCase() + sex.slice(1), // Match enum case
      age,
      image_url: image_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&h=400&fit=crop"
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating pet:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/pets')
  
  return redirect(`/dashboard/pets/${data.id}`)
}

export async function deletePet(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const petId = formData.get('pet_id') as string

  const { error } = await supabase
    .from('pets')
    .delete()
    .eq('id', petId)
    .eq('owner_id', user.id)

  if (error) {
    console.error('Error deleting pet:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/pets')
  
  return redirect('/dashboard/pets')
}
