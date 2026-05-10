import React from "react"
import { createClient } from "@/lib/supabase/server"
import { ProductsPageClient } from "@/components/admin/ProductsPageClient"

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, seller:profiles!products_seller_id_fkey(full_name, contact_email)')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <ProductsPageClient products={products || []} />
  )
}
