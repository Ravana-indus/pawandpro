import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  listAdminUsers,
  getAdminUserDetail,
  listAdminVerifications,
  listAdminModerationQueue,
  listAdminPosts,
  listAdminComments,
} from "./trust-safety"

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

describe("listAdminUsers", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("applies pagination, search, role/status filter, and sort", async () => {
    const { supabase, spies } = createListSupabaseMock([{ id: "u1" }], 26)
    createClientMock.mockResolvedValue(supabase)

    const result = await listAdminUsers({
      page: "2",
      perPage: "10",
      search: "john",
      role: "BREEDER",
      status: "active",
      sort: "created_at",
      direction: "asc",
    })

    expect(spies.from).toHaveBeenCalledWith("profiles")
    expect(spies.select).toHaveBeenCalledWith(
      "*, seller_verifications(id, status, tier, reviewed_at)",
      { count: "exact" },
    )
    expect(spies.or).toHaveBeenCalledWith(
      expect.stringContaining("full_name.ilike.%john%"),
    )
    expect(spies.eq).toHaveBeenCalledWith("role", "BREEDER")
    expect(spies.order).toHaveBeenCalledWith("created_at", { ascending: true })
    expect(spies.range).toHaveBeenCalledWith(10, 19)
    expect(result.totalPages).toBe(3)
  })

  it("filters banned users by status", async () => {
    const { supabase, spies } = createListSupabaseMock([], 0)
    createClientMock.mockResolvedValue(supabase)

    await listAdminUsers({ status: "banned" })

    expect(spies.or).toHaveBeenCalledWith(
      expect.stringContaining("banned_until"),
    )
  })

  it("filters pending verification users", async () => {
    const { supabase, spies } = createListSupabaseMock([], 0)
    createClientMock.mockResolvedValue(supabase)

    await listAdminUsers({ status: "pending" })

    expect(spies.eq).toHaveBeenCalledWith("verification_status", "pending")
  })

  it("falls back safely for unknown sort fields", async () => {
    const { supabase, spies } = createListSupabaseMock([], 0)
    createClientMock.mockResolvedValue(supabase)

    await listAdminUsers({ sort: "drop_table" })

    expect(spies.order).toHaveBeenCalledWith("created_at", { ascending: false })
  })
})

describe("getAdminUserDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("fetches user with seller_verifications join", async () => {
    const select = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: { id: "u1" }, error: null }),
      }),
    })
    const from = vi.fn().mockReturnValue({ select })
    createClientMock.mockResolvedValue({ from })

    const result = await getAdminUserDetail("u1")

    expect(from).toHaveBeenCalledWith("profiles")
    expect(select).toHaveBeenCalledWith(
      "*, seller_verifications(id, status, tier, reviewed_at)",
    )
    expect(result.data).not.toBeNull()
  })

  it("returns error when user not found", async () => {
    const select = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: { message: "User not found" } }),
      }),
    })
    const from = vi.fn().mockReturnValue({ select })
    createClientMock.mockResolvedValue({ from })

    const result = await getAdminUserDetail("nonexistent")

    expect(result.error).toBeTruthy()
  })
})

describe("listAdminVerifications", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("applies pagination, search, and status filter", async () => {
    const { supabase, spies } = createListSupabaseMock([{ id: "v1" }], 15)
    createClientMock.mockResolvedValue(supabase)

    const result = await listAdminVerifications({
      page: "1",
      perPage: "10",
      search: "email",
      status: "pending",
    })

    expect(spies.from).toHaveBeenCalledWith("profiles")
    expect(spies.select).toHaveBeenCalledWith(
      "*, seller_verifications(id, status, tier, reviewed_at)",
      { count: "exact" },
    )
    expect(spies.or).toHaveBeenCalledWith(
      expect.stringContaining("full_name.ilike.%email%"),
    )
    expect(spies.eq).toHaveBeenCalledWith("verification_status", "pending")
    expect(result.totalPages).toBe(2)
  })

  it("supports approved status filter", async () => {
    const { supabase, spies } = createListSupabaseMock([], 0)
    createClientMock.mockResolvedValue(supabase)

    await listAdminVerifications({ status: "approved" })

    expect(spies.eq).toHaveBeenCalledWith("verification_status", "approved")
  })
})

describe("listAdminModerationQueue", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("applies pagination, status filter, and sort", async () => {
    const { supabase, spies } = createListSupabaseMock([{ id: "m1" }], 21)
    createClientMock.mockResolvedValue(supabase)

    const result = await listAdminModerationQueue({
      page: "2",
      perPage: "10",
      status: "pending",
      sort: "created_at",
      direction: "desc",
    })

    expect(spies.from).toHaveBeenCalledWith("moderation_queue")
    expect(spies.select).toHaveBeenCalledWith(
      "*, flagged_by_profile:profiles!flagged_by(full_name, contact_email)",
      { count: "exact" },
    )
    expect(spies.eq).toHaveBeenCalledWith("status", "pending")
    expect(spies.order).toHaveBeenCalledWith("created_at", { ascending: false })
    expect(spies.range).toHaveBeenCalledWith(10, 19)
    expect(result.totalPages).toBe(3)
  })

  it("supports item type filter", async () => {
    const { supabase, spies } = createListSupabaseMock([], 0)
    createClientMock.mockResolvedValue(supabase)

    await listAdminModerationQueue({ itemType: "post" })

    expect(spies.eq).toHaveBeenCalledWith("item_type", "post")
  })
})

describe("listAdminPosts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("applies pagination, search, approval state, type filter, and sort", async () => {
    const { supabase, spies } = createListSupabaseMock([{ id: "p1" }], 18)
    createClientMock.mockResolvedValue(supabase)

    const result = await listAdminPosts({
      page: "1",
      perPage: "10",
      search: "hello",
      isApproved: "false",
      type: "General",
      sort: "created_at",
      direction: "asc",
    })

    expect(spies.from).toHaveBeenCalledWith("community_posts")
    expect(spies.select).toHaveBeenCalledWith(
      "*, author:profiles!community_posts_author_id_fkey(full_name, avatar_url), community_comments(id)",
      { count: "exact" },
    )
    expect(spies.or).toHaveBeenCalledWith(
      expect.stringContaining("title.ilike.%hello%"),
    )
    expect(spies.eq).toHaveBeenCalledWith("is_approved", false)
    expect(spies.eq).toHaveBeenCalledWith("type", "General")
    expect(spies.order).toHaveBeenCalledWith("created_at", { ascending: true })
    expect(spies.range).toHaveBeenCalledWith(0, 9)
    expect(result.totalPages).toBe(2)
  })

  it("falls back safely for unknown sort fields", async () => {
    const { supabase, spies } = createListSupabaseMock([], 0)
    createClientMock.mockResolvedValue(supabase)

    await listAdminPosts({ sort: "injection" })

    expect(spies.order).toHaveBeenCalledWith("created_at", { ascending: false })
  })
})

describe("listAdminComments", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("applies pagination, search, approval state, and sort", async () => {
    const { supabase, spies } = createListSupabaseMock([{ id: "c1" }], 12)
    createClientMock.mockResolvedValue(supabase)

    const result = await listAdminComments({
      page: "2",
      perPage: "5",
      search: "great",
      isApproved: "true",
      sort: "created_at",
      direction: "desc",
    })

    expect(spies.from).toHaveBeenCalledWith("community_comments")
    expect(spies.select).toHaveBeenCalledWith(
      "*, author:profiles!community_comments_author_id_fkey(full_name), post:community_posts!community_comments_post_id_fkey(title)",
      { count: "exact" },
    )
    expect(spies.or).toHaveBeenCalledWith(
      expect.stringContaining("content.ilike.%great%"),
    )
    expect(spies.eq).toHaveBeenCalledWith("is_approved", true)
    expect(spies.order).toHaveBeenCalledWith("created_at", { ascending: false })
    expect(spies.range).toHaveBeenCalledWith(5, 9)
    expect(result.totalPages).toBe(3)
  })

  it("falls back safely for unknown sort fields", async () => {
    const { supabase, spies } = createListSupabaseMock([], 0)
    createClientMock.mockResolvedValue(supabase)

    await listAdminComments({ sort: "truncate" })

    expect(spies.order).toHaveBeenCalledWith("created_at", { ascending: false })
  })
})
