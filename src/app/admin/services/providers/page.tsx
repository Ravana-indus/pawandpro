import React from "react"
import { getServiceProviders } from "@/lib/queries/admin"
import { ProvidersPageClient } from "@/components/admin/ProvidersPageClient"

export default async function ProvidersPage() {
  const result = await getServiceProviders()

  return (
    <ProvidersPageClient data={result.data || []} />
  )
}
