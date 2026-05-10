import React from "react"
import { ProductsPageClient } from "@/components/admin/ProductsPageClient"
import { listAdminProducts } from "@/lib/admin/queries/marketplace"

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key]
  return Array.isArray(value) ? value[0] : value
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const result = await listAdminProducts({
    page: readParam(params, "page"),
    perPage: readParam(params, "perPage"),
    search: readParam(params, "search"),
    status: readParam(params, "status"),
    sort: readParam(params, "sort"),
    direction: readParam(params, "direction"),
  })

  return (
    <ProductsPageClient result={result} />
  )
}
