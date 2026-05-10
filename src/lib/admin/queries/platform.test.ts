import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  listAdminAuditLogs,
  listAdminStaff,
} from "./platform"

const { createClientMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
}))

vi.mock("@/lib/supabase/server", () => ({
  createClient: createClientMock,
}))

function createListSupabaseMock(data: Record<string, unknown>[], count: number) {
  const query = {
    eq: vi.fn(),
    or: vi.fn(),
    gte: vi.fn(),
    lte: vi.fn(),
    order: vi.fn(),
    range: vi.fn(),
  }

  query.eq.mockReturnValue(query)
  query.or.mockReturnValue(query)
  query.gte.mockReturnValue(query)
  query.lte.mockReturnValue(query)
  query.order.mockReturnValue(query)
  query.range.mockResolvedValue({ data, error: null, count })

  const select = vi.fn().mockReturnValue(query)
  const from = vi.fn().mockReturnValue({ select })

  return {
    supabase: { from },
    spies: {
      from,
      select,
      eq: query.eq,
      or: query.or,
      gte: query.gte,
      lte: query.lte,
      order: query.order,
      range: query.range,
    },
  }
}

describe("listAdminAuditLogs", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("applies pagination and default sort", async () => {
    const { supabase, spies } = createListSupabaseMock([{ id: "a1" }], 51)
    createClientMock.mockResolvedValue(supabase)

    const result = await listAdminAuditLogs({
      page: "2",
      perPage: "10",
    })

    expect(spies.from).toHaveBeenCalledWith("audit_logs")
    expect(spies.select).toHaveBeenCalledWith("*", { count: "exact" })
    expect(spies.order).toHaveBeenCalledWith("created_at", { ascending: false })
    expect(spies.range).toHaveBeenCalledWith(10, 19)
    expect(result.totalPages).toBe(6)
  })

  it("filters by action", async () => {
    const { supabase, spies } = createListSupabaseMock([], 0)
    createClientMock.mockResolvedValue(supabase)

    await listAdminAuditLogs({ action: "ban_user" })

    expect(spies.eq).toHaveBeenCalledWith("action", "ban_user")
  })

  it("filters by target_type", async () => {
    const { supabase, spies } = createListSupabaseMock([], 0)
    createClientMock.mockResolvedValue(supabase)

    await listAdminAuditLogs({ targetType: "profiles" })

    expect(spies.eq).toHaveBeenCalledWith("target_type", "profiles")
  })

  it("filters by actorId", async () => {
    const { supabase, spies } = createListSupabaseMock([], 0)
    createClientMock.mockResolvedValue(supabase)

    await listAdminAuditLogs({ actorId: "admin-1" })

    expect(spies.eq).toHaveBeenCalledWith("actor_id", "admin-1")
  })

  it("filters by date range", async () => {
    const { supabase, spies } = createListSupabaseMock([], 0)
    createClientMock.mockResolvedValue(supabase)

    await listAdminAuditLogs({
      dateFrom: "2024-01-01",
      dateTo: "2024-12-31",
    })

    expect(spies.gte).toHaveBeenCalledWith("created_at", "2024-01-01")
    expect(spies.lte).toHaveBeenCalledWith("created_at", "2024-12-31")
  })

  it("combines all filters with pagination", async () => {
    const { supabase, spies } = createListSupabaseMock([], 0)
    createClientMock.mockResolvedValue(supabase)

    await listAdminAuditLogs({
      page: "1",
      perPage: "25",
      action: "ban_user",
      targetType: "profiles",
      actorId: "admin-1",
      dateFrom: "2024-01-01",
      dateTo: "2024-12-31",
    })

    expect(spies.eq).toHaveBeenCalledTimes(3)
    expect(spies.gte).toHaveBeenCalledWith("created_at", "2024-01-01")
    expect(spies.lte).toHaveBeenCalledWith("created_at", "2024-12-31")
    expect(spies.order).toHaveBeenCalledWith("created_at", { ascending: false })
  })

  it("returns empty result on error", async () => {
    const query = {
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({ data: null, error: { message: "DB error" }, count: null }),
    }
    const select = vi.fn().mockReturnValue(query)
    const from = vi.fn().mockReturnValue({ select })
    createClientMock.mockResolvedValue({ from })

    const result = await listAdminAuditLogs({})

    expect(result.data).toEqual([])
    expect(result.total).toBe(0)
  })
})

describe("listAdminStaff", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("applies pagination, search, and sort", async () => {
    const { supabase, spies } = createListSupabaseMock([{ id: "u1" }], 26)
    createClientMock.mockResolvedValue(supabase)

    const result = await listAdminStaff({
      page: "2",
      perPage: "10",
      search: "john",
      sort: "created_at",
      direction: "asc",
    })

    expect(spies.from).toHaveBeenCalledWith("profiles")
    expect(spies.select).toHaveBeenCalledWith(
      "*, admin_permissions",
      { count: "exact" },
    )
    expect(spies.or).toHaveBeenCalledWith(
      expect.stringContaining("full_name.ilike.%john%"),
    )
    expect(spies.order).toHaveBeenCalledWith("created_at", { ascending: true })
    expect(spies.range).toHaveBeenCalledWith(10, 19)
    expect(result.totalPages).toBe(3)
  })

  it("filters by role", async () => {
    const { supabase, spies } = createListSupabaseMock([], 0)
    createClientMock.mockResolvedValue(supabase)

    await listAdminStaff({ role: "ADMIN" })

    expect(spies.eq).toHaveBeenCalledWith("role", "ADMIN")
  })

  it("filters by SUPER_ADMIN role", async () => {
    const { supabase, spies } = createListSupabaseMock([], 0)
    createClientMock.mockResolvedValue(supabase)

    await listAdminStaff({ role: "SUPER_ADMIN" })

    expect(spies.eq).toHaveBeenCalledWith("role", "SUPER_ADMIN")
  })

  it("filters MARKETPLACE_STAFF by explicit permission manage_admins", async () => {
    const { supabase, spies } = createListSupabaseMock([], 0)
    createClientMock.mockResolvedValue(supabase)

    await listAdminStaff({ role: "MARKETPLACE_STAFF" })

    expect(spies.eq).toHaveBeenCalledWith("role", "MARKETPLACE_STAFF")
  })

  it("falls back safely for unknown sort fields", async () => {
    const { supabase, spies } = createListSupabaseMock([], 0)
    createClientMock.mockResolvedValue(supabase)

    await listAdminStaff({ sort: "drop_table" })

    expect(spies.order).toHaveBeenCalledWith("created_at", { ascending: false })
  })

  it("returns empty result on error", async () => {
    const query = {
      eq: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({ data: null, error: { message: "DB error" }, count: null }),
    }
    const select = vi.fn().mockReturnValue(query)
    const from = vi.fn().mockReturnValue({ select })
    createClientMock.mockResolvedValue({ from })

    const result = await listAdminStaff({})

    expect(result.data).toEqual([])
    expect(result.total).toBe(0)
  })
})
