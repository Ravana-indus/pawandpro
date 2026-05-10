import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  listAdminAdoptionCenters,
  listAdminBookings,
  listAdminHospitals,
  listAdminProviders,
} from "./services"

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

describe("listAdminBookings", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("applies pagination, search, status filter, and sort", async () => {
    const { supabase, spies } = createListSupabaseMock([{ id: "b1" }], 26)
    createClientMock.mockResolvedValue(supabase)

    const result = await listAdminBookings({
      page: "2",
      perPage: "10",
      search: "groom",
      status: "Confirmed",
      sort: "fee",
      direction: "asc",
    })

    expect(spies.from).toHaveBeenCalledWith("service_bookings")
    expect(spies.select).toHaveBeenCalledWith(
      "*, provider:profiles!service_bookings_provider_id_fkey(full_name, contact_email), customer:profiles!service_bookings_customer_id_fkey(full_name, contact_email), pet:pets(name)",
      { count: "exact" },
    )
    expect(spies.or).toHaveBeenCalledWith(
      expect.stringContaining("service_type.ilike.%groom%"),
    )
    expect(spies.eq).toHaveBeenCalledWith("status", "Confirmed")
    expect(spies.order).toHaveBeenCalledWith("fee", { ascending: true })
    expect(spies.range).toHaveBeenCalledWith(10, 19)
    expect(result.totalPages).toBe(3)
  })
})

describe("listAdminProviders", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("applies pagination, search, type/status filter, and sort", async () => {
    const { supabase, spies } = createListSupabaseMock([{ id: "p1" }], 17)
    createClientMock.mockResolvedValue(supabase)

    const result = await listAdminProviders({
      page: "3",
      perPage: "5",
      search: "trainer",
      status: "verified",
      serviceType: "Pet Trainer",
      sort: "service_fee",
      direction: "desc",
    })

    expect(spies.from).toHaveBeenCalledWith("service_provider_details")
    expect(spies.select).toHaveBeenCalledWith(
      "*, profile:profiles!service_provider_details_profile_id_fkey(id, full_name, contact_email, created_at, role)",
      { count: "exact" },
    )
    expect(spies.or).toHaveBeenCalledWith(
      expect.stringContaining("service_type.ilike.%trainer%"),
    )
    expect(spies.eq).toHaveBeenCalledWith("is_verified", true)
    expect(spies.eq).toHaveBeenCalledWith("service_type", "Pet Trainer")
    expect(spies.order).toHaveBeenCalledWith("service_fee", { ascending: false })
    expect(spies.range).toHaveBeenCalledWith(10, 14)
    expect(result.totalPages).toBe(4)
  })
})

describe("listAdminHospitals", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("applies pagination, search, status filter, and sort", async () => {
    const { supabase, spies } = createListSupabaseMock([{ id: "h1" }], 12)
    createClientMock.mockResolvedValue(supabase)

    const result = await listAdminHospitals({
      page: "2",
      perPage: "4",
      search: "care",
      status: "unverified",
      sort: "name",
      direction: "asc",
    })

    expect(spies.from).toHaveBeenCalledWith("hospitals")
    expect(spies.select).toHaveBeenCalledWith(
      "*, admin:profiles!hospitals_admin_id_fkey(full_name, contact_email)",
      { count: "exact" },
    )
    expect(spies.or).toHaveBeenCalledWith(
      expect.stringContaining("name.ilike.%care%"),
    )
    expect(spies.eq).toHaveBeenCalledWith("is_verified", false)
    expect(spies.order).toHaveBeenCalledWith("name", { ascending: true })
    expect(spies.range).toHaveBeenCalledWith(4, 7)
    expect(result.totalPages).toBe(3)
  })
})

describe("listAdminAdoptionCenters", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("applies pagination, search, status filter, and sort", async () => {
    const { supabase, spies } = createListSupabaseMock([{ id: "a1" }], 11)
    createClientMock.mockResolvedValue(supabase)

    const result = await listAdminAdoptionCenters({
      page: "2",
      perPage: "5",
      search: "city",
      status: "verified",
      sort: "type",
      direction: "asc",
    })

    expect(spies.from).toHaveBeenCalledWith("adoption_centers")
    expect(spies.select).toHaveBeenCalledWith(
      "*, owner:profiles!adoption_centers_owner_id_fkey(full_name, contact_email)",
      { count: "exact" },
    )
    expect(spies.or).toHaveBeenCalledWith(
      expect.stringContaining("name.ilike.%city%"),
    )
    expect(spies.eq).toHaveBeenCalledWith("is_verified", true)
    expect(spies.order).toHaveBeenCalledWith("type", { ascending: true })
    expect(spies.range).toHaveBeenCalledWith(5, 9)
    expect(result.totalPages).toBe(3)
  })
})
