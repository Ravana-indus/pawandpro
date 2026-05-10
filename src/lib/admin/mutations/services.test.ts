import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  cancelAdminBooking,
  updateAdminAdoptionCenterMetadata,
  updateAdminHospitalMetadata,
  updateAdminProviderVerification,
} from "./services"
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
  const update = vi.fn().mockImplementation((payload: Record<string, unknown>) => ({
    eq: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            ...beforeRow,
            ...payload,
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

function createHospitalFormData(overrides: Record<string, string> = {}) {
  const formData = new FormData()
  formData.set("name", "City Pet Hospital")
  formData.set("address", "42 Main St")
  formData.set("phone", "555-0142")
  formData.set("email", "care@example.com")
  formData.set("license_number", "HOSP-100")
  formData.set("is_verified", "true")

  for (const [key, value] of Object.entries(overrides)) {
    formData.set(key, value)
  }

  return formData
}

function createAdoptionFormData(overrides: Record<string, string> = {}) {
  const formData = new FormData()
  formData.set("name", "Happy Tails Center")
  formData.set("type", "Rescue")
  formData.set("address", "88 Pine Ave")
  formData.set("phone", "555-0177")
  formData.set("email", "hello@happytails.org")
  formData.set("license_number", "ADP-200")
  formData.set("is_verified", "false")

  for (const [key, value] of Object.entries(overrides)) {
    formData.set(key, value)
  }

  return formData
}

describe("cancelAdminBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("requires a reason", async () => {
    const result = await cancelAdminBooking("booking-1", "")

    expect(result).toEqual({
      success: false,
      error: expect.any(String),
    })
    expect(requireAdminPermission).not.toHaveBeenCalled()
  })

  it("updates booking status to Cancelled and writes audit entry", async () => {
    const { supabase, spies } = createSupabaseUpdateMock({
      id: "booking-1",
      status: "Confirmed",
      service_type: "Grooming",
    })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const result = await cancelAdminBooking("booking-1", "Customer requested cancellation")

    expect(result.success).toBe(true)
    expect(requireAdminPermission).toHaveBeenCalledWith("manage_services")
    expect(spies.from).toHaveBeenCalledWith("service_bookings")
    expect(spies.update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "Cancelled",
      }),
    )
    expect(writeAdminAuditLog).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        action: "cancel_booking",
        targetType: "service_bookings",
        targetId: "booking-1",
        reason: "Customer requested cancellation",
      }),
    )
  })
})

describe("updateAdminProviderVerification", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("requires a reason", async () => {
    const result = await updateAdminProviderVerification("provider-1", true, "")

    expect(result).toEqual({
      success: false,
      error: expect.any(String),
    })
    expect(requireAdminPermission).not.toHaveBeenCalled()
  })

  it("updates verification status and writes audit entry", async () => {
    const { supabase, spies } = createSupabaseUpdateMock({
      id: "provider-1",
      is_verified: false,
      service_type: "Grooming",
    })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const result = await updateAdminProviderVerification(
      "provider-1",
      true,
      "Completed credential review",
    )

    expect(result.success).toBe(true)
    expect(requireAdminPermission).toHaveBeenCalledWith("manage_services")
    expect(spies.from).toHaveBeenCalledWith("service_provider_details")
    expect(spies.update).toHaveBeenCalledWith(
      expect.objectContaining({
        is_verified: true,
      }),
    )
    expect(writeAdminAuditLog).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        action: "update_provider_verification",
        targetType: "service_provider_details",
        targetId: "provider-1",
        reason: "Completed credential review",
      }),
    )
  })
})

describe("updateAdminHospitalMetadata", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("updates hospital metadata and writes audit entry", async () => {
    const { supabase, spies } = createSupabaseUpdateMock({
      id: "hospital-1",
      name: "Old Hospital",
      is_verified: false,
    })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const result = await updateAdminHospitalMetadata("hospital-1", createHospitalFormData())

    expect(result.success).toBe(true)
    expect(requireAdminPermission).toHaveBeenCalledWith("manage_vets")
    expect(spies.from).toHaveBeenCalledWith("hospitals")
    expect(spies.update).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "City Pet Hospital",
        address: "42 Main St",
        is_verified: true,
      }),
    )
    expect(writeAdminAuditLog).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        action: "update_hospital",
        targetType: "hospitals",
        targetId: "hospital-1",
      }),
    )
  })
})

describe("updateAdminAdoptionCenterMetadata", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("updates adoption center metadata and writes audit entry", async () => {
    const { supabase, spies } = createSupabaseUpdateMock({
      id: "center-1",
      name: "Old Center",
      is_verified: true,
    })
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const result = await updateAdminAdoptionCenterMetadata(
      "center-1",
      createAdoptionFormData(),
    )

    expect(result.success).toBe(true)
    expect(requireAdminPermission).toHaveBeenCalledWith("manage_adoption")
    expect(spies.from).toHaveBeenCalledWith("adoption_centers")
    expect(spies.update).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Happy Tails Center",
        type: "Rescue",
        is_verified: false,
      }),
    )
    expect(writeAdminAuditLog).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        action: "update_adoption_center",
        targetType: "adoption_centers",
        targetId: "center-1",
      }),
    )
  })
})
