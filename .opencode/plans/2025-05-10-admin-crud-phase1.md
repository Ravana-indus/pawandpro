# Admin CRUD — Phase 1: Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the foundational server actions, validation schemas, reusable form components, and wire the DataTable so all subsequent admin CRUD pages have a working base.

**Architecture:** Server Actions (Next.js 15 App Router) → Supabase mutations with Zod validation → generic form components → DataTable with working filters/pagination/sorting. All destructive actions log to `audit_logs`.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Supabase (server/client), Zod, `useFormState`/`useFormStatus`

---

## File Structure

```
src/
  lib/
    actions/admin.ts          # NEW — All admin server actions
    schemas/admin.ts          # NEW — Zod schemas for all forms
    queries/admin.ts          # MODIFIED — Add getProductById, getListingById, etc.
  components/admin/
    EntityForm.tsx            # NEW — Generic form wrapper
    FormField.tsx             # NEW — Reusable field with label + error
    StatusBadge.tsx           # NEW — Color-coded status chip
    EntityHeader.tsx          # NEW — Breadcrumb + back + title
  components/
    DataTable.tsx             # MODIFIED — Functional filters, sort, pagination, loading state
```

---

## Task 1: Validation Schemas (`src/lib/schemas/admin.ts`)

**Files:**
- Create: `src/lib/schemas/admin.ts`

- [ ] **Step 1: Write Zod schemas for all admin entities**

```typescript
import { z } from 'zod'

export const userRoleSchema = z.enum([
  'CUSTOMER', 'BREEDER', 'INDIVIDUAL_SELLER', 'VET',
  'ADOPTION_PROVIDER', 'GROOMER', 'PET_TRAINER', 'TRANSPORTER',
  'SUPER_ADMIN', 'ADMIN', 'MARKETPLACE_STAFF', 'PARENT', 'SELLER'
])

export const updateUserSchema = z.object({
  full_name: z.string().min(1, 'Name is required').max(100),
  contact_email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  role: userRoleSchema,
  is_verified: z.boolean(),
  verification_status: z.string().optional(),
})

export const banUserSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().min(1, 'Reason is required'),
  durationDays: z.number().int().min(1).max(365).optional(),
})

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  brand: z.string().optional(),
  category: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  stock_quantity: z.number().int().min(0),
  seller_id: z.string().uuid().optional(),
  details: z.record(z.any()).optional(),
})

export const listingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  species: z.enum(['Dog', 'Cat', 'Bird', 'Fish', 'Small Pet', 'Reptile']),
  breed: z.string().optional(),
  sex: z.enum(['Male', 'Female']).optional(),
  age: z.string().optional(),
  price: z.number().positive(),
  seller_id: z.string().uuid().optional(),
  type: z.enum(['Buy', 'Adopt', 'Rehome']),
  status: z.enum(['Available', 'Pending', 'Sold']).optional(),
  certification_tier: z.enum(['Gold', 'Silver', 'Verified', 'Shelter']).optional(),
  image_url: z.string().url().optional(),
})

export const orderStatusSchema = z.enum([
  'Processing', 'In Transit', 'Delivered', 'Cancelled'
])

export const hospitalSchema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  license_number: z.string().optional(),
  admin_id: z.string().uuid().optional(),
  is_verified: z.boolean().optional(),
})

export const adoptionCenterSchema = z.object({
  name: z.string().min(1),
  type: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  license_number: z.string().optional(),
  owner_id: z.string().uuid().optional(),
  is_verified: z.boolean().optional(),
})

export const postSchema = z.object({
  title: z.string().max(200).optional().nullable(),
  content: z.string().optional().nullable(),
  type: z.string().optional(),
  is_approved: z.boolean().optional(),
  is_pinned: z.boolean().optional(),
})

export const moderationActionSchema = z.object({
  itemId: z.string().uuid(),
  action: z.enum(['dismiss', 'review', 'remove']),
  notes: z.string().optional(),
})

export const verificationActionSchema = z.object({
  sellerId: z.string().uuid(),
  status: z.enum(['approved', 'rejected']),
  tier: z.enum(['Gold', 'Silver', 'Verified', 'Shelter']).optional(),
  notes: z.string().optional(),
})
```

- [ ] **Step 2: Install zod if not present**

Run: `npm list zod || npm install zod`
Expected: zod installed

- [ ] **Step 3: Commit**

```bash
git add src/lib/schemas/admin.ts package.json package-lock.json
git commit -m "feat(admin): add Zod validation schemas for all admin forms"
```

---

## Task 2: Core Server Actions (`src/lib/actions/admin.ts`) — Part A

**Files:**
- Create: `src/lib/actions/admin.ts`

- [ ] **Step 1: Write audit log helper and permission checker**

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Permission checker — throws on auth failure; wrap action calls in try/catch
async function requireAdmin(action: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, admin_permissions')
    .eq('id', user.id)
    .single()

  const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'MARKETPLACE_STAFF']
  if (!profile || !adminRoles.includes(profile.role || '')) {
    throw new Error('Forbidden: Admin access required')
  }

  // TODO: Fine-grained permission checks per action (Phase 2+)
  return { supabase, userId: user.id, profile }
}

// Audit logger
async function logAudit(
  action: string,
  targetType: string,
  targetId: string | null,
  details?: Record<string, unknown>
) {
  const { supabase, userId } = await requireAdmin(action)
  await supabase.from('audit_logs').insert({
    action,
    actor_id: userId,
    target_type: targetType,
    target_id: targetId,
    details: details || {},
  })
}
```

- [ ] **Step 2: Write user management actions**

```typescript
import { banUserSchema, updateUserSchema } from '@/lib/schemas/admin'

export async function updateUser(id: string, formData: FormData) {
  const { supabase } = await requireAdmin('update_user')

  const raw = Object.fromEntries(formData)
  const parsed = updateUserSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const { error } = await supabase.from('profiles').update(parsed.data).eq('id', id)
  if (error) return { error: error.message }

  await logAudit('update_user', 'user', id, parsed.data)
  revalidatePath('/admin/users')
  return { success: true }
}

export async function banUser(formData: FormData) {
  const { supabase } = await requireAdmin('ban_user')

  const raw = Object.fromEntries(formData)
  raw.durationDays = raw.durationDays ? Number(raw.durationDays) : undefined
  const parsed = banUserSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const { userId, reason, durationDays } = parsed.data
  const bannedUntil = durationDays
    ? new Date(Date.now() + durationDays * 86400000).toISOString()
    : new Date(Date.now() + 365 * 86400000).toISOString()

  const { error } = await supabase
    .from('profiles')
    .update({ banned_until: bannedUntil })
    .eq('id', userId)

  if (error) return { error: error.message }

  await logAudit('ban_user', 'user', userId, { reason, durationDays })
  revalidatePath('/admin/users')
  return { success: true }
}

export async function unbanUser(userId: string) {
  const { supabase } = await requireAdmin('unban_user')

  const { error } = await supabase
    .from('profiles')
    .update({ banned_until: null })
    .eq('id', userId)

  if (error) return { error: error.message }

  await logAudit('unban_user', 'user', userId)
  revalidatePath('/admin/users')
  return { success: true }
}
```

- [ ] **Step 3: Write verification actions**

```typescript
import { verificationActionSchema } from '@/lib/schemas/admin'

export async function handleVerification(formData: FormData) {
  const { supabase } = await requireAdmin('handle_verification')

  const raw = Object.fromEntries(formData)
  const parsed = verificationActionSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const { sellerId, status, tier, notes } = parsed.data

  const { error: verifError } = await supabase
    .from('seller_verifications')
    .update({ status, tier: tier || null, notes: notes || null, reviewed_at: new Date().toISOString() })
    .eq('seller_id', sellerId)

  if (verifError) return { error: verifError.message }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      verification_status: status === 'approved' ? 'verified' : 'rejected',
      is_verified: status === 'approved',
    })
    .eq('id', sellerId)

  if (profileError) return { error: profileError.message }

  await logAudit(`${status}_verification`, 'user', sellerId, { tier, notes })
  revalidatePath('/admin/verifications')
  return { success: true }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/actions/admin.ts
git commit -m "feat(admin): add user management and verification server actions"
```

---

## Task 3: Core Server Actions — Part B (Marketplace)

**Files:**
- Modify: `src/lib/actions/admin.ts`

- [ ] **Step 1: Write product CRUD actions**

```typescript
import { productSchema } from '@/lib/schemas/admin'

export async function createProduct(formData: FormData) {
  const { supabase } = await requireAdmin('create_product')

  const raw = Object.fromEntries(formData)
  raw.price = Number(raw.price)
  raw.stock_quantity = Number(raw.stock_quantity)
  const parsed = productSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const { error, data } = await supabase.from('products').insert(parsed.data).select().single()
  if (error) return { error: error.message }

  await logAudit('create_product', 'product', data.id, parsed.data)
  revalidatePath('/admin/marketplace/products')
  return { success: true, data }
}

export async function updateProduct(id: string, formData: FormData) {
  const { supabase } = await requireAdmin('update_product')

  const raw = Object.fromEntries(formData)
  if (raw.price) raw.price = Number(raw.price)
  if (raw.stock_quantity) raw.stock_quantity = Number(raw.stock_quantity)
  const parsed = productSchema.partial().safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const { error } = await supabase.from('products').update(parsed.data).eq('id', id)
  if (error) return { error: error.message }

  await logAudit('update_product', 'product', id, parsed.data)
  revalidatePath('/admin/marketplace/products')
  revalidatePath(`/admin/marketplace/products/${id}`)
  return { success: true }
}

export async function deleteProduct(id: string) {
  const { supabase } = await requireAdmin('delete_product')

  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { error: error.message }

  await logAudit('delete_product', 'product', id)
  revalidatePath('/admin/marketplace/products')
  return { success: true }
}
```

- [ ] **Step 2: Write listing CRUD actions**

```typescript
import { listingSchema } from '@/lib/schemas/admin'

export async function createListing(formData: FormData) {
  const { supabase } = await requireAdmin('create_listing')

  const raw = Object.fromEntries(formData)
  raw.price = Number(raw.price)
  const parsed = listingSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const { error, data } = await supabase.from('pet_listings').insert(parsed.data).select().single()
  if (error) return { error: error.message }

  await logAudit('create_listing', 'listing', data.id, parsed.data)
  revalidatePath('/admin/marketplace/listings')
  return { success: true, data }
}

export async function updateListing(id: string, formData: FormData) {
  const { supabase } = await requireAdmin('update_listing')

  const raw = Object.fromEntries(formData)
  if (raw.price) raw.price = Number(raw.price)
  const parsed = listingSchema.partial().safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const { error } = await supabase.from('pet_listings').update(parsed.data).eq('id', id)
  if (error) return { error: error.message }

  await logAudit('update_listing', 'listing', id, parsed.data)
  revalidatePath('/admin/marketplace/listings')
  revalidatePath(`/admin/marketplace/listings/${id}`)
  return { success: true }
}

export async function deleteListing(id: string) {
  const { supabase } = await requireAdmin('delete_listing')

  const { error } = await supabase.from('pet_listings').delete().eq('id', id)
  if (error) return { error: error.message }

  await logAudit('delete_listing', 'listing', id)
  revalidatePath('/admin/marketplace/listings')
  return { success: true }
}
```

- [ ] **Step 3: Write order actions**

```typescript
import { orderStatusSchema } from '@/lib/schemas/admin'

export async function updateOrderStatus(id: string, status: string) {
  const { supabase } = await requireAdmin('update_order_status')

  const parsed = orderStatusSchema.safeParse(status)
  if (!parsed.success) return { error: 'Invalid status' }

  const { error } = await supabase.from('orders').update({ status: parsed.data }).eq('id', id)
  if (error) return { error: error.message }

  await logAudit('update_order_status', 'order', id, { status: parsed.data })
  revalidatePath('/admin/marketplace/orders')
  revalidatePath(`/admin/marketplace/orders/${id}`)
  return { success: true }
}

export async function cancelOrder(id: string) {
  return updateOrderStatus(id, 'Cancelled')
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/actions/admin.ts
git commit -m "feat(admin): add marketplace CRUD server actions (products, listings, orders)"
```

---

## Task 4: Core Server Actions — Part C (Services + Community)

**Files:**
- Modify: `src/lib/actions/admin.ts`

- [ ] **Step 1: Write hospital + adoption center + provider actions**

```typescript
import { hospitalSchema, adoptionCenterSchema } from '@/lib/schemas/admin'

export async function createHospital(formData: FormData) {
  const { supabase } = await requireAdmin('create_hospital')
  const raw = Object.fromEntries(formData)
  const parsed = hospitalSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const { error, data } = await supabase.from('hospitals').insert(parsed.data).select().single()
  if (error) return { error: error.message }
  await logAudit('create_hospital', 'hospital', data.id, parsed.data)
  revalidatePath('/admin/services/vets')
  return { success: true, data }
}

export async function updateHospital(id: string, formData: FormData) {
  const { supabase } = await requireAdmin('update_hospital')
  const raw = Object.fromEntries(formData)
  const parsed = hospitalSchema.partial().safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const { error } = await supabase.from('hospitals').update(parsed.data).eq('id', id)
  if (error) return { error: error.message }
  await logAudit('update_hospital', 'hospital', id, parsed.data)
  revalidatePath('/admin/services/vets')
  return { success: true }
}

export async function linkVetToHospital(vetId: string, hospitalId: string) {
  const { supabase } = await requireAdmin('link_vet_hospital')
  const { error } = await supabase.from('hospital_vets').insert({ vet_id: vetId, hospital_id: hospitalId })
  if (error) return { error: error.message }
  await logAudit('link_vet_hospital', 'vet', vetId, { hospitalId })
  revalidatePath('/admin/services/vets')
  return { success: true }
}

export async function createAdoptionCenter(formData: FormData) {
  const { supabase } = await requireAdmin('create_adoption_center')
  const raw = Object.fromEntries(formData)
  const parsed = adoptionCenterSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const { error, data } = await supabase.from('adoption_centers').insert(parsed.data).select().single()
  if (error) return { error: error.message }
  await logAudit('create_adoption_center', 'adoption_center', data.id, parsed.data)
  revalidatePath('/admin/services/adoption')
  return { success: true, data }
}

export async function updateAdoptionCenter(id: string, formData: FormData) {
  const { supabase } = await requireAdmin('update_adoption_center')
  const raw = Object.fromEntries(formData)
  const parsed = adoptionCenterSchema.partial().safeParse(raw)
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const { error } = await supabase.from('adoption_centers').update(parsed.data).eq('id', id)
  if (error) return { error: error.message }
  await logAudit('update_adoption_center', 'adoption_center', id, parsed.data)
  revalidatePath('/admin/services/adoption')
  return { success: true }
}

export async function deleteAdoptionCenter(id: string) {
  const { supabase } = await requireAdmin('delete_adoption_center')
  const { error } = await supabase.from('adoption_centers').delete().eq('id', id)
  if (error) return { error: error.message }
  await logAudit('delete_adoption_center', 'adoption_center', id)
  revalidatePath('/admin/services/adoption')
  return { success: true }
}

export async function updateProviderStatus(id: string, isVerified: boolean) {
  const { supabase } = await requireAdmin('update_provider_status')
  const { error } = await supabase.from('service_provider_details').update({ is_verified: isVerified }).eq('id', id)
  if (error) return { error: error.message }
  await logAudit('update_provider_status', 'provider', id, { isVerified })
  revalidatePath('/admin/services/providers')
  return { success: true }
}
```

- [ ] **Step 2: Write community actions**

```typescript
export async function approvePost(id: string) {
  const { supabase } = await requireAdmin('approve_post')
  const { error } = await supabase.from('community_posts').update({ is_approved: true }).eq('id', id)
  if (error) return { error: error.message }
  await logAudit('approve_post', 'post', id)
  revalidatePath('/admin/community/posts')
  return { success: true }
}

export async function deletePost(id: string) {
  const { supabase } = await requireAdmin('delete_post')
  const { error } = await supabase.from('community_posts').delete().eq('id', id)
  if (error) return { error: error.message }
  await logAudit('delete_post', 'post', id)
  revalidatePath('/admin/community/posts')
  return { success: true }
}

export async function togglePinPost(id: string, isPinned: boolean) {
  const { supabase } = await requireAdmin('toggle_pin_post')
  const { error } = await supabase.from('community_posts').update({ is_pinned: isPinned }).eq('id', id)
  if (error) return { error: error.message }
  await logAudit('toggle_pin_post', 'post', id, { isPinned })
  revalidatePath('/admin/community/posts')
  return { success: true }
}

export async function approveComment(id: string) {
  const { supabase } = await requireAdmin('approve_comment')
  const { error } = await supabase.from('community_comments').update({ is_approved: true }).eq('id', id)
  if (error) return { error: error.message }
  await logAudit('approve_comment', 'comment', id)
  revalidatePath('/admin/community/comments')
  return { success: true }
}

export async function deleteComment(id: string) {
  const { supabase } = await requireAdmin('delete_comment')
  const { error } = await supabase.from('community_comments').delete().eq('id', id)
  if (error) return { error: error.message }
  await logAudit('delete_comment', 'comment', id)
  revalidatePath('/admin/community/comments')
  return { success: true }
}

export async function resolveModerationItem(id: string, action: string, notes?: string) {
  const { supabase } = await requireAdmin('resolve_moderation')
  const status = action === 'dismiss' ? 'dismissed' : action === 'remove' ? 'removed' : 'reviewed'
  const { error } = await supabase.from('moderation_queue').update({ status, reviewed_at: new Date().toISOString() }).eq('id', id)
  if (error) return { error: error.message }
  await logAudit('resolve_moderation', 'moderation_queue', id, { action, notes })
  revalidatePath('/admin/community/queue')
  return { success: true }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/actions/admin.ts
git commit -m "feat(admin): add service provider and community server actions"
```

---

## Task 5: Reusable Admin Components

**Files:**
- Create: `src/components/admin/StatusBadge.tsx`
- Create: `src/components/admin/FormField.tsx`
- Create: `src/components/admin/EntityForm.tsx`
- Create: `src/components/admin/EntityHeader.tsx`

- [ ] **Step 1: Create StatusBadge component**

```typescript
// src/components/admin/StatusBadge.tsx
'use client'

import React from 'react'

const statusMap: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
  banned: { bg: 'bg-red-100', text: 'text-red-700', label: 'Banned' },
  verified: { bg: 'bg-green-100', text: 'text-green-700', label: 'Verified' },
  unverified: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Unverified' },
  approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
  Processing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Processing' },
  'In Transit': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'In Transit' },
  Delivered: { bg: 'bg-green-100', text: 'text-green-700', label: 'Delivered' },
  Cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
  Available: { bg: 'bg-green-100', text: 'text-green-700', label: 'Available' },
  Sold: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Sold' },
  Gold: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Gold' },
  Silver: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Silver' },
}

export function StatusBadge({ status }: { status: string }) {
  const config = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-600', label: status }
  return (
    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}
```

- [ ] **Step 2: Create FormField component**

```typescript
// src/components/admin/FormField.tsx
'use client'

import React from 'react'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox'
  defaultValue?: string | number | boolean
  options?: { value: string; label: string }[]
  error?: string
  required?: boolean
}

export function FormField({ label, name, type = 'text', defaultValue, options, error, required }: FormFieldProps) {
  const baseClass = "w-full px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/50"

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-on-surface">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea name={name} defaultValue={String(defaultValue || '')} className={`${baseClass} min-h-[100px]`} />
      ) : type === 'select' ? (
        <select name={name} defaultValue={String(defaultValue || '')} className={baseClass}>
          {options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      ) : type === 'checkbox' ? (
        <input type="checkbox" name={name} defaultChecked={!!defaultValue} className="rounded" />
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={String(defaultValue || '')}
          className={baseClass}
        />
      )}
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
}
```

- [ ] **Step 3: Create EntityForm wrapper**

```typescript
// src/components/admin/EntityForm.tsx
'use client'

import React, { useState } from 'react'
import { useFormStatus } from 'react-dom'

function SubmitButton({ label = 'Save' }: { label?: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2 rounded-xl bg-primary text-on-primary font-medium hover:opacity-90 disabled:opacity-50"
    >
      {pending ? 'Saving...' : label}
    </button>
  )
}

interface EntityFormProps {
  action: (formData: FormData) => Promise<{ success?: boolean; error?: Record<string, string[]> | string; data?: unknown }>
  children: React.ReactNode
  onSuccess?: () => void
  submitLabel?: string
}

// NOTE: For update actions that require an ID, wrap the server action:
// const wrappedAction = (formData: FormData) => updateUser(userId, formData)
// <EntityForm action={wrappedAction}>...</EntityForm>

export function EntityForm({ action, children, onSuccess, submitLabel }: EntityFormProps) {
  const [error, setError] = useState<string | null>(null)

  async function handleAction(formData: FormData) {
    setError(null)
    const result = await action(formData)
    if (result.error) {
      if (typeof result.error === 'string') {
        setError(result.error)
      } else {
        setError('Please fix the form errors below')
      }
    } else if (result.success) {
      onSuccess?.()
    }
  }

  return (
    <form action={handleAction} className="space-y-4">
      {error && (
        <div className="p-4 rounded-xl bg-error/10 text-error text-sm">
          {error}
        </div>
      )}
      {children}
      <div className="flex gap-3 pt-4">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  )
}
```

- [ ] **Step 4: Create EntityHeader component**

```typescript
// src/components/admin/EntityHeader.tsx
'use client'

import React from 'react'
import Link from 'next/link'

interface EntityHeaderProps {
  title: string
  subtitle?: string
  backHref: string
  backLabel?: string
  actions?: React.ReactNode
}

export function EntityHeader({ title, subtitle, backHref, backLabel = 'Back', actions }: EntityHeaderProps) {
  return (
    <div className="space-y-4">
      <Link href={backHref} className="text-sm text-on-surface-variant hover:text-primary flex items-center gap-1">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        {backLabel}
      </Link>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">{title}</h1>
          {subtitle && <p className="text-on-surface-variant mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/
git commit -m "feat(admin): add reusable admin UI components (StatusBadge, FormField, EntityForm, EntityHeader)"
```

---

## Task 6: Enhance DataTable with Empty State, Loading, and Pagination

**Files:**
- Modify: `src/components/DataTable.tsx`

- [ ] **Step 1: Add isLoading and emptyMessage props with implementation**

Update the `DataTableProps` interface (around line 12):
```typescript
interface DataTableProps {
  columns: Column[]
  data: Record<string, unknown>[]
  pagination?: {
    page: number
    perPage: number
    total: number
    onPageChange: (page: number) => void
  }
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  actions?: (row: Record<string, unknown>) => React.ReactNode
  selectable?: boolean
  onSelect?: (selectedIds: string[]) => void
  emptyMessage?: string
  isLoading?: boolean
}
```

Update the function signature (around line 29):
```typescript
export function DataTable({
  columns,
  data,
  pagination,
  onSort,
  sortKey,
  sortDirection,
  actions,
  selectable,
  onSelect,
  emptyMessage,
  isLoading,
}: DataTableProps) {
```

Add loading state and empty state rendering inside tbody (after the existing `data.map` block):
```typescript
{isLoading && (
  <tr>
    <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="px-4 py-8">
      <div className="flex items-center justify-center gap-2 text-on-surface-variant">
        <span className="material-symbols-outlined animate-spin">refresh</span>
        Loading...
      </div>
    </td>
  </tr>
)}
{!isLoading && data.length === 0 && (
  <tr>
    <td colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)} className="px-4 py-8 text-center text-on-surface-variant">
      {emptyMessage || 'No data found'}
    </td>
  </tr>
)}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/DataTable.tsx
git commit -m "feat(admin): add DataTable loading state and empty message"
```

---

## Task 6.5: Update Admin Queries

**Files:**
- Modify: `src/lib/queries/admin.ts`

- [ ] **Step 1: Fix getUsers to handle `status === 'pending'`**

In `getUsers`, add a branch for `filters.status === 'pending'`:
```typescript
if (filters.status === 'pending') {
  query = query.eq('verification_status', 'pending')
}
```

- [ ] **Step 2: Add getProductById and getListingById helpers**

```typescript
export async function getProductById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, seller:profiles!products_seller_id_fkey(full_name, contact_email)')
    .eq('id', id)
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function getListingById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pet_listings')
    .select('*, seller:profiles!pet_listings_seller_id_fkey(full_name, contact_email)')
    .eq('id', id)
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/queries/admin.ts
git commit -m "feat(admin): fix getUsers pending filter, add getProductById and getListingById"
```

---

## Task 7: Wire Users Page with Filters, Pagination, and Actions

**Files:**
- Modify: `src/components/admin/UsersPageClient.tsx`
- Modify: `src/app/admin/users/page.tsx`

- [ ] **Step 1: Update UsersPageClient to use real filters and actions**

```typescript
'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/DataTable'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { banUser, unbanUser } from '@/lib/actions/admin'

interface UsersPageClientProps {
  initialData: Record<string, unknown>[]
  total: number
  page: number
  filters: { role?: string; status?: 'active' | 'banned' | 'pending'; search?: string }
}

export function UsersPageClient({ initialData, total, page, filters }: UsersPageClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirmBan, setConfirmBan] = useState<string | null>(null)
  const [confirmUnban, setConfirmUnban] = useState<string | null>(null)

  function updateQuery(key: string, value: string) {
    const params = new URLSearchParams(window.location.search)
    if (value) params.set(key, value)
    else params.delete(key)
    if (key !== 'page') params.delete('page') // reset to page 1 on filter change
    startTransition(() => {
      router.push(`/admin/users?${params.toString()}`)
    })
  }

  function goToPage(newPage: number) {
    const params = new URLSearchParams(window.location.search)
    params.set('page', String(newPage))
    startTransition(() => {
      router.push(`/admin/users?${params.toString()}`)
    })
  }

  async function handleBan(userId: string) {
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('reason', 'Admin action')
    await banUser(formData)
    setConfirmBan(null)
    router.refresh()
  }

  async function handleUnban(userId: string) {
    await unbanUser(userId)
    setConfirmUnban(null)
    router.refresh()
  }

  const columns = [
    { key: 'full_name', label: 'Name', sortable: true },
    { key: 'contact_email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'is_verified', label: 'Verified', sortable: true, render: (v: unknown) => <StatusBadge status={v ? 'verified' : 'unverified'} /> },
    { key: 'verification_status', label: 'Status', render: (v: unknown) => <StatusBadge status={String(v || 'pending')} /> },
    { key: 'created_at', label: 'Joined', sortable: true, render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
  ]

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      <Link href={`/admin/users/${row.id}`} className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20">View</Link>
      {row.banned_until ? (
        <button onClick={() => setConfirmUnban(row.id as string)} className="px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200">Unban</button>
      ) : (
        <button onClick={() => setConfirmBan(row.id as string)} className="px-3 py-1 rounded-lg text-xs font-medium bg-error/10 text-error hover:bg-error/20">Ban</button>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">User Management</h1>
        <p className="text-on-surface-variant">Manage all platform users, roles, and permissions</p>
      </div>

      <div className="flex gap-4 bg-surface-container-low p-4 rounded-xl">
        <select value={filters.role || ''} onChange={(e) => updateQuery('role', e.target.value)} className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <option value="">All Roles</option>
          <option value="CUSTOMER">Customer</option>
          <option value="BREEDER">Breeder</option>
          <option value="INDIVIDUAL_SELLER">Individual Seller</option>
          <option value="VET">Veterinarian</option>
          <option value="ADOPTION_PROVIDER">Adoption Provider</option>
        </select>
        <select value={filters.status || ''} onChange={(e) => updateQuery('status', e.target.value)} className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="banned">Banned</option>
        </select>
        <input type="search" placeholder="Search by name or email..." defaultValue={filters.search || ''}
          onChange={(e) => { const v = e.target.value; if (v.length > 2 || v === '') updateQuery('search', v) }}
          className="flex-1 px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20" />
      </div>

      <DataTable
        columns={columns}
        data={initialData}
        actions={actions}
        isLoading={isPending}
        pagination={{
          page,
          perPage: 25,
          total,
          onPageChange: goToPage,
        }}
      />

      <ConfirmDialog open={!!confirmBan} title="Ban User" message="Are you sure you want to ban this user?" onConfirm={() => confirmBan && handleBan(confirmBan)} onCancel={() => setConfirmBan(null)} />
      <ConfirmDialog open={!!confirmUnban} title="Unban User" message="Are you sure you want to unban this user?" variant="info" onConfirm={() => confirmUnban && handleUnban(confirmUnban)} onCancel={() => setConfirmUnban(null)} />
    </div>
  )
}
```

- [ ] **Step 2: Update users page server component to read URL params**

```typescript
// src/app/admin/users/page.tsx
import React from 'react'
import { getUsers } from '@/lib/queries/admin'
import { UsersPageClient } from '@/components/admin/UsersPageClient'

interface UsersPageProps {
  searchParams: Promise<{ role?: string; status?: string; search?: string; page?: string }>
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams
  const filters = {
    role: params.role,
    status: params.status as 'active' | 'banned' | 'pending' | undefined,
    search: params.search,
  }
  const page = Number(params.page) || 1
  const result = await getUsers(filters, { page, per_page: 25 })

  return <UsersPageClient initialData={result.data || []} total={result.total} page={page} filters={filters} />
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/UsersPageClient.tsx src/app/admin/users/page.tsx
git commit -m "feat(admin): wire Users page with real filters, search, ban/unban actions"
```

---

## Task 8: Wire Verifications Page with Approve/Reject

**Files:**
- Modify: `src/components/admin/VerificationsPageClient.tsx`
- Modify: `src/app/admin/verifications/page.tsx`

- [ ] **Step 1: Rewrite VerificationsPageClient with real actions**

```typescript
'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { handleVerification } from '@/lib/actions/admin'

interface VerificationsPageClientProps {
  data: Record<string, unknown>[]
  total: number
}

export function VerificationsPageClient({ data, total }: VerificationsPageClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirmReject, setConfirmReject] = useState<string | null>(null)
  const [approveTier, setApproveTier] = useState<{id: string; tier: string} | null>(null)

  async function doApprove(userId: string, tier: string) {
    const formData = new FormData()
    formData.append('sellerId', userId)
    formData.append('status', 'approved')
    formData.append('tier', tier)
    formData.append('notes', 'Approved by admin')
    await handleVerification(formData)
    setApproveTier(null)
    startTransition(() => router.refresh())
  }

  async function doReject(userId: string) {
    const formData = new FormData()
    formData.append('sellerId', userId)
    formData.append('status', 'rejected')
    formData.append('notes', 'Rejected by admin')
    await handleVerification(formData)
    setConfirmReject(null)
    startTransition(() => router.refresh())
  }

  const columns = [
    { key: 'full_name', label: 'Name', sortable: true },
    { key: 'contact_email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'verification_status', label: 'Status', render: (v: unknown) => <StatusBadge status={String(v || 'pending')} /> },
    { key: 'created_at', label: 'Submitted', sortable: true, render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
  ]

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      <button
        onClick={() => setApproveTier({ id: row.id as string, tier: 'Verified' })}
        className="px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200"
      >
        Approve
      </button>
      <button
        onClick={() => setConfirmReject(row.id as string)}
        className="px-3 py-1 rounded-lg text-xs font-medium bg-error/10 text-error hover:bg-error/20"
      >
        Reject
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
          Verification Queue
        </h1>
        <p className="text-on-surface-variant">Review and approve verification requests</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface-container-low p-4 rounded-xl">
          <div className="text-2xl font-bold text-on-surface">{data.length || 0}</div>
          <div className="text-sm text-on-surface-variant">Pending Reviews</div>
        </div>
        <div className="bg-surface-container-low p-4 rounded-xl">
          <div className="text-2xl font-bold text-on-surface">0</div>
          <div className="text-sm text-on-surface-variant">Approved Today</div>
        </div>
        <div className="bg-surface-container-low p-4 rounded-xl">
          <div className="text-2xl font-bold text-on-surface">0</div>
          <div className="text-sm text-on-surface-variant">Rejected Today</div>
        </div>
      </div>

      <DataTable columns={columns} data={data} actions={actions} isLoading={isPending} />

      {/* Approve Modal */}
      {approveTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setApproveTier(null)} />
          <div className="relative bg-surface-container-lowest p-6 rounded-2xl shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-on-surface mb-4">Approve Verification</h3>
            <label className="text-sm font-medium text-on-surface block mb-2">Select Tier</label>
            <select
              value={approveTier.tier}
              onChange={(e) => setApproveTier({ ...approveTier, tier: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20 mb-6"
            >
              <option value="Verified">Verified</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Shelter">Shelter</option>
            </select>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setApproveTier(null)} className="px-4 py-2 rounded-xl hover:bg-surface-container-low font-medium">Cancel</button>
              <button onClick={() => doApprove(approveTier.id, approveTier.tier)} className="px-4 py-2 rounded-xl bg-primary text-on-primary font-medium hover:opacity-90">Approve</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmReject}
        title="Reject Verification"
        message="Are you sure you want to reject this verification request?"
        variant="warning"
        onConfirm={() => confirmReject && doReject(confirmReject)}
        onCancel={() => setConfirmReject(null)}
      />
    </div>
  )
}
```

- [ ] **Step 2: Update verifications server component**

```typescript
// src/app/admin/verifications/page.tsx
import React from 'react'
import { getPendingVerifications } from '@/lib/queries/admin'
import { VerificationsPageClient } from '@/components/admin/VerificationsPageClient'

export default async function VerificationsPage() {
  const result = await getPendingVerifications()
  return <VerificationsPageClient data={result.data || []} total={result.data?.length || 0} />
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/VerificationsPageClient.tsx src/app/admin/verifications/page.tsx
git commit -m "feat(admin): wire Verifications page with approve/reject actions and tier selection"
```

---

## Acceptance Criteria for Phase 1

- [ ] All server actions in `src/lib/actions/admin.ts` compile without TypeScript errors
- [ ] Zod schemas validate all form inputs correctly
- [ ] `StatusBadge`, `FormField`, `EntityForm`, `EntityHeader` render correctly
- [ ] Users page filters, search, and ban/unban work end-to-end
- [ ] Verifications page approve/reject work end-to-end
- [ ] Audit logs are created for every admin action
- [ ] DataTable shows empty state when no data
- [ ] All commits are clean and atomic

---

## Next Phase Handoff

After Phase 1 passes acceptance:
- Phase 2: Detail/edit pages for Users, Products, Listings, Orders
- Phase 3: Service provider pages (Vets, Adoption, Providers, Bookings)
- Phase 4: Community moderation (Posts, Comments, Queue)
- Phase 5: Settings pages (Platform, Admins, Permissions, Payments)
