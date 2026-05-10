import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  inviteAdmin,
  removeAdmin,
  updateAdminPermission,
} from "./platform"
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
      full_name: "Admin One",
      admin_permissions: {},
    },
  }
}

function createSupabaseUpdateMock(beforeRow: Record<string, unknown>) {
  const update = vi.fn().mockImplementation(() => ({
    eq: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: { ...beforeRow },
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

describe("inviteAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("requires manage_admins permission", async () => {
    const result = await inviteAdmin("admin@example.com", "ADMIN")

    expect(result).toEqual({
      success: false,
      error: expect.any(String),
    })
    expect(requireAdminPermission).toHaveBeenCalledWith("manage_admins")
  })

  it("requires a valid email", async () => {
    const { supabase } = createSupabaseUpdateMock({ id: "admin-1" })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const result = await inviteAdmin("", "ADMIN")

    expect(result.success).toBe(false)
    expect(result.error).toBe("Email is required")
  })

  it("requires a valid role", async () => {
    const { supabase } = createSupabaseUpdateMock({ id: "admin-1" })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const result = await inviteAdmin("admin@example.com", "INVALID_ROLE")

    expect(result.success).toBe(false)
    expect(result.error).toBe("Invalid role")
  })

  it("sets role and writes audit entry", async () => {
    const { supabase, spies } = createSupabaseUpdateMock({
      id: "new-admin",
      role: "ADMIN",
      admin_permissions: {},
    })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const result = await inviteAdmin("newadmin@example.com", "ADMIN")

    expect(result.success).toBe(true)
    expect(requireAdminPermission).toHaveBeenCalledWith("manage_admins")
    expect(spies.from).toHaveBeenCalledWith("profiles")
    expect(writeAdminAuditLog).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        action: "invite_admin",
        targetType: "profiles",
        targetId: expect.any(String),
      }),
    )
  })

  it("sets SUPER_ADMIN role", async () => {
    const { supabase, spies } = createSupabaseUpdateMock({
      id: "super-admin",
      role: "SUPER_ADMIN",
    })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const result = await inviteAdmin("super@example.com", "SUPER_ADMIN")

    expect(result.success).toBe(true)
    expect(spies.update).toHaveBeenCalledWith(
      expect.objectContaining({
        role: "SUPER_ADMIN",
      }),
    )
  })
})

describe("removeAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(requireAdminPermission).mockReset()
  })

  it("requires manage_admins permission", async () => {
    const result = await removeAdmin("user-1")

    expect(result).toEqual({
      success: false,
      error: expect.any(String),
    })
    expect(requireAdminPermission).toHaveBeenCalledWith("manage_admins")
  })

  it("clears role and writes audit entry", async () => {
    const { supabase, spies } = createSupabaseUpdateMock({
      id: "user-1",
      role: "ADMIN",
      admin_permissions: { manage_admins: true },
    })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const result = await removeAdmin("user-1")

    expect(result.success).toBe(true)
    expect(requireAdminPermission).toHaveBeenCalledWith("manage_admins")
    expect(spies.from).toHaveBeenCalledWith("profiles")
    expect(spies.update).toHaveBeenCalledWith(
      expect.objectContaining({
        role: null,
        admin_permissions: null,
      }),
    )
    expect(writeAdminAuditLog).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        action: "remove_admin",
        targetType: "profiles",
        targetId: "user-1",
      }),
    )
  })

  it("returns error when user not found", async () => {
    const select = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: { message: "User not found" } }),
      }),
    })
    const from = vi.fn().mockReturnValue({ select })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext({ from }))

    const result = await removeAdmin("nonexistent")

    expect(result.success).toBe(false)
    expect(result.error).toBe("User not found")
  })
})

describe("updateAdminPermission", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("requires manage_admins permission", async () => {
    const result = await updateAdminPermission("user-1", "manage_users", true)

    expect(result).toEqual({
      success: false,
      error: expect.any(String),
    })
    expect(requireAdminPermission).toHaveBeenCalledWith("manage_admins")
  })

  it("requires a valid permission key", async () => {
    const { supabase } = createSupabaseUpdateMock({ id: "admin-1" })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const result = await updateAdminPermission("user-1", "invalid_permission" as any, true)

    expect(result.success).toBe(false)
    expect(result.error).toBe("Invalid permission key")
  })

  it("updates permission and writes audit entry", async () => {
    const { supabase, spies } = createSupabaseUpdateMock({
      id: "user-1",
      role: "MARKETPLACE_STAFF",
      admin_permissions: {},
    })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const result = await updateAdminPermission("user-1", "manage_users", true)

    expect(result.success).toBe(true)
    expect(requireAdminPermission).toHaveBeenCalledWith("manage_admins")
    expect(spies.update).toHaveBeenCalledWith(
      expect.objectContaining({
        admin_permissions: { manage_users: true },
      }),
    )
    expect(writeAdminAuditLog).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        action: "update_admin_permission",
        targetType: "profiles",
        targetId: "user-1",
        metadata: expect.objectContaining({
          permission: "manage_users",
          granted: true,
        }),
      }),
    )
  })

  it("can revoke a permission", async () => {
    const { supabase, spies } = createSupabaseUpdateMock({
      id: "user-1",
      role: "MARKETPLACE_STAFF",
      admin_permissions: { manage_users: true },
    })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const result = await updateAdminPermission("user-1", "manage_users", false)

    expect(result.success).toBe(true)
    expect(spies.update).toHaveBeenCalledWith(
      expect.objectContaining({
        admin_permissions: { manage_users: false },
      }),
    )
    expect(writeAdminAuditLog).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        metadata: expect.objectContaining({
          permission: "manage_users",
          granted: false,
        }),
      }),
    )
  })

  it("returns error when user not found", async () => {
    const select = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: { message: "User not found" } }),
      }),
    })
    const from = vi.fn().mockReturnValue({ select })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext({ from }))

    const result = await updateAdminPermission("nonexistent", "manage_users", true)

    expect(result.success).toBe(false)
    expect(result.error).toBe("User not found")
  })
})
