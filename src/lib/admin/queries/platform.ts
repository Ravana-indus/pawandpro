import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/types/supabase"

import { parseAdminPagination, parseAdminSort, totalPages } from "../pagination"
import type { AdminListResult, AdminSortDirection } from "../types"

type AuditLogRow = Database["public"]["Tables"]["audit_logs"]["Row"]
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]

export type AdminAuditLogItem = AuditLogRow

export interface AdminAuditLogOptions {
  page?: string | number
  perPage?: string | number
  action?: string | null
  targetType?: string | null
  actorId?: string | null
  dateFrom?: string | null
  dateTo?: string | null
  [key: string]: unknown
}

export type AdminStaffListItem = ProfileRow & {
  admin_permissions: Record<string, boolean> | null
}

export interface AdminStaffListOptions {
  page?: string | number
  perPage?: string | number
  search?: string | null
  role?: string | null
  sort?: string | null
  direction?: string | null
  [key: string]: unknown
}

type ListQueryResult<TData> = {
  data: TData[] | null
  error: { message: string } | null
  count: number | null
}

interface ListQueryAdapter<TData> {
  or: (expression: string) => ListQueryAdapter<TData>
  eq: (column: string, value: unknown) => ListQueryAdapter<TData>
  gte: (column: string, value: string) => ListQueryAdapter<TData>
  lte: (column: string, value: string) => ListQueryAdapter<TData>
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

function sanitizeText(input: string | null | undefined) {
  if (typeof input !== "string") {
    return undefined
  }

  const trimmed = input.trim()
  return trimmed ? trimmed : undefined
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

const AUDIT_LOG_SORTS = ["created_at", "action", "target_type"] as const

const STAFF_SORTS = [
  "created_at",
  "full_name",
  "contact_email",
  "role",
] as const

async function runListQuery<TData>({
  table,
  select,
  searchColumns,
  options,
  allowedSorts,
  fallbackSort,
  additionalFilters,
}: {
  table: "audit_logs" | "profiles"
  select: string
  searchColumns: readonly string[]
  options: Record<string, unknown>
  allowedSorts: readonly string[]
  fallbackSort: string
  additionalFilters?: (
    query: ListQueryAdapter<TData>,
    parsed: Record<string, unknown>,
  ) => ListQueryAdapter<TData>
}): Promise<AdminListResult<TData>> {
  const supabase = await createClient()

  const pagination = parseAdminPagination({
    page: options.page as string | number | undefined,
    perPage: options.perPage as string | number | undefined,
  })

  const search = sanitizeSearchTerm(options.search as string | null | undefined)
  const sort = parseAdminSort(options.sort as string | null | undefined, allowedSorts, fallbackSort)
  const direction = parseDirection(options.direction as string | null | undefined)

  let query = supabase.from(table).select(select, { count: "exact" }) as unknown as ListQueryAdapter<TData>

  if (search && searchColumns.length > 0) {
    const searchExpression = searchColumns
      .map((column) => `${column}.ilike.%${search}%`)
      .join(",")
    query = query.or(searchExpression)
  }

  if (additionalFilters) {
    query = additionalFilters(query, options)
  }

  const { data, error, count } = await query
    .order(sort, { ascending: direction === "asc" })
    .range(pagination.from, pagination.to)

  if (error) {
    return {
      data: [],
      total: 0,
      page: pagination.page,
      perPage: pagination.perPage,
      totalPages: 1,
    }
  }

  const total = count ?? 0
  return {
    data: (data ?? []) as TData[],
    total,
    page: pagination.page,
    perPage: pagination.perPage,
    totalPages: totalPages(total, pagination.perPage),
  }
}

export async function listAdminAuditLogs(
  options: AdminAuditLogOptions = {},
): Promise<AdminListResult<AdminAuditLogItem>> {
  return runListQuery<AdminAuditLogItem>({
    table: "audit_logs",
    select: "*",
    searchColumns: [],
    options,
    allowedSorts: AUDIT_LOG_SORTS,
    fallbackSort: "created_at",
    additionalFilters: (query, parsed) => {
      const action = sanitizeText(parsed.action as string | null | undefined)
      if (action) {
        query = query.eq("action", action)
      }

      const targetType = sanitizeText(parsed.targetType as string | null | undefined)
      if (targetType) {
        query = query.eq("target_type", targetType)
      }

      const actorId = sanitizeText(parsed.actorId as string | null | undefined)
      if (actorId) {
        query = query.eq("actor_id", actorId)
      }

      const dateFrom = sanitizeText(parsed.dateFrom as string | null | undefined)
      if (dateFrom) {
        query = query.gte("created_at", dateFrom)
      }

      const dateTo = sanitizeText(parsed.dateTo as string | null | undefined)
      if (dateTo) {
        query = query.lte("created_at", dateTo)
      }

      return query
    },
  })
}

export async function listAdminStaff(
  options: AdminStaffListOptions = {},
): Promise<AdminListResult<AdminStaffListItem>> {
  return runListQuery<AdminStaffListItem>({
    table: "profiles",
    select: "*, admin_permissions",
    searchColumns: ["full_name", "contact_email"],
    options,
    allowedSorts: STAFF_SORTS,
    fallbackSort: "created_at",
    additionalFilters: (query, parsed) => {
      const role = sanitizeText(parsed.role as string | null | undefined)
      if (role) {
        query = query.eq("role", role)
      }

      return query
    },
  })
}
