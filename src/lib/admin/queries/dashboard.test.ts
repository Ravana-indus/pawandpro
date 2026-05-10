import { beforeEach, describe, expect, it, vi } from "vitest"

import { getAdminDashboardMetrics } from "./dashboard"

const { createClientMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
}))

vi.mock("@/lib/supabase/server", () => ({
  createClient: createClientMock,
}))

type TableType = "profiles" | "orders" | "moderation_queue" | "service_bookings"

function createMockSupabase(results: Partial<Record<TableType, { count: number | null; error: { message: string } | null }>>) {
  return {
    from: vi.fn((table: TableType) => {
      const result = results[table] || { count: 0, error: null }

      const queryMethods = {
        select: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      }

      queryMethods.select.mockImplementation(() => {
        return {
          ...queryMethods,
          then: (resolve: (value: { count: number | null; error: { message: string } | null }) => void) => {
            resolve(result)
          },
        }
      })

      queryMethods.gte.mockImplementation(() => {
        return {
          ...queryMethods,
          then: (resolve: (value: { count: number | null; error: { message: string } | null }) => void) => {
            resolve(result)
          },
        }
      })

      queryMethods.eq.mockImplementation(() => {
        return {
          ...queryMethods,
          then: (resolve: (value: { count: number | null; error: { message: string } | null }) => void) => {
            resolve(result)
          },
        }
      })

      return { select: queryMethods.select }
    }),
  }
}

describe("getAdminDashboardMetrics", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns all metrics from database", async () => {
    createClientMock.mockResolvedValue(
      createMockSupabase({
        profiles: { count: 150, error: null },
        orders: { count: 320, error: null },
        moderation_queue: { count: 15, error: null },
        service_bookings: { count: 25, error: null },
      })
    )

    const result = await getAdminDashboardMetrics()

    expect(result.totalUsers).toBe(150)
    expect(result.totalOrders).toBe(320)
    expect(result.openModeration).toBe(15)
    expect(result.openBookings).toBe(25)
  })

  it("filters pending verifications correctly", async () => {
    createClientMock.mockResolvedValue(
      createMockSupabase({
        profiles: { count: 8, error: null },
        orders: { count: 0, error: null },
        moderation_queue: { count: 0, error: null },
        service_bookings: { count: 0, error: null },
      })
    )

    const result = await getAdminDashboardMetrics()

    expect(result.pendingVerifications).toBe(8)
  })

  it("filters open bookings by confirmed status", async () => {
    createClientMock.mockResolvedValue(
      createMockSupabase({
        profiles: { count: 0, error: null },
        orders: { count: 0, error: null },
        moderation_queue: { count: 0, error: null },
        service_bookings: { count: 25, error: null },
      })
    )

    const result = await getAdminDashboardMetrics()

    expect(result.openBookings).toBe(25)
  })

  it("falls back to 0 when count returns error", async () => {
    createClientMock.mockResolvedValue(
      createMockSupabase({
        profiles: { count: null, error: { message: "DB error" } },
        orders: { count: null, error: { message: "DB error" } },
        moderation_queue: { count: null, error: { message: "DB error" } },
        service_bookings: { count: null, error: { message: "DB error" } },
      })
    )

    const result = await getAdminDashboardMetrics()

    expect(result.totalUsers).toBe(0)
    expect(result.totalOrders).toBe(0)
    expect(result.openModeration).toBe(0)
    expect(result.openBookings).toBe(0)
  })

  it("falls back to 0 when count is null", async () => {
    createClientMock.mockResolvedValue(
      createMockSupabase({
        profiles: { count: null, error: null },
        orders: { count: null, error: null },
        moderation_queue: { count: null, error: null },
        service_bookings: { count: null, error: null },
      })
    )

    const result = await getAdminDashboardMetrics()

    expect(result.totalUsers).toBe(0)
  })

  it("returns all zeros when all queries fail", async () => {
    createClientMock.mockResolvedValue(
      createMockSupabase({
        profiles: { count: null, error: { message: "error" } },
        orders: { count: null, error: { message: "error" } },
        moderation_queue: { count: null, error: { message: "error" } },
        service_bookings: { count: null, error: { message: "error" } },
      })
    )

    const result = await getAdminDashboardMetrics()

    expect(result.totalUsers).toBe(0)
    expect(result.usersToday).toBe(0)
    expect(result.totalOrders).toBe(0)
    expect(result.ordersToday).toBe(0)
    expect(result.pendingVerifications).toBe(0)
    expect(result.openModeration).toBe(0)
    expect(result.openBookings).toBe(0)
  })
})