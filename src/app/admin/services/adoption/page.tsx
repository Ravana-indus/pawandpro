import React from "react"
import { AdoptionPageClient } from "@/components/admin/AdoptionPageClient"
import { listAdminAdoptionCenters } from "@/lib/admin/queries/services"

interface AdoptionPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key]
  return Array.isArray(value) ? value[0] : value
}

export default async function AdoptionPage({ searchParams }: AdoptionPageProps) {
  const params = await searchParams
  const result = await listAdminAdoptionCenters({
    page: readParam(params, "page"),
    perPage: readParam(params, "perPage"),
    search: readParam(params, "search"),
    status: readParam(params, "status"),
    sort: readParam(params, "sort"),
    direction: readParam(params, "direction"),
  })

  return (
    <AdoptionPageClient result={result} />
  )
}
