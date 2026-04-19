'use server'

import { createClient } from '@/lib/supabase/server'
import { createServerClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function reservePet(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return redirect('/login')
  }

  const listing_id = formData.get('listing_id') as string
  
  // Directly point the user to the verified payment flow instead of locking implicitly
  return redirect(`/checkout?listing_id=${listing_id}&type=escrow`)
}

export async function confirmEscrow(listing_id: string, price: number) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Authentication required" }
  }

  // Use service role client for writes to bypass RLS on this trusted server action
  const adminSupabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { get() { return undefined; }, set() {}, remove() {} } }
  )

  const { data: orderData, error: orderError } = await adminSupabase
    .from('orders')
    .insert({
      buyer_id: user.id,
      total_amount: price,
      status: 'Processing' as any // Represents 'In Escrow'
    } as never)
    .select()
    .single()

  if (orderError) {
    console.error('Order creation error:', orderError)
    return { error: orderError.message }
  }

  const order = orderData as any;

  // Create order item to represent the pet reservation
  const { error: itemError } = await adminSupabase
    .from('order_items')
    .insert({
      order_id: order.id,
      pet_listing_id: listing_id,
      quantity: 1,
      price_at_purchase: price
    } as never)

  if (itemError) {
    console.error('Order item creation error:', itemError)
    return { error: itemError.message }
  }

  // Update listing to Pending (Reserved/In Escrow)
  const { error: listingError } = await supabase
    .from('pet_listings')
    .update({ status: 'Pending' as any } as never)
    .eq('id', listing_id)

  if (listingError) {
    console.error('Listing update error:', listingError)
    return { error: listingError.message }
  }

  revalidatePath('/breeders')
  revalidatePath(`/breeders/pet/${listing_id}`)
  revalidatePath('/dashboard/orders')
  
  return { success: true }
}
