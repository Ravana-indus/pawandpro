import React from "react"
import { createClient } from "@/lib/supabase/server"
import { BookingsPageClient } from "@/components/admin/BookingsPageClient"

export default async function BookingsPage() {
  const supabase = await createClient()
  const { data: bookings } = await supabase
    .from('service_bookings')
    .select(`
      *,
      provider:profiles!service_bookings_provider_id_fkey(full_name),
      customer:profiles!service_bookings_customer_id_fkey(full_name),
      pet:pets(name)
    `)
    .order('scheduled_at', { ascending: false })
    .limit(50)

  return (
    <BookingsPageClient bookings={bookings || []} />
  )
}
