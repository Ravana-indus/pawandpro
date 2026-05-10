import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  banAdminUser,
  unbanAdminUser,
  reviewAdminVerification,
  resolveAdminModerationItem,
  removeAdminPost,
  removeAdminComment,
} from "./trust-safety"
import { writeAdminAuditLog } from "../audit"
import { requireAdminPermission } from "../permissions"

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

vi.mock("../audit", () => ({
  writeAdminAuditLog: vi.fn(),
}))

vi.mock("../permissions", () => ({
  requireAdminPermission: vi.fn(),
}))

type AdminContext = Awaited<ReturnType<typeof requireAdminPermission>>

function createAdminContext(supabase: unknown): AdminContext {
  return {
    supabase: supabase as AdminContext["supabase"],
    userId: "admin-1",
    profile: {
      id: "admin-1",
      role: "ADMIN",
      full_name: null,
      admin_permissions: {},
    },
  }
}

function createSupabaseUpdateMock(beforeRow: Record<string, unknown>) {
  const update = vi.fn().mockImplementation(() => ({
    eq: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            ...beforeRow,
          },
          error: null,
        }),
      }),
    }),
  }))

  const select = vi.fn().mockReturnValue({
    eq: vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({
        data: beforeRow,
        error: null,
      }),
    }),
  })

  const from = vi.fn().mockReturnValue({
    select,
    update,
  })

  return {
    supabase: { from },
    spies: { from, select, update },
  }
}

describe("banAdminUser", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("requires a reason", async () => {
    const result = await banAdminUser("user-1", "", undefined)

    expect(result).toEqual({
      success: false,
      error: expect.any(String),
    })
    expect(requireAdminPermission).not.toHaveBeenCalled()
  })

  it("bans user and writes audit entry", async () => {
    const { supabase, spies } = createSupabaseUpdateMock({
      id: "user-1",
      banned_until: null,
    })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const result = await banAdminUser("user-1", "Repeated violations", 30)

    expect(result.success).toBe(true)
    expect(requireAdminPermission).toHaveBeenCalledWith("manage_users")
    expect(spies.from).toHaveBeenCalledWith("profiles")
    expect(spies.update).toHaveBeenCalledWith(
      expect.objectContaining({
        banned_until: expect.any(String),
      }),
    )
    expect(writeAdminAuditLog).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        action: "ban_user",
        targetType: "profiles",
        targetId: "user-1",
        reason: "Repeated violations",
      }),
    )
  })

  it("permits permanent ban when durationDays is undefined", async () => {
    const { supabase, spies } = createSupabaseUpdateMock({
      id: "user-1",
      banned_until: null,
    })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const result = await banAdminUser("user-1", "Severe violation", undefined)

    expect(result.success).toBe(true)
    expect(spies.update).toHaveBeenCalledWith(
      expect.objectContaining({
        banned_until: null,
      }),
    )
  })
})

describe("unbanAdminUser", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("requires a reason", async () => {
    const result = await unbanAdminUser("user-1", "")

    expect(result).toEqual({
      success: false,
      error: expect.any(String),
    })
    expect(requireAdminPermission).not.toHaveBeenCalled()
  })

  it("unbans user and writes audit entry", async () => {
    const { supabase, spies } = createSupabaseUpdateMock({
      id: "user-1",
      banned_until: new Date(Date.now() + 86400000).toISOString(),
    })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const result = await unbanAdminUser("user-1", "Appeal approved")

    expect(result.success).toBe(true)
    expect(requireAdminPermission).toHaveBeenCalledWith("manage_users")
    expect(spies.from).toHaveBeenCalledWith("profiles")
    expect(spies.update).toHaveBeenCalledWith(
      expect.objectContaining({
        banned_until: null,
      }),
    )
    expect(writeAdminAuditLog).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        action: "unban_user",
        targetType: "profiles",
        targetId: "user-1",
        reason: "Appeal approved",
      }),
    )
  })
})

describe("reviewAdminVerification", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("requires a reason", async () => {
    const result = await reviewAdminVerification("seller-1", "approved", undefined, "")

    expect(result).toEqual({
      success: false,
      error: expect.any(String),
    })
    expect(requireAdminPermission).not.toHaveBeenCalled()
  })

  it("approves verification with tier and writes audit entry", async () => {
    const { supabase, spies } = createSupabaseUpdateMock({
      id: "seller-1",
      is_verified: false,
    })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const result = await reviewAdminVerification(
      "seller-1",
      "approved",
      "Gold",
      "Excellent documentation",
    )

    expect(result.success).toBe(true)
    expect(requireAdminPermission).toHaveBeenCalledWith("verify_sellers")
    expect(spies.from).toHaveBeenCalledWith("profiles")
    expect(spies.update).toHaveBeenCalledWith(
      expect.objectContaining({
        is_verified: true,
        verification_status: "approved",
      }),
    )
    expect(writeAdminAuditLog).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        action: "review_verification",
        targetType: "profiles",
        targetId: "seller-1",
        reason: "Excellent documentation",
      }),
    )
  })

  it("rejects verification and writes audit entry", async () => {
    const { supabase, spies } = createSupabaseUpdateMock({
      id: "seller-1",
      is_verified: false,
    })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const result = await reviewAdminVerification(
      "seller-1",
      "rejected",
      undefined,
      "Insufficient documentation",
    )

    expect(result.success).toBe(true)
    expect(requireAdminPermission).toHaveBeenCalledWith("verify_sellers")
    expect(spies.update).toHaveBeenCalledWith(
      expect.objectContaining({
        is_verified: false,
        verification_status: "rejected",
      }),
    )
  })
})

describe("resolveAdminModerationItem", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("requires a reason", async () => {
    const result = await resolveAdminModerationItem("item-1", "remove", "")

    expect(result).toEqual({
      success: false,
      error: expect.any(String),
    })
    expect(requireAdminPermission).not.toHaveBeenCalled()
  })

  it("resolves item with action and writes audit entry", async () => {
    const { supabase, spies } = createSupabaseUpdateMock({
      id: "item-1",
      status: "pending",
    })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const result = await resolveAdminModerationItem(
      "item-1",
      "remove",
      "Violates community guidelines",
    )

    expect(result.success).toBe(true)
    expect(requireAdminPermission).toHaveBeenCalledWith("moderate_content")
    expect(spies.from).toHaveBeenCalledWith("moderation_queue")
    expect(spies.update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "removed",
      }),
    )
    expect(writeAdminAuditLog).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        action: "resolve_moderation_item",
        targetType: "moderation_queue",
        targetId: "item-1",
        reason: "Violates community guidelines",
      }),
    )
  })

  it("dismisses item", async () => {
    const { supabase, spies } = createSupabaseUpdateMock({
      id: "item-1",
      status: "pending",
    })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const result = await resolveAdminModerationItem("item-1", "dismiss", "No violation found")

    expect(result.success).toBe(true)
    expect(spies.update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "dismissed",
      }),
    )
  })
})

describe("removeAdminPost", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("requires a reason", async () => {
    const result = await removeAdminPost("post-1", "")

    expect(result).toEqual({
      success: false,
      error: expect.any(String),
    })
    expect(requireAdminPermission).not.toHaveBeenCalled()
  })

  it("removes post and writes audit entry", async () => {
    const removePost = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    })
    const from = vi.fn().mockReturnValue({ delete: removePost })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext({ from }))

    const result = await removeAdminPost("post-1", "Spam content")

    expect(result.success).toBe(true)
    expect(requireAdminPermission).toHaveBeenCalledWith("moderate_content")
    expect(writeAdminAuditLog).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        action: "remove_post",
        targetType: "community_posts",
        targetId: "post-1",
        reason: "Spam content",
      }),
    )
  })
})

describe("removeAdminComment", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("requires a reason", async () => {
    const result = await removeAdminComment("comment-1", "")

    expect(result).toEqual({
      success: false,
      error: expect.any(String),
    })
    expect(requireAdminPermission).not.toHaveBeenCalled()
  })

  it("removes comment and writes audit entry", async () => {
    const removeComment = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    })
    const from = vi.fn().mockReturnValue({ delete: removeComment })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext({ from }))

    const result = await removeAdminComment("comment-1", "Harassment")

    expect(result.success).toBe(true)
    expect(requireAdminPermission).toHaveBeenCalledWith("moderate_content")
    expect(writeAdminAuditLog).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        action: "remove_comment",
        targetType: "community_comments",
        targetId: "comment-1",
        reason: "Harassment",
      }),
    )
  })
})
