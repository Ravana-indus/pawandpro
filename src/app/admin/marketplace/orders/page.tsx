import React from "react"
import { OrdersPageClient } from "@/components/admin/OrdersPageClient"
import { listAdminOrders } from "@/lib/admin/queries/marketplace"

interface OrdersPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key]
  return Array.isArray(value) ? value[0] : value
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams
  const result = await listAdminOrders({
    page: readParam(params, "page"),
    perPage: readParam(params, "perPage"),
    search: readParam(params, "search"),
    status: readParam(params, "status"),
    sort: readParam(params, "sort"),
    direction: readParam(params, "direction"),
  })

  return (
    <OrdersPageClient result={result} />
  )
}
