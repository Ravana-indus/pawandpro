# Admin CRUD — Phase 2: Marketplace Detail/Edit Pages

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Build detail/edit pages for Users, Products, Pet Listings, Orders, and Sellers. Wire list pages with real CRUD actions.

**Depends on:** Phase 1 (admin.ts actions, reusable components, DataTable enhancements)

**Tech Stack:** Next.js 15 App Router, React Server Components for data fetching, Client Components for interactivity, Supabase, Tailwind CSS

---

## New/Modified Files

```
src/
  app/admin/
    users/
      [id]/page.tsx              # NEW — User detail + edit tabs
    marketplace/
      products/
        [id]/page.tsx            # NEW — Product detail + edit
        new/page.tsx             # NEW — Create product form
      listings/
        [id]/page.tsx            # NEW — Listing detail + edit
        new/page.tsx             # NEW — Create listing form
      orders/
        [id]/page.tsx            # NEW — Order detail + status management
      sellers/
        [id]/page.tsx            # NEW — Seller detail + actions
  components/admin/
    ProductsPageClient.tsx       # MODIFIED — Wire Edit/Delete/Add buttons
    ListingsPageClient.tsx       # MODIFIED — Wire Edit/Delete/Approve/Add buttons
    OrdersPageClient.tsx         # MODIFIED — Wire View/Cancel + status filter
    SellersPageClient.tsx        # MODIFIED — Wire View/Suspend
  lib/queries/admin.ts           # MODIFIED — Add getOrderById, getSellerById
```

---

## Task 1: Add Query Helpers

**Files:**
- Modify: `src/lib/queries/admin.ts`

- [ ] **Step 1: Add getUserById, getOrderById, getSellerById**

```typescript
export async function getUserById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function getOrderById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      buyer:profiles!orders_buyer_id_fkey(full_name, contact_email),
      order_items(
        *,
        product:products(*),
        pet_listing:pet_listings(*)
      )
    `)
    .eq('id', id)
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function getSellerById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      seller_verifications(*)
    `)
    .eq('id', id)
    .eq('role', 'SELLER')
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/queries/admin.ts
git commit -m "feat(admin): add getUserById, getOrderById, getSellerById query helpers"
```

---

## Task 2: User Detail Page (`/admin/users/[id]`)

**Files:**
- Create: `src/app/admin/users/[id]/page.tsx`

- [ ] **Step 1: Create user detail page with Overview + Edit tabs**

```typescript
import React from 'react'
import { notFound } from 'next/navigation'
import { getUserById } from '@/lib/queries/admin'
import { EntityHeader } from '@/components/admin/EntityHeader'
import { EntityForm } from '@/components/admin/EntityForm'
import { FormField } from '@/components/admin/FormField'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { updateUser, banUser, unbanUser } from '@/lib/actions/admin'
import Link from 'next/link'

interface UserDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params
  const { data: user } = await getUserById(id)

  if (!user) notFound()

  const updateAction = async (formData: FormData) => {
    'use server'
    return updateUser(id, formData)
  }

  return (
    <div className="space-y-6">
      <EntityHeader
        title={user.full_name || 'Unnamed User'}
        subtitle={user.contact_email || 'No email'}
        backHref="/admin/users"
        backLabel="Back to Users"
        actions={
          <div className="flex gap-2">
            {user.banned_until ? (
              <form action={async () => { 'use server'; await unbanUser(id) }}>
                <button type="submit" className="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-medium hover:bg-green-200">
                  Unban
                </button>
              </form>
            ) : (
              <form action={async () => { 'use server'; const fd = new FormData(); fd.append('userId', id); fd.append('reason', 'Banned from detail page'); await banUser(fd) }}>
                <button type="submit" className="px-4 py-2 rounded-xl bg-error/10 text-error font-medium hover:bg-error/20">
                  Ban
                </button>
              </form>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overview Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
            <h2 className="text-lg font-bold text-on-surface mb-4">Profile Overview</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Role</span>
                <StatusBadge status={String(user.role || 'CUSTOMER')} />
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Verified</span>
                <StatusBadge status={user.is_verified ? 'verified' : 'unverified'} />
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Status</span>
                <StatusBadge status={String(user.verification_status || 'pending')} />
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Joined</span>
                <span className="text-on-surface">{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
              {user.banned_until && (
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Banned Until</span>
                  <span className="text-error">{new Date(user.banned_until).toLocaleDateString()}</span>
                </div>
              )}
              {user.phone && (
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Phone</span>
                  <span className="text-on-surface">{user.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
            <h2 className="text-lg font-bold text-on-surface mb-4">Edit User</h2>
            <EntityForm action={updateAction}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Full Name" name="full_name" defaultValue={user.full_name} required />
                <FormField label="Email" name="contact_email" type="email" defaultValue={user.contact_email} required />
                <FormField label="Phone" name="phone" defaultValue={user.phone} />
                <FormField
                  label="Role"
                  name="role"
                  type="select"
                  defaultValue={user.role}
                  options={[
                    { value: 'CUSTOMER', label: 'Customer' },
                    { value: 'BREEDER', label: 'Breeder' },
                    { value: 'INDIVIDUAL_SELLER', label: 'Individual Seller' },
                    { value: 'VET', label: 'Veterinarian' },
                    { value: 'ADOPTION_PROVIDER', label: 'Adoption Provider' },
                    { value: 'GROOMER', label: 'Groomer' },
                    { value: 'PET_TRAINER', label: 'Pet Trainer' },
                    { value: 'TRANSPORTER', label: 'Transporter' },
                    { value: 'ADMIN', label: 'Admin' },
                    { value: 'SUPER_ADMIN', label: 'Super Admin' },
                    { value: 'MARKETPLACE_STAFF', label: 'Marketplace Staff' },
                  ]}
                />
                <FormField
                  label="Verified"
                  name="is_verified"
                  type="select"
                  defaultValue={user.is_verified ? 'true' : 'false'}
                  options={[{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }]}
                />
              </div>
            </EntityForm>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/users/[id]/page.tsx
git commit -m "feat(admin): add user detail page with overview and edit form"
```

---

## Task 3: Product Detail + Create Pages

**Files:**
- Create: `src/app/admin/marketplace/products/[id]/page.tsx`
- Create: `src/app/admin/marketplace/products/new/page.tsx`
- Modify: `src/components/admin/ProductsPageClient.tsx`

- [ ] **Step 1: Create product detail/edit page**

```typescript
import React from 'react'
import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/queries/admin'
import { updateProduct, deleteProduct } from '@/lib/actions/admin'
import { EntityHeader } from '@/components/admin/EntityHeader'
import { EntityForm } from '@/components/admin/EntityForm'
import { FormField } from '@/components/admin/FormField'
import Link from 'next/link'

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  const { data: product } = await getProductById(id)

  if (!product) notFound()

  const updateAction = async (formData: FormData) => {
    'use server'
    return updateProduct(id, formData)
  }

  const deleteAction = async () => {
    'use server'
    return deleteProduct(id)
  }

  return (
    <div className="space-y-6">
      <EntityHeader
        title={product.name}
        subtitle={`${product.brand || 'No brand'} — $${Number(product.price).toFixed(2)}`}
        backHref="/admin/marketplace/products"
        backLabel="Back to Products"
        actions={
          <form action={deleteAction}>
            <button type="submit" className="px-4 py-2 rounded-xl bg-error/10 text-error font-medium hover:bg-error/20">
              Delete
            </button>
          </form>
        }
      />

      <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 max-w-2xl">
        <h2 className="text-lg font-bold text-on-surface mb-4">Edit Product</h2>
        <EntityForm action={updateAction}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Name" name="name" defaultValue={product.name} required />
            <FormField label="Brand" name="brand" defaultValue={product.brand} />
            <FormField label="Category" name="category" defaultValue={product.category} />
            <FormField label="Price" name="price" type="number" defaultValue={product.price} required />
            <FormField label="Stock Quantity" name="stock_quantity" type="number" defaultValue={product.stock_quantity} required />
          </div>
        </EntityForm>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create product create page**

```typescript
import React from 'react'
import { createProduct } from '@/lib/actions/admin'
import { EntityHeader } from '@/components/admin/EntityHeader'
import { EntityForm } from '@/components/admin/EntityForm'
import { FormField } from '@/components/admin/FormField'

export default function CreateProductPage() {
  return (
    <div className="space-y-6">
      <EntityHeader
        title="Create Product"
        subtitle="Add a new product to the marketplace"
        backHref="/admin/marketplace/products"
        backLabel="Back to Products"
      />

      <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 max-w-2xl">
        <EntityForm action={createProduct}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Name" name="name" required />
            <FormField label="Brand" name="brand" />
            <FormField label="Category" name="category" />
            <FormField label="Price" name="price" type="number" required />
            <FormField label="Stock Quantity" name="stock_quantity" type="number" defaultValue={0} required />
          </div>
        </EntityForm>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Update ProductsPageClient with real actions and Add button**

Replace the `actions` render in `ProductsPageClient.tsx`:
```typescript
const actions = (row: Record<string, unknown>) => (
  <div className="flex gap-2 justify-end">
    <Link href={`/admin/marketplace/products/${row.id}`} className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20">
      Edit
    </Link>
    <form action={async () => { 'use server'; await deleteProduct(row.id as string) }}>
      <button type="submit" className="px-3 py-1 rounded-lg text-xs font-medium bg-error/10 text-error hover:bg-error/20">
        Delete
      </button>
    </form>
  </div>
)
```

Add an "Add Product" button before the DataTable:
```typescript
<div className="flex justify-between items-center">
  <div />
  <Link href="/admin/marketplace/products/new" className="px-4 py-2 rounded-xl bg-primary text-on-primary font-medium hover:opacity-90 flex items-center gap-2">
    <span className="material-symbols-outlined text-sm">add</span>
    Add Product
  </Link>
</div>
```

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/marketplace/products/ src/components/admin/ProductsPageClient.tsx
git commit -m "feat(admin): add product detail, create, and wired list page"
```

---

## Task 4: Listing Detail + Create Pages

**Files:**
- Create: `src/app/admin/marketplace/listings/[id]/page.tsx`
- Create: `src/app/admin/marketplace/listings/new/page.tsx`
- Modify: `src/components/admin/ListingsPageClient.tsx`

Follow the same pattern as Task 3 (Product), using `getListingById`, `updateListing`, `deleteListing`, `createListing`.

Form fields for listings: name, species (select), breed, sex (select), age, price, type (select), status (select), certification_tier (select), image_url.

- [ ] **Step 1: Create listing detail/edit page**
- [ ] **Step 2: Create listing create page**
- [ ] **Step 3: Update ListingsPageClient with real actions + Add button**
- [ ] **Step 4: Commit**

```bash
git add src/app/admin/marketplace/listings/ src/components/admin/ListingsPageClient.tsx
git commit -m "feat(admin): add listing detail, create, and wired list page"
```

---

## Task 5: Order Detail Page

**Files:**
- Create: `src/app/admin/marketplace/orders/[id]/page.tsx`
- Modify: `src/components/admin/OrdersPageClient.tsx`

- [ ] **Step 1: Create order detail page**

```typescript
import React from 'react'
import { notFound } from 'next/navigation'
import { getOrderById } from '@/lib/queries/admin'
import { updateOrderStatus, cancelOrder } from '@/lib/actions/admin'
import { EntityHeader } from '@/components/admin/EntityHeader'
import { StatusBadge } from '@/components/admin/StatusBadge'
import Link from 'next/link'

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const { data: order } = await getOrderById(id)

  if (!order) notFound()

  const items = (order.order_items || []) as Record<string, unknown>[]

  return (
    <div className="space-y-6">
      <EntityHeader
        title={`Order #${String(order.id).slice(0, 8)}`}
        subtitle={`Buyer: ${(order.buyer as {full_name?: string})?.full_name || 'N/A'}`}
        backHref="/admin/marketplace/orders"
        backLabel="Back to Orders"
        actions={
          <div className="flex gap-2">
            <form action={async () => { 'use server'; await cancelOrder(id) }}>
              <button type="submit" className="px-4 py-2 rounded-xl bg-error/10 text-error font-medium hover:bg-error/20">
                Cancel Order
              </button>
            </form>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
            <h2 className="text-lg font-bold text-on-surface mb-4">Order Info</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Status</span>
                <StatusBadge status={String(order.status)} />
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Total</span>
                <span className="text-on-surface font-bold">${Number(order.total_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Date</span>
                <span className="text-on-surface">{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <h3 className="text-sm font-bold text-on-surface mt-6 mb-3">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {(['Processing', 'In Transit', 'Delivered', 'Cancelled'] as const).map((status) => (
                <form key={status} action={async () => { 'use server'; await updateOrderStatus(id, status) }}>
                  <button
                    type="submit"
                    disabled={order.status === status}
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      order.status === status
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
            <h2 className="text-lg font-bold text-on-surface mb-4">Order Items ({items.length})</h2>
            {items.length === 0 ? (
              <p className="text-on-surface-variant text-sm">No items in this order.</p>
            ) : (
              <div className="space-y-3">
                {items.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg">
                    <div>
                      <div className="font-medium text-on-surface">
                        {item.product?.name || item.pet_listing?.name || 'Unknown Item'}
                      </div>
                      <div className="text-sm text-on-surface-variant">
                        Qty: {item.quantity} × ${Number(item.price_at_purchase).toFixed(2)}
                      </div>
                    </div>
                    <div className="font-bold text-on-surface">
                      ${(item.quantity * Number(item.price_at_purchase)).toFixed(2)}
                    </div>
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

- [ ] **Step 2: Update OrdersPageClient with View links and status filter**

Replace `actions` with links to detail page. Add a status filter dropdown above the table.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/marketplace/orders/[id]/page.tsx src/components/admin/OrdersPageClient.tsx
git commit -m "feat(admin): add order detail page with status management"
```

---

## Task 6: Seller Detail Page

**Files:**
- Create: `src/app/admin/marketplace/sellers/[id]/page.tsx`
- Modify: `src/components/admin/SellersPageClient.tsx`

- [ ] **Step 1: Create seller detail page**

Show seller profile info + verification details + quick action to suspend.

- [ ] **Step 2: Update SellersPageClient with View links**

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/marketplace/sellers/[id]/page.tsx src/components/admin/SellersPageClient.tsx
git commit -m "feat(admin): add seller detail page"
```

---

## Acceptance Criteria

- [ ] `/admin/users/[id]` shows user overview + editable form, ban/unban works
- [ ] `/admin/marketplace/products/[id]` shows product edit form, delete works
- [ ] `/admin/marketplace/products/new` creates a new product
- [ ] `/admin/marketplace/listings/[id]` shows listing edit form, delete works
- [ ] `/admin/marketplace/listings/new` creates a new listing
- [ ] `/admin/marketplace/orders/[id]` shows order items + status update buttons
- [ ] `/admin/marketplace/sellers/[id]` shows seller profile + verification info
- [ ] All list pages have working Edit/View/Delete/Add buttons
- [ ] Audit logs created for all mutations
