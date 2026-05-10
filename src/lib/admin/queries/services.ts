import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/types/supabase"

import { parseAdminPagination, parseAdminSort, totalPages } from "../pagination"
import type { AdminListResult, AdminSortDirection } from "../types"

type BookingRow = Database["public"]["Tables"]["service_bookings"]["Row"]
type ProviderRow = Database["public"]["Tables"]["service_provider_details"]["Row"]
type HospitalRow = Database["public"]["Tables"]["hospitals"]["Row"]
type AdoptionCenterRow = Database["public"]["Tables"]["adoption_centers"]["Row"]

type ProfileSummary = {
  id?: string
  role?: string | null
  full_name: string | null
  contact_email: string | null
  created_at?: string | null
}

type PetSummary = {
  name: string | null
}

export type AdminBookingListItem = BookingRow & {
  provider: ProfileSummary | null
  customer: ProfileSummary | null
  pet: PetSummary | null
}

export type AdminProviderListItem = ProviderRow & {
  profile: ProfileSummary | null
}

export type AdminHospitalListItem = HospitalRow & {
  admin: ProfileSummary | null
}

export type AdminAdoptionCenterListItem = AdoptionCenterRow & {
  owner: ProfileSummary | null
}

export interface ServiceListOptions {
  page?: string | number
  perPage?: string | number
  search?: string | null
  status?: string | null
  sort?: string | null
  direction?: string | null
  serviceType?: string | null
}

type ListQueryResult<TData> = {
  data: TData[] | null
  error: { message: string } | null
  count: number | null
}

interface ListQueryAdapter<TData> {
  or: (expression: string) => ListQueryAdapter<TData>
  eq: (column: string, value: unknown) => ListQueryAdapter<TData>
  order: (
    column: string,
    opts: { ascending: boolean },
  ) => {
    range: (from: number, to: number) => Promise<ListQueryResult<TData>>
  }
}

function parseDirection(input: string | null | undefined): AdminSortDirection {
  return input === "asc" ? "asc" : "desc"
}

function sanitizeSearchTerm(search: string | null | undefined) {
  if (typeof search !== "string") {
    return undefined
  }

  const trimmed = search.trim()
  if (!trimmed) {
    return undefined
  }

  return trimmed.replace(/[%*,]/g, " ")
}

function sanitizeText(input: string | null | undefined) {
  if (typeof input !== "string") {
    return undefined
  }

  const trimmed = input.trim()
  return trimmed ? trimmed : undefined
}

function parseVerifiedStatus(status: string | null | undefined) {
  const normalized = sanitizeText(status)?.toLowerCase()
  if (normalized === "verified") return true
  if (normalized === "unverified") return false
  return undefined
}

function resolveListOptions<TSort extends string>(
  options: ServiceListOptions,
  allowedSorts: readonly TSort[],
  fallbackSort: TSort,
) {
  const pagination = parseAdminPagination({
    page: options.page,
    perPage: options.perPage,
  })

  return {
    ...pagination,
    search: sanitizeSearchTerm(options.search),
    status: sanitizeText(options.status),
    serviceType: sanitizeText(options.serviceType),
    sort: parseAdminSort(options.sort, allowedSorts, fallbackSort),
    direction: parseDirection(options.direction),
  }
}

async function runListQuery<TData>({
  table,
  select,
  searchColumns,
  options,
  allowedSorts,
  fallbackSort,
  statusFilter,
  additionalFilters,
}: {
  table:
    | "service_bookings"
    | "service_provider_details"
    | "hospitals"
    | "adoption_centers"
  select: string
  searchColumns: readonly string[]
  options: ServiceListOptions
  allowedSorts: readonly string[]
  fallbackSort: string
  statusFilter?: (query: ListQueryAdapter<TData>, status: string) => ListQueryAdapter<TData>
  additionalFilters?: (
    query: ListQueryAdapter<TData>,
    parsed: ReturnType<typeof resolveListOptions>,
  ) => ListQueryAdapter<TData>
}): Promise<AdminListResult<TData>> {
  const supabase = await createClient()
  const parsed = resolveListOptions(options, allowedSorts, fallbackSort)

  let query = supabase.from(table).select(select, { count: "exact" }) as unknown as ListQueryAdapter<TData>

  if (parsed.search) {
    const searchExpression = searchColumns
      .map((column) => `${column}.ilike.%${parsed.search}%`)
      .join(",")
    query = query.or(searchExpression)
  }

  if (parsed.status && statusFilter) {
    query = statusFilter(query, parsed.status)
  }

  if (additionalFilters) {
    query = additionalFilters(query, parsed)
  }

  const { data, error, count } = await query
    .order(parsed.sort, { ascending: parsed.direction === "asc" })
    .range(parsed.from, parsed.to)

  if (error) {
    return {
      data: [],
      total: 0,
      page: parsed.page,
      perPage: parsed.perPage,
      totalPages: 1,
    }
  }

  const total = count ?? 0
  return {
    data: (data ?? []) as TData[],
    total,
    page: parsed.page,
    perPage: parsed.perPage,
    totalPages: totalPages(total, parsed.perPage),
  }
}

const BOOKING_SORTS = [
  "scheduled_at",
  "created_at",
  "service_type",
  "status",
  "fee",
] as const

const PROVIDER_SORTS = [
  "updated_at",
  "service_type",
  "specialization",
  "service_fee",
  "is_verified",
] as const

const HOSPITAL_SORTS = ["created_at", "name", "is_verified"] as const

const ADOPTION_CENTER_SORTS = [
  "created_at",
  "name",
  "type",
  "is_verified",
] as const

export async function listAdminBookings(
  options: ServiceListOptions = {},
): Promise<AdminListResult<AdminBookingListItem>> {
  return runListQuery<AdminBookingListItem>({
    table: "service_bookings",
    select:
      "*, provider:profiles!service_bookings_provider_id_fkey(full_name, contact_email), customer:profiles!service_bookings_customer_id_fkey(full_name, contact_email), pet:pets(name)",
    searchColumns: ["service_type", "status", "notes"],
    options,
    allowedSorts: BOOKING_SORTS,
    fallbackSort: "scheduled_at",
    statusFilter: (query, status) => query.eq("status", status),
  })
}

export async function getAdminBookingDetail(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("service_bookings")
    .select(
      "*, provider:profiles!service_bookings_provider_id_fkey(full_name, contact_email), customer:profiles!service_bookings_customer_id_fkey(full_name, contact_email), pet:pets(name)",
    )
    .eq("id", id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: data as AdminBookingListItem, error: null }
}

export async function listAdminProviders(
  options: ServiceListOptions = {},
): Promise<AdminListResult<AdminProviderListItem>> {
  return runListQuery<AdminProviderListItem>({
    table: "service_provider_details",
    select:
      "*, profile:profiles!service_provider_details_profile_id_fkey(id, full_name, contact_email, created_at, role)",
    searchColumns: ["service_type", "specialization", "license_number"],
    options,
    allowedSorts: PROVIDER_SORTS,
    fallbackSort: "updated_at",
    statusFilter: (query, status) => {
      const parsed = parseVerifiedStatus(status)
      return parsed === undefined ? query : query.eq("is_verified", parsed)
    },
    additionalFilters: (query, parsed) => {
      if (!parsed.serviceType) {
        return query
      }

      return query.eq("service_type", parsed.serviceType)
    },
  })
}

export async function getAdminProviderDetail(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("service_provider_details")
    .select(
      "*, profile:profiles!service_provider_details_profile_id_fkey(id, full_name, contact_email, created_at, role)",
    )
    .eq("id", id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: data as AdminProviderListItem, error: null }
}

export async function listAdminHospitals(
  options: ServiceListOptions = {},
): Promise<AdminListResult<AdminHospitalListItem>> {
  return runListQuery<AdminHospitalListItem>({
    table: "hospitals",
    select: "*, admin:profiles!hospitals_admin_id_fkey(full_name, contact_email)",
    searchColumns: ["name", "address", "phone", "email", "license_number"],
    options,
    allowedSorts: HOSPITAL_SORTS,
    fallbackSort: "created_at",
    statusFilter: (query, status) => {
      const parsed = parseVerifiedStatus(status)
      return parsed === undefined ? query : query.eq("is_verified", parsed)
    },
  })
}

export async function getAdminHospitalDetail(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("hospitals")
    .select(
      "*, admin:profiles!hospitals_admin_id_fkey(full_name, contact_email), hospital_vets(vet_id, vet:profiles!hospital_vets_vet_id_fkey(id, full_name, contact_email, is_verified))",
    )
    .eq("id", id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: data as AdminHospitalListItem, error: null }
}

export async function listAdminAdoptionCenters(
  options: ServiceListOptions = {},
): Promise<AdminListResult<AdminAdoptionCenterListItem>> {
  return runListQuery<AdminAdoptionCenterListItem>({
    table: "adoption_centers",
    select: "*, owner:profiles!adoption_centers_owner_id_fkey(full_name, contact_email)",
    searchColumns: ["name", "type", "address", "phone", "email", "license_number"],
    options,
    allowedSorts: ADOPTION_CENTER_SORTS,
    fallbackSort: "created_at",
    statusFilter: (query, status) => {
      const parsed = parseVerifiedStatus(status)
      return parsed === undefined ? query : query.eq("is_verified", parsed)
    },
  })
}

export async function getAdminAdoptionCenterDetail(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("adoption_centers")
    .select("*, owner:profiles!adoption_centers_owner_id_fkey(full_name, contact_email)")
    .eq("id", id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: data as AdminAdoptionCenterListItem, error: null }
}
