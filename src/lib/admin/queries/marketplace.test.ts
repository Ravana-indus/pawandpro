import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  listAdminListings,
  listAdminOrders,
  listAdminProducts,
} from "./marketplace"

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
    order: vi.fn(),
    range: vi.fn(),
  }

  query.eq.mockReturnValue(query)
  query.or.mockReturnValue(query)
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
      order: query.order,
      range: query.range,
    },
  }
}

describe("listAdminListings", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("parses page/perPage/search/status/sort/direction and includes totalPages", async () => {
    const { supabase, spies } = createListSupabaseMock([{ id: "l1" }], 35)
    createClientMock.mockResolvedValue(supabase)

    const result = await listAdminListings({
      page: "2",
      perPage: "10",
      search: "husky",
      status: "Available",
      sort: "price",
      direction: "asc",
    })

    expect(spies.from).toHaveBeenCalledWith("pet_listings")
    expect(spies.select).toHaveBeenCalledWith(
      "*, seller:profiles!pet_listings_seller_id_fkey(full_name, contact_email)",
      { count: "exact" },
    )
    expect(spies.or).toHaveBeenCalledWith(
      expect.stringContaining("name.ilike.%husky%"),
    )
    expect(spies.eq).toHaveBeenCalledWith("status", "Available")
    expect(spies.order).toHaveBeenCalledWith("price", { ascending: true })
    expect(spies.range).toHaveBeenCalledWith(10, 19)
    expect(result.totalPages).toBe(4)
  })

  it("falls back safely for unknown sort fields", async () => {
    const { supabase, spies } = createListSupabaseMock([], 0)
    createClientMock.mockResolvedValue(supabase)

    await listAdminListings({ sort: "unsafe_sort", direction: "sideways" })

    expect(spies.order).toHaveBeenCalledWith("created_at", { ascending: false })
  })
})

describe("listAdminProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("parses page/perPage/search/status/sort/direction and includes totalPages", async () => {
    const { supabase, spies } = createListSupabaseMock([{ id: "p1" }], 21)
    createClientMock.mockResolvedValue(supabase)

    const result = await listAdminProducts({
      page: "3",
      perPage: "5",
      search: "food",
      status: "Active",
      sort: "stock_quantity",
      direction: "desc",
    })

    expect(spies.from).toHaveBeenCalledWith("products")
    expect(spies.select).toHaveBeenCalledWith(
      "*, seller:profiles!products_seller_id_fkey(full_name, contact_email)",
      { count: "exact" },
    )
    expect(spies.or).toHaveBeenCalledWith(
      expect.stringContaining("name.ilike.%food%"),
    )
    expect(spies.eq).toHaveBeenCalledWith("status", "Active")
    expect(spies.order).toHaveBeenCalledWith("stock_quantity", {
      ascending: false,
    })
    expect(spies.range).toHaveBeenCalledWith(10, 14)
    expect(result.totalPages).toBe(5)
  })

  it("falls back safely for unknown sort fields", async () => {
    const { supabase, spies } = createListSupabaseMock([], 0)
    createClientMock.mockResolvedValue(supabase)

    await listAdminProducts({ sort: "unknown_sort" })

    expect(spies.order).toHaveBeenCalledWith("created_at", { ascending: false })
  })
})

describe("listAdminOrders", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("parses page/perPage/search/status/sort/direction and includes totalPages", async () => {
    const { supabase, spies } = createListSupabaseMock([{ id: "o1" }], 13)
    createClientMock.mockResolvedValue(supabase)

    const result = await listAdminOrders({
      page: "2",
      perPage: "4",
      search: "processing",
      status: "Processing",
      sort: "total_amount",
      direction: "asc",
    })

    expect(spies.from).toHaveBeenCalledWith("orders")
    expect(spies.select).toHaveBeenCalledWith(
      "*, buyer:profiles!orders_buyer_id_fkey(full_name, contact_email)",
      { count: "exact" },
    )
    expect(spies.or).toHaveBeenCalledWith(
      expect.stringContaining("status.ilike.%processing%"),
    )
    expect(spies.eq).toHaveBeenCalledWith("status", "Processing")
    expect(spies.order).toHaveBeenCalledWith("total_amount", { ascending: true })
    expect(spies.range).toHaveBeenCalledWith(4, 7)
    expect(result.totalPages).toBe(4)
  })

  it("falls back safely for unknown sort fields", async () => {
    const { supabase, spies } = createListSupabaseMock([], 0)
    createClientMock.mockResolvedValue(supabase)

    await listAdminOrders({ sort: "drop_table" })

    expect(spies.order).toHaveBeenCalledWith("created_at", { ascending: false })
  })
})
