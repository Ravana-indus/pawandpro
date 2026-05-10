import React from "react"
import { createClient } from "@/lib/supabase/server"
import { ListingsPageClient } from "@/components/admin/ListingsPageClient"

export default async function ListingsPage() {
  const supabase = await createClient()
  const { data: listings } = await supabase
    .from('pet_listings')
    .select('*, seller:profiles!pet_listings_seller_id_fkey(full_name, contact_email)')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <ListingsPageClient listings={listings || []} />
  )
}
