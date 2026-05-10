import React from "react"
import { ProvidersPageClient } from "@/components/admin/ProvidersPageClient"
import { listAdminProviders } from "@/lib/admin/queries/services"

interface ProvidersPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key]
  return Array.isArray(value) ? value[0] : value
}

export default async function ProvidersPage({ searchParams }: ProvidersPageProps) {
  const params = await searchParams
  const result = await listAdminProviders({
    page: readParam(params, "page"),
    perPage: readParam(params, "perPage"),
    search: readParam(params, "search"),
    status: readParam(params, "status"),
    sort: readParam(params, "sort"),
    direction: readParam(params, "direction"),
    serviceType: readParam(params, "serviceType"),
  })

  return (
    <ProvidersPageClient result={result} />
  )
}
