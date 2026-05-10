import React from "react"
import { createClient } from "@/lib/supabase/server"
import { getHospitals } from "@/lib/queries/admin"
import { VetsPageClient } from "@/components/admin/VetsPageClient"

export default async function VetsPage() {
  const supabase = await createClient()
  const { data: vets } = await supabase
    .from('profiles')
    .select(`
      *,
      service_provider_details (
        specialization,
        is_verified,
        service_fee
      )
    `)
    .eq('role', 'VET')
    .order('created_at', { ascending: false })
    .limit(50)

  const hospitals = await getHospitals()

  return (
    <VetsPageClient
      vets={vets || []}
      hospitals={hospitals.data || []}
    />
  )
}
