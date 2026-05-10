import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/types/supabase"

import { parseAdminPagination, parseAdminSort, totalPages } from "../pagination"
import type { AdminListResult, AdminSortDirection } from "../types"

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]
type SellerVerificationRow = Database["public"]["Tables"]["seller_verifications"]["Row"]
type ModerationQueueRow = Database["public"]["Tables"]["moderation_queue"]["Row"]
type CommunityPostRow = Database["public"]["Tables"]["community_posts"]["Row"]
type CommunityCommentRow = Database["public"]["Tables"]["community_comments"]["Row"]

export type AdminUserListItem = ProfileRow & {
  seller_verifications: Pick<SellerVerificationRow, "id" | "status" | "tier" | "reviewed_at">[] | null
}

export type AdminVerificationListItem = ProfileRow & {
  seller_verifications: Pick<SellerVerificationRow, "id" | "status" | "tier" | "reviewed_at">[] | null
}

export type AdminModerationQueueItem = ModerationQueueRow & {
  flagged_by_profile: Pick<ProfileRow, "full_name" | "contact_email"> | null
}

export type AdminPostListItem = CommunityPostRow & {
  author: Pick<ProfileRow, "full_name" | "avatar_url"> | null
  community_comments: Pick<CommunityCommentRow, "id">[] | null
}

export type AdminCommentListItem = CommunityCommentRow & {
  author: Pick<ProfileRow, "full_name"> | null
  post: Pick<CommunityPostRow, "title"> | null
}

export interface AdminUserListOptions {
  page?: string | number
  perPage?: string | number
  search?: string | null
  role?: string | null
  status?: string | null
  sort?: string | null
  direction?: string | null
  [key: string]: unknown
}

export interface AdminVerificationListOptions {
  page?: string | number
  perPage?: string | number
  search?: string | null
  status?: string | null
  [key: string]: unknown
}

export interface AdminModerationQueueOptions {
  page?: string | number
  perPage?: string | number
  status?: string | null
  itemType?: string | null
  sort?: string | null
  direction?: string | null
  [key: string]: unknown
}

export interface AdminPostListOptions {
  page?: string | number
  perPage?: string | number
  search?: string | null
  isApproved?: string | null
  type?: string | null
  sort?: string | null
  direction?: string | null
  [key: string]: unknown
}

export interface AdminCommentListOptions {
  page?: string | number
  perPage?: string | number
  search?: string | null
  isApproved?: string | null
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

function parseApprovalStatus(isApproved: string | null | undefined) {
  const normalized = sanitizeText(isApproved)?.toLowerCase()
  if (normalized === "true") return true
  if (normalized === "false") return false
  return undefined
}

const USER_SORTS = [
  "created_at",
  "full_name",
  "contact_email",
  "role",
  "verification_status",
] as const

const VERIFICATION_SORTS = ["created_at", "full_name", "verification_status"] as const

const MODERATION_SORTS = ["created_at", "status", "item_type"] as const

const POST_SORTS = ["created_at", "title", "type", "is_approved", "is_pinned"] as const

const COMMENT_SORTS = ["created_at", "is_approved"] as const

async function runListQuery<TData>({
  table,
  select,
  searchColumns,
  options,
  allowedSorts,
  fallbackSort,
  additionalFilters,
}: {
  table:
    | "profiles"
    | "moderation_queue"
    | "community_posts"
    | "community_comments"
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

  if (search) {
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

export async function listAdminUsers(
  options: AdminUserListOptions = {},
): Promise<AdminListResult<AdminUserListItem>> {
  return runListQuery<AdminUserListItem>({
    table: "profiles",
    select: "*, seller_verifications(id, status, tier, reviewed_at)",
    searchColumns: ["full_name", "contact_email"],
    options,
    allowedSorts: USER_SORTS,
    fallbackSort: "created_at",
    additionalFilters: (query, parsed) => {
      if (parsed.role) {
        query = query.eq("role", parsed.role)
      }

      const status = parsed.status as string | null | undefined
      if (status === "banned") {
        query = query.or(`banned_until.is.null,banned_until.lt.${new Date().toISOString()}`)
      } else if (status === "active") {
        query = query.or(`banned_until.is.null,banned_until.gt.${new Date().toISOString()}`)
      } else if (status === "pending") {
        query = query.eq("verification_status", "pending")
      }

      return query
    },
  })
}

export async function getAdminUserDetail(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("*, seller_verifications(id, status, tier, reviewed_at)")
    .eq("id", id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data: data as unknown as AdminUserListItem, error: null }
}

export async function listAdminVerifications(
  options: AdminVerificationListOptions = {},
): Promise<AdminListResult<AdminVerificationListItem>> {
  return runListQuery<AdminVerificationListItem>({
    table: "profiles",
    select: "*, seller_verifications(id, status, tier, reviewed_at)",
    searchColumns: ["full_name", "contact_email"],
    options,
    allowedSorts: VERIFICATION_SORTS,
    fallbackSort: "created_at",
    additionalFilters: (query, parsed) => {
      const status = sanitizeText(parsed.status as string | null | undefined)
      if (status) {
        query = query.eq("verification_status", status)
      }
      return query
    },
  })
}

export async function listAdminModerationQueue(
  options: AdminModerationQueueOptions = {},
): Promise<AdminListResult<AdminModerationQueueItem>> {
  return runListQuery<AdminModerationQueueItem>({
    table: "moderation_queue",
    select: "*, flagged_by_profile:profiles!flagged_by(full_name, contact_email)",
    searchColumns: ["reason", "item_id"],
    options,
    allowedSorts: MODERATION_SORTS,
    fallbackSort: "created_at",
    additionalFilters: (query, parsed) => {
      if (parsed.status) {
        query = query.eq("status", parsed.status)
      }
      if (parsed.itemType) {
        query = query.eq("item_type", parsed.itemType)
      }
      return query
    },
  })
}

export async function listAdminPosts(
  options: AdminPostListOptions = {},
): Promise<AdminListResult<AdminPostListItem>> {
  return runListQuery<AdminPostListItem>({
    table: "community_posts",
    select: "*, author:profiles!community_posts_author_id_fkey(full_name, avatar_url), community_comments(id)",
    searchColumns: ["title", "content"],
    options,
    allowedSorts: POST_SORTS,
    fallbackSort: "created_at",
    additionalFilters: (query, parsed) => {
      const isApproved = parseApprovalStatus(parsed.isApproved as string | null | undefined)
      if (isApproved !== undefined) {
        query = query.eq("is_approved", isApproved)
      }
      if (parsed.type) {
        query = query.eq("type", parsed.type)
      }
      return query
    },
  })
}

export async function listAdminComments(
  options: AdminCommentListOptions = {},
): Promise<AdminListResult<AdminCommentListItem>> {
  return runListQuery<AdminCommentListItem>({
    table: "community_comments",
    select: "*, author:profiles!community_comments_author_id_fkey(full_name), post:community_posts!community_comments_post_id_fkey(title)",
    searchColumns: ["content"],
    options,
    allowedSorts: COMMENT_SORTS,
    fallbackSort: "created_at",
    additionalFilters: (query, parsed) => {
      const isApproved = parseApprovalStatus(parsed.isApproved as string | null | undefined)
      if (isApproved !== undefined) {
        query = query.eq("is_approved", isApproved)
      }
      return query
    },
  })
}
