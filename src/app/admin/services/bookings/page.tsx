import React from "react"
import { BookingsPageClient } from "@/components/admin/BookingsPageClient"
import { listAdminBookings } from "@/lib/admin/queries/services"

interface BookingsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key]
  return Array.isArray(value) ? value[0] : value
}

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  const params = await searchParams
  const result = await listAdminBookings({
    page: readParam(params, "page"),
    perPage: readParam(params, "perPage"),
    search: readParam(params, "search"),
    status: readParam(params, "status"),
    sort: readParam(params, "sort"),
    direction: readParam(params, "direction"),
  })

  return (
    <BookingsPageClient result={result} />
  )
}
