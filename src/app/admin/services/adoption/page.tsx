import React from "react"
import { getAdoptionCenters } from "@/lib/queries/admin"
import { AdoptionPageClient } from "@/components/admin/AdoptionPageClient"

export default async function AdoptionPage() {
  const result = await getAdoptionCenters()

  return (
    <AdoptionPageClient data={result.data || []} />
  )
}
