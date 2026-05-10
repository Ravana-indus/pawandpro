export type AdminPermission =
  | "manage_users"
  | "manage_marketplace"
  | "manage_orders"
  | "verify_sellers"
  | "manage_services"
  | "manage_vets"
  | "manage_adoption"
  | "moderate_content"
  | "view_analytics"
  | "manage_payments"
  | "audit_logs"
  | "manage_admins"
  | "manage_platform_settings"

export type AdminActionResult<T = unknown> =
  | { success: true; data?: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

export interface AdminListResult<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface AdminPaginationInput {
  page?: string | number
  perPage?: string | number
}

export type AdminSortDirection = "asc" | "desc"

export interface AdminSortInput {
  sort?: string | null
}
