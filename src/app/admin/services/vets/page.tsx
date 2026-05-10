import React from "react"
import { createClient } from "@/lib/supabase/server"
import { VetsPageClient } from "@/components/admin/VetsPageClient"
import { listAdminHospitals } from "@/lib/admin/queries/services"
import { parseAdminPagination, parseAdminSort, totalPages } from "@/lib/admin/pagination"

interface VetsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
) {
  const value = params[key]
  return Array.isArray(value) ? value[0] : value
}

export default async function VetsPage({ searchParams }: VetsPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  const pagination = parseAdminPagination({
    page: readParam(params, "page"),
    perPage: readParam(params, "perPage"),
  })
  const search = readParam(params, "search")?.trim()
  const sort = parseAdminSort(
    readParam(params, "sort"),
    ["created_at", "full_name", "contact_email"] as const,
    "created_at",
  )
  const direction = readParam(params, "direction") === "asc" ? "asc" : "desc"

  let query = supabase
    .from('profiles')
    .select(`
      *,
      service_provider_details (
        specialization,
        is_verified,
        service_fee
      )
    `, { count: 'exact' })
    .eq('role', 'VET')

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,contact_email.ilike.%${search}%`)
  }

  const { data: vets, count } = await query
    .order(sort, { ascending: direction === "asc" })
    .range(pagination.from, pagination.to)

  const hospitals = await listAdminHospitals({ perPage: 10, sort: "created_at", direction: "desc" })
  const vetsResult = {
    data: vets || [],
    total: count || 0,
    page: pagination.page,
    perPage: pagination.perPage,
    totalPages: totalPages(count || 0, pagination.perPage),
  }

  return (
    <VetsPageClient
      result={vetsResult}
      hospitals={hospitals.data}
    />
  )
}
