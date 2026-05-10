import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/types/supabase"

import { parseAdminPagination, parseAdminSort, totalPages } from "../pagination"
import type { AdminListResult, AdminSortDirection } from "../types"

type ListingRow = Database["public"]["Tables"]["pet_listings"]["Row"]
type ProductRow = Database["public"]["Tables"]["products"]["Row"]
type OrderRow = Database["public"]["Tables"]["orders"]["Row"]

type ProfileSummary = {
  full_name: string | null
  contact_email: string | null
}

export type AdminListingListItem = ListingRow & { seller: ProfileSummary | null }
export type AdminProductListItem = ProductRow & { seller: ProfileSummary | null }
export type AdminOrderListItem = OrderRow & { buyer: ProfileSummary | null }

export interface MarketplaceListOptions {
  page?: string | number
  perPage?: string | number
  search?: string | null
  status?: string | null
  sort?: string | null
  direction?: string | null
}

type MarketplaceSort = string
type ListQueryResult<TData> = {
  data: TData[] | null
  error: { message: string } | null
  count: number | null
}

interface ListQueryAdapter<TData> {
  or: (expression: string) => ListQueryAdapter<TData>
  eq: (column: string, value: string) => ListQueryAdapter<TData>
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

function sanitizeStatus(status: string | null | undefined) {
  if (typeof status !== "string") {
    return undefined
  }

  const trimmed = status.trim()
  return trimmed ? trimmed : undefined
}

function resolveListOptions<TSort extends MarketplaceSort>(
  options: MarketplaceListOptions,
  allowedSorts: readonly TSort[],
  fallbackSort: TSort,
) {
  const pagination = parseAdminPagination({
    page: options.page,
    perPage: options.perPage,
  })
  const search = sanitizeSearchTerm(options.search)
  const status = sanitizeStatus(options.status)
  const sort = parseAdminSort(options.sort, allowedSorts, fallbackSort)
  const direction = parseDirection(options.direction)

  return {
    ...pagination,
    search,
    status,
    sort,
    direction,
  }
}

async function listMarketplaceEntities<TData, TSort extends MarketplaceSort>({
  table,
  select,
  searchColumns,
  options,
  allowedSorts,
  fallbackSort,
}: {
  table: "pet_listings" | "products" | "orders"
  select: string
  searchColumns: readonly string[]
  options: MarketplaceListOptions
  allowedSorts: readonly TSort[]
  fallbackSort: TSort
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

  if (parsed.status) {
    query = query.eq("status", parsed.status)
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

export async function listAdminListings(
  options: MarketplaceListOptions = {},
): Promise<AdminListResult<AdminListingListItem>> {
  return listMarketplaceEntities<AdminListingListItem, ListingSort>({
    table: "pet_listings",
    select:
      "*, seller:profiles!pet_listings_seller_id_fkey(full_name, contact_email)",
    searchColumns: ["name", "species", "breed", "type"],
    options,
    allowedSorts: LISTING_SORTS,
    fallbackSort: "created_at",
  })
}

export async function getAdminListingDetail(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("pet_listings")
    .select("*, seller:profiles!pet_listings_seller_id_fkey(full_name, contact_email)")
    .eq("id", id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: data as AdminListingListItem, error: null }
}

export async function listAdminProducts(
  options: MarketplaceListOptions = {},
): Promise<AdminListResult<AdminProductListItem>> {
  return listMarketplaceEntities<AdminProductListItem, ProductSort>({
    table: "products",
    select: "*, seller:profiles!products_seller_id_fkey(full_name, contact_email)",
    searchColumns: ["name", "brand", "category", "description"],
    options,
    allowedSorts: PRODUCT_SORTS,
    fallbackSort: "created_at",
  })
}

export async function getAdminProductDetail(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select("*, seller:profiles!products_seller_id_fkey(full_name, contact_email)")
    .eq("id", id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: data as AdminProductListItem, error: null }
}

export async function listAdminOrders(
  options: MarketplaceListOptions = {},
): Promise<AdminListResult<AdminOrderListItem>> {
  return listMarketplaceEntities<AdminOrderListItem, OrderSort>({
    table: "orders",
    select: "*, buyer:profiles!orders_buyer_id_fkey(full_name, contact_email)",
    searchColumns: ["status", "shipping_status", "payment_status"],
    options,
    allowedSorts: ORDER_SORTS,
    fallbackSort: "created_at",
  })
}

export async function getAdminOrderDetail(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("orders")
    .select("*, buyer:profiles!orders_buyer_id_fkey(full_name, contact_email)")
    .eq("id", id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: data as AdminOrderListItem, error: null }
}

const LISTING_SORTS = [
  "created_at",
  "name",
  "price",
  "species",
  "type",
  "status",
] as const
type ListingSort = (typeof LISTING_SORTS)[number]

const PRODUCT_SORTS = [
  "created_at",
  "name",
  "price",
  "brand",
  "category",
  "stock_quantity",
  "status",
] as const
type ProductSort = (typeof PRODUCT_SORTS)[number]

const ORDER_SORTS = ["created_at", "total_amount", "status"] as const
type OrderSort = (typeof ORDER_SORTS)[number]
