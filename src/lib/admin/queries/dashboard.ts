import { createClient } from "@/lib/supabase/server"

export interface AdminDashboardMetrics {
  totalUsers: number
  usersToday: number
  totalOrders: number
  ordersToday: number
  pendingVerifications: number
  openModeration: number
  openBookings: number
}

function getStartOfDay(): string {
  const now = new Date()
  return new Date(now.setHours(0, 0, 0, 0)).toISOString()
}

async function safeCount(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: "profiles" | "orders" | "moderation_queue" | "service_bookings",
  filters?: {
    gte?: { column: string; value: string }
    eq?: { column: string; value: string | boolean }
  },
): Promise<number> {
  try {
    let query = supabase.from(table).select("*", { count: "exact", head: true })

    if (filters?.gte) {
      query = query.gte(filters.gte.column, filters.gte.value)
    }

    if (filters?.eq) {
      query = query.eq(filters.eq.column, filters.eq.value)
    }

    const { count, error } = await query

    if (error || count === null) {
      return 0
    }

    return count
  } catch {
    return 0
  }
}

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  const supabase = await createClient()

  const startOfDay = getStartOfDay()

  const [
    totalUsers,
    usersToday,
    totalOrders,
    ordersToday,
    pendingVerifications,
    openModeration,
    openBookings,
  ] = await Promise.all([
    safeCount(supabase, "profiles"),
    safeCount(supabase, "profiles", { gte: { column: "created_at", value: startOfDay } }),
    safeCount(supabase, "orders"),
    safeCount(supabase, "orders", { gte: { column: "created_at", value: startOfDay } }),
    safeCount(supabase, "profiles", { eq: { column: "verification_status", value: "pending" } }),
    safeCount(supabase, "moderation_queue", { eq: { column: "status", value: "pending" } }),
    safeCount(supabase, "service_bookings", { eq: { column: "status", value: "confirmed" } }),
  ])

  return {
    totalUsers,
    usersToday,
    totalOrders,
    ordersToday,
    pendingVerifications,
    openModeration,
    openBookings,
  }
}