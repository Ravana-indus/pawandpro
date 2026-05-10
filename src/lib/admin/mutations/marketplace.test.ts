import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  deleteAdminListing,
  transitionAdminListingStatus,
  transitionAdminOrderStatus,
  updateAdminListingCertification,
  updateAdminListingMetadata,
} from './marketplace'
import { writeAdminAuditLog } from '../audit'
import { requireAdminPermission } from '../permissions'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('../audit', () => ({
  writeAdminAuditLog: vi.fn(),
}))

vi.mock('../permissions', () => ({
  requireAdminPermission: vi.fn(),
}))

type AdminContext = Awaited<ReturnType<typeof requireAdminPermission>>

function createAdminContext(supabase: unknown): AdminContext {
  return {
    supabase: supabase as AdminContext['supabase'],
    userId: 'admin-1',
    profile: {
      id: 'admin-1',
      role: 'ADMIN',
      full_name: null,
      admin_permissions: {},
    },
  }
}

function createSupabaseMock() {
  const beforeListing = {
    id: 'listing-1',
    name: 'Old Name',
    species: 'Dog',
    breed: 'Labrador',
    sex: 'Male',
    age: '2 years',
    price: 300,
    type: 'Buy',
    status: 'Available',
    certification_tier: 'Gold',
    image_url: 'https://example.com/old.jpg',
  }

  const afterListing = {
    ...beforeListing,
    name: 'New Name',
    breed: null,
    sex: null,
    age: null,
    price: 450,
    certification_tier: null,
    image_url: null,
  }

  const update = vi.fn().mockImplementation((payload: Record<string, unknown>) => ({
    eq: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            ...afterListing,
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
        data: beforeListing,
        error: null,
      }),
    }),
  })

  const deleteFn = vi.fn().mockReturnValue({
    eq: vi.fn().mockResolvedValue({ error: null }),
  })

  const from = vi.fn().mockReturnValue({
    select,
    update,
    delete: deleteFn,
  })

  return {
    supabase: { from },
    spies: { from, update, select, deleteFn },
  }
}

function createOrderSupabaseMock() {
  const beforeOrder = {
    id: 'order-1',
    status: 'Processing',
    total_amount: 250,
  }

  const update = vi.fn().mockImplementation((payload: Record<string, unknown>) => ({
    eq: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            ...beforeOrder,
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
        data: beforeOrder,
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

function createListingFormData(overrides: Record<string, string> = {}) {
  const formData = new FormData()
  formData.set('name', 'New Name')
  formData.set('species', 'Dog')
  formData.set('breed', 'Labrador')
  formData.set('sex', 'Male')
  formData.set('age', '3 years')
  formData.set('price', '450')
  formData.set('type', 'Buy')
  formData.set('status', 'Pending')
  formData.set('certification_tier', 'Silver')
  formData.set('image_url', 'https://example.com/new.jpg')

  for (const [key, value] of Object.entries(overrides)) {
    formData.set(key, value)
  }

  return formData
}

describe('updateAdminListingMetadata', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('writes listing metadata updates to pet_listings', async () => {
    const { supabase, spies } = createSupabaseMock()
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const result = await updateAdminListingMetadata('listing-1', createListingFormData())

    expect(result.success).toBe(true)
    expect(spies.from).toHaveBeenCalledWith('pet_listings')
    expect(spies.update).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'New Name',
        species: 'Dog',
        price: 450,
        type: 'Buy',
      }),
    )
  })

  it('allows blank optional fields to clear existing values intentionally', async () => {
    const { supabase, spies } = createSupabaseMock()
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const formData = createListingFormData({
      breed: '',
      sex: '',
      age: '',
      certification_tier: '',
      image_url: '',
    })

    await updateAdminListingMetadata('listing-1', formData)

    expect(spies.update).toHaveBeenCalledWith(
      expect.objectContaining({
        breed: null,
        sex: null,
        age: null,
        certification_tier: null,
        image_url: null,
      }),
    )
  })

  it('writes audit entries with target type pet_listings on update', async () => {
    const { supabase } = createSupabaseMock()
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    await updateAdminListingMetadata('listing-1', createListingFormData())

    expect(writeAdminAuditLog).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        targetType: 'pet_listings',
        targetId: 'listing-1',
        action: 'update_listing',
      }),
    )
  })
})

describe('deleteAdminListing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('requires a reason', async () => {
    const result = await deleteAdminListing('listing-1', '')

    expect(result).toEqual({
      success: false,
      error: expect.any(String),
    })
    expect(requireAdminPermission).not.toHaveBeenCalled()
  })

  it('writes audit entries with target type pet_listings on delete', async () => {
    const { supabase, spies } = createSupabaseMock()
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const result = await deleteAdminListing('listing-1', 'Violation of listing policy')

    expect(result.success).toBe(true)
    expect(spies.from).toHaveBeenCalledWith('pet_listings')
    expect(spies.deleteFn).toHaveBeenCalledTimes(1)
    expect(writeAdminAuditLog).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        targetType: 'pet_listings',
        targetId: 'listing-1',
        action: 'delete_listing',
      }),
    )
  })
})

describe('transitionAdminOrderStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('validates status', async () => {
    const result = await transitionAdminOrderStatus('order-1', 'Unknown', 'Operational correction')

    expect(result).toEqual({
      success: false,
      error: expect.any(String),
    })
    expect(requireAdminPermission).not.toHaveBeenCalled()
  })

  it('writes orders.updated_at and audit with reason', async () => {
    const { supabase, spies } = createOrderSupabaseMock()
    vi.mocked(requireAdminPermission).mockResolvedValue(createAdminContext(supabase))

    const result = await transitionAdminOrderStatus('order-1', 'Delivered', 'Carrier confirmed delivery')

    expect(result.success).toBe(true)
    expect(spies.from).toHaveBeenCalledWith('orders')
    expect(spies.update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'Delivered',
        updated_at: expect.any(String),
      }),
    )
    expect(writeAdminAuditLog).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        action: 'transition_order_status',
        targetType: 'orders',
        targetId: 'order-1',
        reason: 'Carrier confirmed delivery',
      }),
    )
  })
})

describe('listing workflow reason requirements', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('listing status transition requires reason', async () => {
    const result = await transitionAdminListingStatus('listing-1', 'Sold', '')

    expect(result).toEqual({
      success: false,
      error: expect.any(String),
    })
    expect(requireAdminPermission).not.toHaveBeenCalled()
  })

  it('listing certification update requires reason', async () => {
    const result = await updateAdminListingCertification('listing-1', 'Gold', '')

    expect(result).toEqual({
      success: false,
      error: expect.any(String),
    })
    expect(requireAdminPermission).not.toHaveBeenCalled()
  })
})
