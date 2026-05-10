import React from "react"
import { createClient } from "@/lib/supabase/server"
import { OrdersPageClient } from "@/components/admin/OrdersPageClient"

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*, buyer:profiles!orders_buyer_id_fkey(full_name, contact_email)')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <OrdersPageClient orders={orders || []} />
  )
}
