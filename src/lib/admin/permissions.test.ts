import { describe, expect, it } from "vitest"

import {
  profileCanAccessAdmin,
  profileHasAdminPermission,
} from "./permissions"

describe("profileHasAdminPermission", () => {
  it("grants SUPER_ADMIN all permissions", () => {
    const profile = { role: "SUPER_ADMIN", admin_permissions: null }

    expect(profileHasAdminPermission(profile, "manage_users")).toBe(true)
    expect(profileHasAdminPermission(profile, "manage_admins")).toBe(true)
    expect(profileHasAdminPermission(profile, "manage_platform_settings")).toBe(true)
  })

  it("grants ADMIN broad operational permissions except manage_admins", () => {
    const profile = { role: "ADMIN", admin_permissions: null }

    expect(profileHasAdminPermission(profile, "manage_users")).toBe(true)
    expect(profileHasAdminPermission(profile, "manage_marketplace")).toBe(true)
    expect(profileHasAdminPermission(profile, "manage_admins")).toBe(false)
  })

  it("requires explicit permission flags for MARKETPLACE_STAFF", () => {
    const profile = {
      role: "MARKETPLACE_STAFF",
      admin_permissions: {
        manage_marketplace: true,
        manage_orders: false,
      },
    }

    expect(profileHasAdminPermission(profile, "manage_marketplace")).toBe(true)
    expect(profileHasAdminPermission(profile, "manage_orders")).toBe(false)
    expect(profileHasAdminPermission(profile, "manage_users")).toBe(false)
  })

  it("denies access when profile is missing", () => {
    expect(profileHasAdminPermission(null, "manage_users")).toBe(false)
  })
})

describe("profileCanAccessAdmin", () => {
  it("grants dashboard entry to SUPER_ADMIN and ADMIN roles", () => {
    expect(profileCanAccessAdmin({ role: "SUPER_ADMIN" })).toBe(true)
    expect(profileCanAccessAdmin({ role: "ADMIN" })).toBe(true)
  })

  it("grants MARKETPLACE_STAFF dashboard entry only with at least one explicit permission", () => {
    expect(
      profileCanAccessAdmin({
        role: "MARKETPLACE_STAFF",
        admin_permissions: {
          manage_marketplace: true,
        },
      }),
    ).toBe(true)

    expect(
      profileCanAccessAdmin({
        role: "MARKETPLACE_STAFF",
        admin_permissions: {
          manage_marketplace: false,
        },
      }),
    ).toBe(false)
  })

  it("denies dashboard entry for missing or non-admin profiles", () => {
    expect(profileCanAccessAdmin(null)).toBe(false)
    expect(profileCanAccessAdmin({ role: "PARENT" })).toBe(false)
  })
})
