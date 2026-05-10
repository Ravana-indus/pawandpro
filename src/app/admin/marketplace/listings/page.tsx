import React from "react"
import { ListingsPageClient } from "@/components/admin/ListingsPageClient"
import { listAdminListings } from "@/lib/admin/queries/marketplace"

interface ListingsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key]
  return Array.isArray(value) ? value[0] : value
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams
  const result = await listAdminListings({
    page: readParam(params, "page"),
    perPage: readParam(params, "perPage"),
    search: readParam(params, "search"),
    status: readParam(params, "status"),
    sort: readParam(params, "sort"),
    direction: readParam(params, "direction"),
  })

  return (
    <ListingsPageClient result={result} />
  )
}
