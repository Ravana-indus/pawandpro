import React from "react"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EntityHeader } from "@/components/admin/EntityHeader"
import { AdoptionCenterDetailClient } from "@/components/admin/AdoptionCenterDetailClient"

interface AdoptionCenterDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AdoptionCenterDetailPage({ params }: AdoptionCenterDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: center, error } = await supabase
    .from('adoption_centers')
    .select(`
      *,
      owner:profiles!adoption_centers_owner_id_fkey (
        full_name,
        contact_email
      )
    `)
    .eq('id', id)
    .single()

  if (error || !center) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <EntityHeader
        title={center.name}
        subtitle={`Adoption center details`}
        backHref="/admin/services/adoption"
        backLabel="Adoption Centers"
      />
      <AdoptionCenterDetailClient center={center as Parameters<typeof AdoptionCenterDetailClient>[0]['center']} />
    </div>
  )
}