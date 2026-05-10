# Admin CRUD — Phase 3: Service Provider Pages

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Build detail/edit pages for Vets, Adoption Centers, Service Providers, and Bookings. Wire list pages with real CRUD actions.

**Depends on:** Phase 1 (admin.ts actions, reusable components)

**Tech Stack:** Next.js 15 App Router, React Server Components, Supabase, Tailwind CSS

---

## New/Modified Files

```
src/
  app/admin/services/
    vets/
      [id]/page.tsx              # NEW — Vet detail + hospital linking
      new/page.tsx               # NEW — Create vet profile
    adoption/
      [id]/page.tsx              # NEW — Adoption center detail + edit
      new/page.tsx               # NEW — Create adoption center
    providers/
      [id]/page.tsx              # NEW — Provider detail + verify
      new/page.tsx               # NEW — Create provider
    bookings/
      [id]/page.tsx              # NEW — Booking detail + status update
  components/admin/
    VetsPageClient.tsx           # MODIFIED — Wire View/Link Hospital/Add Vet
    AdoptionPageClient.tsx       # MODIFIED — Wire View/Delete/Add Center
    ProvidersPageClient.tsx      # MODIFIED — Wire View/Verify/Add Provider
    BookingsPageClient.tsx       # MODIFIED — Wire status update
  lib/queries/admin.ts           # MODIFIED — Add getVetById, getBookingById
```

---

## Task 1: Add Query Helpers

**Files:**
- Modify: `src/lib/queries/admin.ts`

- [ ] **Step 1: Add getVetById, getBookingById**

```typescript
export async function getVetById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      service_provider_details(*),
      hospital_vets(
        hospital_id,
        hospital:hospitals(*)
      )
    `)
    .eq('id', id)
    .eq('role', 'VET')
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function getBookingById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      vet:profiles!appointments_vet_id_fkey(full_name, contact_email),
      parent:profiles!appointments_parent_id_fkey(full_name, contact_email),
      pet:pets(name, species)
    `)
    .eq('id', id)
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/queries/admin.ts
git commit -m "feat(admin): add getVetById and getBookingById query helpers"
```

---

## Task 2: Vet Detail Page + Hospital Linking

**Files:**
- Create: `src/app/admin/services/vets/[id]/page.tsx`
- Create: `src/app/admin/services/vets/new/page.tsx`
- Modify: `src/components/admin/VetsPageClient.tsx`

- [ ] **Step 1: Create vet detail page**

```typescript
import React from 'react'
import { notFound } from 'next/navigation'
import { getVetById, getHospitals } from '@/lib/queries/admin'
import { linkVetToHospital } from '@/lib/actions/admin'
import { EntityHeader } from '@/components/admin/EntityHeader'
import { StatusBadge } from '@/components/admin/StatusBadge'

interface VetDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function VetDetailPage({ params }: VetDetailPageProps) {
  const { id } = await params
  const { data: vet } = await getVetById(id)
  const hospitals = await getHospitals()

  if (!vet) notFound()

  const details = (vet.service_provider_details || {}) as Record<string, unknown>
  const linkedHospitals = (vet.hospital_vets || []) as Record<string, unknown>[]

  return (
    <div className="space-y-6">
      <EntityHeader
        title={vet.full_name || 'Unnamed Vet'}
        subtitle={String(details.specialization || 'General Practitioner')}
        backHref="/admin/services/vets"
        backLabel="Back to Vets"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
            <h2 className="text-lg font-bold text-on-surface mb-4">Vet Info</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Email</span>
                <span className="text-on-surface">{vet.contact_email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Verified</span>
                <StatusBadge status={details.is_verified ? 'verified' : 'pending'} />
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Service Fee</span>
                <span className="text-on-surface">{details.service_fee ? `$${Number(details.service_fee).toFixed(2)}` : 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
            <h2 className="text-lg font-bold text-on-surface mb-4">Link Hospital</h2>
            <form
              action={async (formData: FormData) => {
                'use server'
                const hospitalId = formData.get('hospital_id') as string
                await linkVetToHospital(id, hospitalId)
              }}
              className="space-y-3"
            >
              <select name="hospital_id" className="w-full px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
                <option value="">Select a hospital...</option>
                {hospitals.data?.map((h: any) => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
              <button type="submit" className="w-full px-4 py-2 rounded-xl bg-primary text-on-primary font-medium hover:opacity-90">
                Link Hospital
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
            <h2 className="text-lg font-bold text-on-surface mb-4">Linked Hospitals</h2>
            {linkedHospitals.length === 0 ? (
              <p className="text-on-surface-variant text-sm">Not linked to any hospital.</p>
            ) : (
              <div className="space-y-3">
                {linkedHospitals.map((link: any) => (
                  <div key={link.hospital_id} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg">
                    <div>
                      <div className="font-medium text-on-surface">{link.hospital?.name}</div>
                      <div className="text-sm text-on-surface-variant">{link.hospital?.address}</div>
                    </div>
                    <StatusBadge status={link.hospital?.is_verified ? 'verified' : 'pending'} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create vet creation page (new)**

Simple form to invite/create a vet profile. For Phase 3, create a placeholder that redirects or shows "Vets register through the public portal" message. Full vet creation is out of scope — vets self-register.

```typescript
// src/app/admin/services/vets/new/page.tsx
import React from 'react'
import { EntityHeader } from '@/components/admin/EntityHeader'

export default function NewVetPage() {
  return (
    <div className="space-y-6">
      <EntityHeader
        title="Add Veterinarian"
        subtitle="Veterinarians register through the public portal. Manage existing vets below."
        backHref="/admin/services/vets"
        backLabel="Back to Vets"
      />
      <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
        <p className="text-on-surface-variant">
          To add a new veterinarian, they must sign up via the veterinary portal.
          Use the main list to manage and verify existing vets.
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Update VetsPageClient with real actions**

Wire the "View" button to navigate to detail page. Wire "Link Hospital" as a quick action dropdown. Add "Add Vet" button.

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/services/vets/ src/components/admin/VetsPageClient.tsx
git commit -m "feat(admin): add vet detail page with hospital linking"
```

---

## Task 3: Adoption Center Detail + Create

**Files:**
- Create: `src/app/admin/services/adoption/[id]/page.tsx`
- Create: `src/app/admin/services/adoption/new/page.tsx`
- Modify: `src/components/admin/AdoptionPageClient.tsx`

- [ ] **Step 1: Create adoption center detail/edit page**

```typescript
import React from 'react'
import { notFound } from 'next/navigation'
import { getAdoptionCenters } from '@/lib/queries/admin'
import { updateAdoptionCenter, deleteAdoptionCenter } from '@/lib/actions/admin'
import { EntityHeader } from '@/components/admin/EntityHeader'
import { EntityForm } from '@/components/admin/EntityForm'
import { FormField } from '@/components/admin/FormField'
import { StatusBadge } from '@/components/admin/StatusBadge'

interface AdoptionDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AdoptionDetailPage({ params }: AdoptionDetailPageProps) {
  const { id } = await params
  const { data: centers } = await getAdoptionCenters()
  const center = centers?.find((c: any) => c.id === id)

  if (!center) notFound()

  const updateAction = async (formData: FormData) => {
    'use server'
    return updateAdoptionCenter(id, formData)
  }

  return (
    <div className="space-y-6">
      <EntityHeader
        title={center.name}
        subtitle={`${center.type || 'General'} — ${center.address || 'No address'}`}
        backHref="/admin/services/adoption"
        backLabel="Back to Adoption Centers"
        actions={
          <form action={async () => { 'use server'; await deleteAdoptionCenter(id) }}>
            <button type="submit" className="px-4 py-2 rounded-xl bg-error/10 text-error font-medium hover:bg-error/20">
              Delete
            </button>
          </form>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
            <h2 className="text-lg font-bold text-on-surface mb-4">Center Info</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Verified</span>
                <StatusBadge status={center.is_verified ? 'verified' : 'pending'} />
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">License</span>
                <span className="text-on-surface">{center.license_number || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Phone</span>
                <span className="text-on-surface">{center.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Email</span>
                <span className="text-on-surface">{center.email || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
            <h2 className="text-lg font-bold text-on-surface mb-4">Edit Center</h2>
            <EntityForm action={updateAction}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Name" name="name" defaultValue={center.name} required />
                <FormField label="Type" name="type" defaultValue={center.type} />
                <FormField label="Address" name="address" defaultValue={center.address} />
                <FormField label="Phone" name="phone" defaultValue={center.phone} />
                <FormField label="Email" name="email" type="email" defaultValue={center.email} />
                <FormField label="License Number" name="license_number" defaultValue={center.license_number} />
              </div>
            </EntityForm>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create adoption center creation page**

```typescript
import React from 'react'
import { createAdoptionCenter } from '@/lib/actions/admin'
import { EntityHeader } from '@/components/admin/EntityHeader'
import { EntityForm } from '@/components/admin/EntityForm'
import { FormField } from '@/components/admin/FormField'

export default function CreateAdoptionCenterPage() {
  return (
    <div className="space-y-6">
      <EntityHeader
        title="Create Adoption Center"
        subtitle="Add a new adoption center to the platform"
        backHref="/admin/services/adoption"
        backLabel="Back to Adoption Centers"
      />
      <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 max-w-2xl">
        <EntityForm action={createAdoptionCenter}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Name" name="name" required />
            <FormField label="Type" name="type" />
            <FormField label="Address" name="address" />
            <FormField label="Phone" name="phone" />
            <FormField label="Email" name="email" type="email" />
            <FormField label="License Number" name="license_number" />
          </div>
        </EntityForm>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Update AdoptionPageClient with real actions + Add button**

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/services/adoption/ src/components/admin/AdoptionPageClient.tsx
git commit -m "feat(admin): add adoption center detail, create, and wired list"
```

---

## Task 4: Service Provider Detail + Create

**Files:**
- Create: `src/app/admin/services/providers/[id]/page.tsx`
- Create: `src/app/admin/services/providers/new/page.tsx`
- Modify: `src/components/admin/ProvidersPageClient.tsx`

Follow the same pattern as Task 3. Use `updateProviderStatus` for verify/unverify actions. Form fields: service_type, specialization, service_fee, is_available_now.

- [ ] **Step 1: Create provider detail page**
- [ ] **Step 2: Create provider creation page**
- [ ] **Step 3: Update ProvidersPageClient with View/Verify/Add buttons**
- [ ] **Step 4: Commit**

```bash
git add src/app/admin/services/providers/ src/components/admin/ProvidersPageClient.tsx
git commit -m "feat(admin): add provider detail, create, and wired list"
```

---

## Task 5: Booking Detail Page

**Files:**
- Create: `src/app/admin/services/bookings/[id]/page.tsx`
- Modify: `src/components/admin/BookingsPageClient.tsx`

- [ ] **Step 1: Create booking detail page**

```typescript
import React from 'react'
import { notFound } from 'next/navigation'
import { getBookingById } from '@/lib/queries/admin'
import { updateBookingStatus } from '@/lib/actions/admin'
import { EntityHeader } from '@/components/admin/EntityHeader'
import { StatusBadge } from '@/components/admin/StatusBadge'

interface BookingDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { id } = await params
  const { data: booking } = await getBookingById(id)

  if (!booking) notFound()

  return (
    <div className="space-y-6">
      <EntityHeader
        title={`Booking #${String(booking.id).slice(0, 8)}`}
        subtitle={`${(booking.service_type || 'Service').toString()}`}
        backHref="/admin/services/bookings"
        backLabel="Back to Bookings"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
            <h2 className="text-lg font-bold text-on-surface mb-4">Booking Info</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Status</span>
                <StatusBadge status={String(booking.status || 'Scheduled')} />
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Vet</span>
                <span className="text-on-surface">{(booking.vet as any)?.full_name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Customer</span>
                <span className="text-on-surface">{(booking.parent as any)?.full_name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Pet</span>
                <span className="text-on-surface">{(booking.pet as any)?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Scheduled</span>
                <span className="text-on-surface">{new Date(booking.scheduled_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Fee</span>
                <span className="text-on-surface">{booking.fee ? `$${Number(booking.fee).toFixed(2)}` : 'N/A'}</span>
              </div>
            </div>

            <h3 className="text-sm font-bold text-on-surface mt-6 mb-3">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {(['Scheduled', 'Completed', 'Cancelled'] as const).map((status) => (
                <form key={status} action={async () => { 'use server'; await updateBookingStatus(id, status) }}>
                  <button
                    type="submit"
                    disabled={booking.status === status}
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      booking.status === status
                        ? 'bg-surface-container-high text-on-surface-variant cursor-default'
                        : 'bg-primary/10 text-primary hover:bg-primary/20'
                    }`}
                  >
                    {status}
                  </button>
                </form>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
            <h2 className="text-lg font-bold text-on-surface mb-4">Notes</h2>
            <p className="text-on-surface-variant text-sm whitespace-pre-wrap">
              {booking.notes || 'No notes for this booking.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update BookingsPageClient with View links**

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/services/bookings/[id]/page.tsx src/components/admin/BookingsPageClient.tsx
git commit -m "feat(admin): add booking detail page with status management"
```

---

## Acceptance Criteria

- [ ] `/admin/services/vets/[id]` shows vet info + linked hospitals + link form
- [ ] `/admin/services/adoption/[id]` shows center info + edit form + delete
- [ ] `/admin/services/adoption/new` creates a new adoption center
- [ ] `/admin/services/providers/[id]` shows provider info + verify toggle
- [ ] `/admin/services/bookings/[id]` shows booking details + status buttons
- [ ] All list pages have working View/Add/Delete/Verify buttons
- [ ] Audit logs created for all mutations
