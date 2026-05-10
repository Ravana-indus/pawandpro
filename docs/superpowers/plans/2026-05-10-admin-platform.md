# Admin Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stabilize and rebuild the `/admin` platform into a scalable operational console for marketplace, services, users, moderation, settings, and audit workflows.

**Architecture:** First fix broken schema/code drift, permissions, audit logging, and verification tooling. Then introduce shared admin query/action/UI primitives and migrate high-volume pages domain by domain. Keep mutations typed, permission-gated, reason-captured where sensitive, and audit-logged.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Supabase SSR client, Supabase Postgres/RLS, Zod, Tailwind CSS, npm scripts.

## Execution Status

Status as of `2026-05-10`:

- Completed: Task 1 `Repair Project Verification Tooling`
  Commits: `d057c918`, `70161312`
- Completed: Task 2 `Add Central Admin Types, Pagination, And Action Results`
  Commits: `e358d7f0`, `7048a347`
- Completed: Task 3 `Centralize Admin Permissions`
  Commit: `9bcd693c`
- Completed: Task 4 `Write Admin Audits To audit_logs`
  Commit: `a4331517`
- Completed: Task 5 `Add Supabase Stabilization Migration`
  Commit: `e6e74a9`
  Note: validated against remote Supabase project `almhrslpupbhbpdostay` via the Supabase plugin instead of local Docker reset because local Docker was unavailable.
- Completed: Task 6 `Fix Listing Table Drift And Safe Listing Mutations`
  Commits: `5a643f1`, `bf420d0`, `84c4517`
  Note: the initial implementation passed spec review, then required two follow-up fixes during code-quality review for legacy delete-call compatibility and stale delete-error UI state.
- Completed: Task 7 `Add Marketplace Query Layer And Paginated List Pages`
  Commits: `1dc45e3`, `40c7ab7`, `46d6d2e`
  Note: the initial implementation required a spec fix for the shared filter/table contracts and a final type-fix for the `AdminDataTable` pagination prop.
- Completed: Task 8 `Upgrade Marketplace Detail Pages And Status Workflows`
  Commits: `eb24a3b`, `122afa0`
  Note: the review pass removed an unsafe dependency on `orders.updated_at` before the remote migration is applied and reverted listing image rendering to plain `<img>` to avoid external host breakage.
- In progress: Task 9 `Add Services Query And Mutation Layer`
  Note: implementation is currently dispatched and pending review.

Execution notes:

- `npm run lint` is usable, but repository-wide lint debt still exists outside the completed task scopes.
- `supabase/.temp/cli-latest` is a local CLI artifact and is intentionally excluded from implementation commits.

---

## Source Spec

- Spec: `docs/superpowers/specs/2026-05-10-admin-platform-design.md`

## File Structure

Create or modify these files across the plan:

- Modify: `package.json` - add working `typecheck`, `test`, and lint scripts.
- Modify: `package-lock.json` - update if new verification dependencies are installed.
- Create: `vitest.config.ts` - minimal test configuration for admin library tests.
- Create: `src/lib/admin/types.ts` - shared admin result, pagination, sort, permission, and audit types.
- Create: `src/lib/admin/permissions.ts` - centralized permission helper used by pages/actions.
- Create: `src/lib/admin/audit.ts` - audit writer for `audit_logs`.
- Create: `src/lib/admin/pagination.ts` - safe query param parsing and range helpers.
- Create: `src/lib/admin/query-builders.ts` - common search/sort/pagination helpers.
- Create: `src/lib/admin/actions.ts` - shared action result helpers.
- Create: `src/lib/admin/queries/marketplace.ts` - marketplace list/detail query functions.
- Create: `src/lib/admin/queries/services.ts` - service list/detail query functions.
- Create: `src/lib/admin/queries/trust-safety.ts` - users, verifications, moderation query functions.
- Create: `src/lib/admin/mutations/marketplace.ts` - marketplace workflow mutations.
- Create: `src/lib/admin/mutations/services.ts` - service workflow mutations.
- Create: `src/lib/admin/mutations/trust-safety.ts` - user/moderation/verification workflow mutations.
- Modify: `src/lib/actions/admin.ts` - either reduce to compatibility wrappers or migrate call sites to new mutation modules.
- Modify: `src/lib/queries/admin.ts` - either reduce to compatibility wrappers or migrate call sites to new query modules.
- Modify: `src/lib/schemas/admin.ts` - add reason schemas, status-transition schemas, and safe metadata schemas.
- Create: `src/components/admin/AdminDataTable.tsx` - server-driven admin table wrapper.
- Create: `src/components/admin/AdminFilterBar.tsx` - URL-driven search/filter form.
- Create: `src/components/admin/AdminPagination.tsx` - pagination controls.
- Create: `src/components/admin/ActionReasonDialog.tsx` - confirmation plus reason capture.
- Create: `src/components/admin/AuditTimeline.tsx` - display `audit_logs` entries for a target.
- Create: `src/components/admin/DetailSection.tsx` - reusable detail layout section.
- Modify: `src/components/DataTable.tsx` - either keep as generic display table or adapt through `AdminDataTable`.
- Modify: `src/app/admin/layout.tsx` - use centralized permission entry checks.
- Modify: high-volume admin pages under `src/app/admin/**` - migrate to shared query/action primitives in phases.
- Create: `supabase/migrations/<generated>_admin_platform_stabilization.sql` - generated with `supabase migration new admin_platform_stabilization`.
- Create: tests under `src/lib/admin/**/*.test.ts` or `tests/admin/**/*.test.ts` depending on test runner setup.

Use `supabase migration new admin_platform_stabilization` to create the actual migration filename. Do not invent the timestamped migration name during implementation.

---

## Task 1: Repair Project Verification Tooling

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `vitest.config.ts`
- Optional create: `eslint.config.mjs` only if `eslint-config-next` requires explicit flat config in this project.

- [ ] **Step 1: Inspect current scripts and Next lint support**

Run:

```bash
npm run
npx next --help
```

Expected: `lint` currently maps to `next lint`, which fails on Next 16. There is no `test` script.

- [ ] **Step 2: Install test runner**

Run:

```bash
npm install -D vitest
```

Expected: `package.json` and `package-lock.json` include Vitest.

- [ ] **Step 3: Add Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
  },
})
```

- [ ] **Step 4: Update scripts**

Modify `package.json` scripts to:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  }
}
```

- [ ] **Step 5: Verify typecheck runs**

Run:

```bash
npm run typecheck
```

Expected: TypeScript runs. Existing type errors are allowed only if recorded and addressed by later tasks; do not hide them with broad `any`.

- [ ] **Step 6: Verify lint runs**

Run:

```bash
npm run lint
```

Expected: ESLint runs. If config is missing, add the minimal Next-compatible ESLint flat config and rerun.

- [ ] **Step 7: Verify test runner runs**

Run:

```bash
npm run test
```

Expected: Vitest runs. It may report no test files until Task 2 creates the first tests.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git add eslint.config.mjs # only if created
git commit -m "chore: repair admin verification scripts"
```

---

## Task 2: Add Central Admin Types, Pagination, And Action Results

**Files:**
- Create: `src/lib/admin/types.ts`
- Create: `src/lib/admin/pagination.ts`
- Create: `src/lib/admin/actions.ts`
- Test: `src/lib/admin/pagination.test.ts`
- Test: `src/lib/admin/actions.test.ts`

- [ ] **Step 1: Write pagination tests**

Create tests covering invalid page/perPage, max per-page clamping, range math, and sort whitelisting.

Example assertions:

```ts
expect(parseAdminPagination({ page: "2", perPage: "25" })).toEqual({
  page: 2,
  perPage: 25,
  from: 25,
  to: 49,
})

expect(parseAdminPagination({ page: "-1", perPage: "999" })).toMatchObject({
  page: 1,
  perPage: 100,
  from: 0,
  to: 99,
})
```

- [ ] **Step 2: Run tests and confirm failure**

Run:

```bash
npm run test -- src/lib/admin/pagination.test.ts src/lib/admin/actions.test.ts
```

Expected: fails because helpers do not exist.

- [ ] **Step 3: Implement shared types**

In `src/lib/admin/types.ts`, define:

```ts
export type AdminPermission =
  | "manage_users"
  | "manage_marketplace"
  | "manage_orders"
  | "verify_sellers"
  | "manage_services"
  | "manage_vets"
  | "manage_adoption"
  | "moderate_content"
  | "view_analytics"
  | "manage_payments"
  | "audit_logs"
  | "manage_admins"
  | "manage_platform_settings"

export type AdminActionResult<T = unknown> =
  | { success: true; data?: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

export interface AdminListResult<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface AdminPaginationInput {
  page?: string | number
  perPage?: string | number
}
```

- [ ] **Step 4: Implement pagination helpers**

In `src/lib/admin/pagination.ts`, implement:

```ts
const DEFAULT_PER_PAGE = 25
const MAX_PER_PAGE = 100

export function parseAdminPagination(input: AdminPaginationInput = {}) {
  const page = Math.max(1, Number(input.page) || 1)
  const requestedPerPage = Number(input.perPage) || DEFAULT_PER_PAGE
  const perPage = Math.min(MAX_PER_PAGE, Math.max(1, requestedPerPage))
  const from = (page - 1) * perPage
  const to = from + perPage - 1
  return { page, perPage, from, to }
}

export function totalPages(total: number, perPage: number) {
  return Math.max(1, Math.ceil(total / perPage))
}
```

- [ ] **Step 5: Implement action helpers**

In `src/lib/admin/actions.ts`, implement:

```ts
export function ok<T>(data?: T): AdminActionResult<T> {
  return data === undefined ? { success: true } : { success: true, data }
}

export function fail(error: string, fieldErrors?: Record<string, string[]>): AdminActionResult<never> {
  return { success: false, error, fieldErrors }
}
```

- [ ] **Step 6: Run tests and typecheck**

Run:

```bash
npm run test -- src/lib/admin/pagination.test.ts src/lib/admin/actions.test.ts
npm run typecheck
npm run lint
```

Expected: pass for new files.

- [ ] **Step 7: Commit**

```bash
git add src/lib/admin package.json
git commit -m "feat: add admin foundation utilities"
```

---

## Task 3: Centralize Admin Permissions

**Files:**
- Create: `src/lib/admin/permissions.ts`
- Modify: `src/app/admin/layout.tsx`
- Modify: `src/lib/actions/admin.ts`
- Test: `src/lib/admin/permissions.test.ts`

- [ ] **Step 1: Write permission tests**

Cover:

- `SUPER_ADMIN` has all permissions.
- `ADMIN` has operational permissions but not necessarily `manage_admins` if policy requires super admin.
- `MARKETPLACE_STAFF` needs explicit JSON permission.
- Missing profile denies access.

- [ ] **Step 2: Implement permission helpers**

Create `src/lib/admin/permissions.ts` with helpers shaped like:

```ts
export function profileHasAdminPermission(
  profile: { role: string | null; admin_permissions?: Record<string, unknown> | null } | null,
  permission: AdminPermission
) {
  if (!profile?.role) return false
  if (profile.role === "SUPER_ADMIN") return true
  if (profile.role === "ADMIN") return permission !== "manage_admins"
  if (profile.role === "MARKETPLACE_STAFF") {
    return profile.admin_permissions?.[permission] === true
  }
  return false
}
```

Also implement `requireAdminPermission(permission)` using `createClient()`, `supabase.auth.getUser()`, and a profile lookup.

- [ ] **Step 3: Update admin layout**

Replace hard-coded role logic in `src/app/admin/layout.tsx` with a helper that grants entry if the profile has any admin permission or role is `SUPER_ADMIN`/`ADMIN`.

- [ ] **Step 4: Update legacy admin action guard**

Change `requireAdmin(action)` in `src/lib/actions/admin.ts` to delegate to the new helper. Keep action-specific permissions coarse initially, then make each mutation specific in later tasks.

- [ ] **Step 5: Run verification**

Run:

```bash
npm run typecheck
npm run lint
```

Expected: no new type or lint errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/admin/permissions.ts src/app/admin/layout.tsx src/lib/actions/admin.ts
git commit -m "feat: centralize admin permissions"
```

---

## Task 4: Fix Audit Logging Foundation

**Files:**
- Create: `src/lib/admin/audit.ts`
- Modify: `src/lib/actions/admin.ts`
- Modify: `src/components/admin/AuditLogsPageClient.tsx` only if target type labels need table-name correction.
- Test: `src/lib/admin/audit.test.ts`

- [ ] **Step 1: Write audit payload tests**

Test that `writeAdminAuditLog` inserts into `audit_logs`, includes `actor_id`, preserves `reason`, and stores `before`/`after` inside `details`.

- [ ] **Step 2: Implement audit writer**

Create:

```ts
export interface AdminAuditInput {
  actorId: string
  action: string
  targetType: string
  targetId: string
  reason?: string
  before?: unknown
  after?: unknown
  metadata?: Record<string, unknown>
}
```

Implement `writeAdminAuditLog(supabase, input)` to insert:

```ts
{
  actor_id: input.actorId,
  action: input.action,
  target_type: input.targetType,
  target_id: input.targetId,
  details: {
    reason: input.reason ?? null,
    before: input.before ?? null,
    after: input.after ?? null,
    source: "admin",
    ...(input.metadata ?? {}),
  },
}
```

- [ ] **Step 3: Replace legacy audit helper**

Update `src/lib/actions/admin.ts` `logAudit()` so it writes to `audit_logs`, not `audit_log`, and includes actor id. If an action still lacks actor id, change the calling action to use the actor id returned by permission helper.

- [ ] **Step 4: Run verification**

Run:

```bash
npm run typecheck
npm run lint
```

Expected: no audit table-name drift remains.

- [ ] **Step 5: Commit**

```bash
git add src/lib/admin/audit.ts src/lib/actions/admin.ts src/components/admin/AuditLogsPageClient.tsx
git commit -m "fix: write admin audits to audit_logs"
```

---

## Task 5: Add Supabase Stabilization Migration

**Files:**
- Create: generated migration under `supabase/migrations/`
- Modify: `src/types/supabase.ts` only after regenerating types if that workflow is available.

- [ ] **Step 1: Create migration with Supabase CLI**

Run:

```bash
supabase migration new admin_platform_stabilization
```

Expected: a timestamped SQL migration file is created.

- [ ] **Step 2: Add schema fixes**

In the generated migration, add:

```sql
alter table public.orders
  add column if not exists updated_at timestamptz default now();

alter table public.service_bookings
  add column if not exists updated_at timestamptz default now();

create index if not exists idx_orders_buyer_id on public.orders (buyer_id);
create index if not exists idx_orders_status_created_at on public.orders (status, created_at desc);
create index if not exists idx_order_items_order_id on public.order_items (order_id);
create index if not exists idx_order_items_product_id on public.order_items (product_id);
create index if not exists idx_order_items_pet_listing_id on public.order_items (pet_listing_id);
create index if not exists idx_products_seller_id on public.products (seller_id);
create index if not exists idx_pet_listings_seller_id on public.pet_listings (seller_id);
create index if not exists idx_pet_listings_status_created_at on public.pet_listings (status, created_at desc);
create index if not exists idx_service_bookings_provider_id on public.service_bookings (provider_id);
create index if not exists idx_service_bookings_customer_id on public.service_bookings (customer_id);
create index if not exists idx_service_bookings_pet_id on public.service_bookings (pet_id);
create index if not exists idx_service_bookings_status_scheduled_at on public.service_bookings (status, scheduled_at desc);
create index if not exists idx_audit_logs_actor_id on public.audit_logs (actor_id);
create index if not exists idx_audit_logs_target on public.audit_logs (target_type, target_id, created_at desc);
create index if not exists idx_moderation_queue_status_created_at on public.moderation_queue (status, created_at desc);
```

If `appointments.updated_at` is still required by legacy pages, either add it too or remove app writes in Task 8. Prefer migrating active admin workflows to `service_bookings`.

- [ ] **Step 3: Add function security hardening**

For known functions, set `search_path` explicitly and revoke public execution where appropriate. Use current function signatures from Supabase before writing final SQL.

Example pattern:

```sql
alter function public.handle_new_user() set search_path = public, auth;
revoke execute on function public.handle_new_user() from anon, authenticated;
```

Do not revoke functions that are intentionally called by public app flows without confirming call sites.

- [ ] **Step 4: Apply locally or to development database**

Run appropriate Supabase command for the environment:

```bash
supabase db reset
```

or use the connected development branch workflow if local DB is unavailable.

- [ ] **Step 5: Run advisors**

Run:

```bash
supabase db advisors
```

If CLI version does not support advisors, use Supabase MCP `get_advisors` for security and performance.

Expected: targeted FK index warnings are resolved or explicitly documented.

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations src/types/supabase.ts
git commit -m "fix: stabilize admin database schema"
```

---

## Task 6: Fix Listing Table Drift And Safe Listing Mutations

**Files:**
- Create: `src/lib/admin/mutations/marketplace.ts`
- Modify: `src/lib/actions/admin.ts`
- Modify: `src/lib/schemas/admin.ts`
- Modify: `src/app/admin/marketplace/listings/[id]/DeleteButton.tsx`
- Modify: `src/app/admin/marketplace/listings/[id]/edit/ListingEditForm.tsx`
- Test: `src/lib/admin/mutations/marketplace.test.ts`

- [ ] **Step 1: Write mutation tests**

Test:

- `updateAdminListingMetadata` writes to `pet_listings`.
- `deleteAdminListing` requires `reason`.
- Both write audit entries with target type `pet_listings`.
- Empty optional fields can be cleared intentionally instead of silently ignored.

- [ ] **Step 2: Add schemas**

In `src/lib/schemas/admin.ts`, add:

```ts
export const reasonSchema = z.string().min(3).max(500)

export const listingMetadataSchema = z.object({
  name: z.string().min(1),
  species: z.enum(["Dog", "Cat", "Bird", "Fish", "Small Pet", "Reptile"]),
  breed: z.string().nullable().optional(),
  sex: z.enum(["Male", "Female"]).nullable().optional(),
  age: z.string().nullable().optional(),
  price: z.number().positive(),
  type: z.enum(["Buy", "Adopt", "Rehome"]),
  status: z.enum(["Available", "Pending", "Sold"]).optional(),
  certification_tier: z.enum(["Gold", "Silver", "Verified", "Shelter"]).nullable().optional(),
  image_url: z.string().url().nullable().optional(),
})
```

- [ ] **Step 3: Implement marketplace mutations**

In `src/lib/admin/mutations/marketplace.ts`, implement:

- `updateAdminListingMetadata(id, formData)`
- `deleteAdminListing(id, reason)`
- compatibility exports if needed by existing components.

Use `requireAdminPermission("manage_marketplace")`, fetch current listing before mutation, update/delete `pet_listings`, then call `writeAdminAuditLog`.

- [ ] **Step 4: Update call sites**

Replace legacy `deleteListing` and `updateListing` usage in listing pages/components with the new functions or update wrappers to delegate safely.

- [ ] **Step 5: Verify no `listings` table references remain in admin mutations**

Run:

```bash
rg -n "from as any\\)\\('listings'|from\\('listings'|target_type.*listings|logAudit\\('.*listing" src/lib src/app/admin
```

Expected: no admin write path targets `listings`; target type should be `pet_listings`.

- [ ] **Step 6: Run verification**

Run:

```bash
npm run typecheck
npm run lint
npm run build
```

Expected: build may require network access for Google fonts; if blocked, record that separately and still require typecheck/lint to pass.

- [ ] **Step 7: Commit**

```bash
git add src/lib/admin/mutations/marketplace.ts src/lib/actions/admin.ts src/lib/schemas/admin.ts src/app/admin/marketplace/listings
git commit -m "fix: stabilize admin listing mutations"
```

---

## Task 7: Add Marketplace Query Layer And Paginated List Pages

**Files:**
- Create: `src/lib/admin/queries/marketplace.ts`
- Create: `src/components/admin/AdminPagination.tsx`
- Create: `src/components/admin/AdminFilterBar.tsx`
- Create: `src/components/admin/AdminDataTable.tsx`
- Modify: `src/app/admin/marketplace/listings/page.tsx`
- Modify: `src/app/admin/marketplace/products/page.tsx`
- Modify: `src/app/admin/marketplace/orders/page.tsx`
- Modify: `src/components/admin/ListingsPageClient.tsx`
- Modify: `src/components/admin/ProductsPageClient.tsx`
- Modify: `src/components/admin/OrdersPageClient.tsx`
- Test: `src/lib/admin/queries/marketplace.test.ts`

- [ ] **Step 1: Write query tests**

Test query option parsing for listings/products/orders:

- `page`, `perPage`, `search`, `status`, `sort`, `direction`.
- Unknown sort falls back to safe default.
- Results include `totalPages`.

- [ ] **Step 2: Implement query functions**

In `src/lib/admin/queries/marketplace.ts`, implement:

- `listAdminListings(options)`
- `getAdminListingDetail(id)`
- `listAdminProducts(options)`
- `getAdminProductDetail(id)`
- `listAdminOrders(options)`
- `getAdminOrderDetail(id)`

Use `select(..., { count: "exact" })`, `.range(from, to)`, and whitelisted `.order(...)`.

- [ ] **Step 3: Build reusable pagination/filter UI**

Create:

- `AdminPagination` for page links.
- `AdminFilterBar` for GET-form URL filters.
- `AdminDataTable` as a thin wrapper around existing `DataTable` that receives pagination metadata.

- [ ] **Step 4: Migrate list pages**

Update listings/products/orders pages to read `searchParams`, call the new query functions, and remove fixed `.limit(50)`.

- [ ] **Step 5: Run verification**

Run:

```bash
rg -n "\\.limit\\(50\\)" src/app/admin/marketplace src/components/admin
npm run typecheck
npm run lint
```

Expected: no marketplace list page relies on `.limit(50)`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/admin/queries/marketplace.ts src/components/admin/AdminPagination.tsx src/components/admin/AdminFilterBar.tsx src/components/admin/AdminDataTable.tsx src/app/admin/marketplace src/components/admin/*PageClient.tsx
git commit -m "feat: add paginated marketplace admin lists"
```

---

## Task 8: Upgrade Marketplace Detail Pages And Status Workflows

**Files:**
- Create: `src/components/admin/ActionReasonDialog.tsx`
- Create: `src/components/admin/AuditTimeline.tsx`
- Create: `src/components/admin/DetailSection.tsx`
- Modify: `src/app/admin/marketplace/listings/[id]/page.tsx`
- Modify: `src/app/admin/marketplace/orders/[id]/page.tsx`
- Modify: `src/app/admin/marketplace/products/[id]/page.tsx`
- Modify: `src/lib/admin/mutations/marketplace.ts`
- Test: marketplace mutation tests.

- [ ] **Step 1: Write workflow tests**

Cover:

- Order status transition validates status.
- Order status transition writes `orders.updated_at` only after migration.
- Order status transition writes audit with reason.
- Listing delete and status/certification changes require reason.

- [ ] **Step 2: Implement shared detail components**

Create:

- `DetailSection` for title plus content.
- `AuditTimeline` querying/displaying `audit_logs` by `target_type` and `target_id`.
- `ActionReasonDialog` with confirm label, destructive variant, textarea reason, and pending state.

- [ ] **Step 3: Implement marketplace workflow mutations**

Add:

- `transitionAdminOrderStatus(orderId, status, reason)`
- `transitionAdminListingStatus(listingId, status, reason)`
- `updateAdminListingCertification(listingId, tier, reason)`

- [ ] **Step 4: Fix invalid client/server action pattern in order detail**

Replace the current nested `"use client"`/`"use server"` function pattern in `src/app/admin/marketplace/orders/[id]/page.tsx` with a proper client component or server action form.

- [ ] **Step 5: Upgrade detail pages**

Add related context:

- Order items with linked product/listing names.
- Buyer contact.
- Audit timeline.
- Valid action panel.
- Listing seller context and order history.
- Product seller context and order history.

- [ ] **Step 6: Run verification**

Run:

```bash
npm run typecheck
npm run lint
```

Expected: marketplace detail pages typecheck and no invalid server/client action pattern remains.

- [ ] **Step 7: Commit**

```bash
git add src/components/admin/ActionReasonDialog.tsx src/components/admin/AuditTimeline.tsx src/components/admin/DetailSection.tsx src/app/admin/marketplace src/lib/admin/mutations/marketplace.ts
git commit -m "feat: upgrade marketplace admin workflows"
```

---

## Task 9: Add Services Query And Mutation Layer

**Files:**
- Create: `src/lib/admin/queries/services.ts`
- Create: `src/lib/admin/mutations/services.ts`
- Modify: `src/app/admin/services/bookings/page.tsx`
- Modify: `src/app/admin/services/bookings/[id]/page.tsx`
- Modify: `src/app/admin/services/providers/page.tsx`
- Modify: `src/app/admin/services/providers/[id]/page.tsx`
- Modify: `src/app/admin/services/vets/page.tsx`
- Modify: `src/app/admin/services/adoption/page.tsx`
- Modify: `src/components/admin/BookingsPageClient.tsx`
- Modify: `src/components/admin/ProvidersPageClient.tsx`
- Modify: `src/components/admin/VetsPageClient.tsx`
- Modify: `src/components/admin/AdoptionPageClient.tsx`
- Test: `src/lib/admin/queries/services.test.ts`
- Test: `src/lib/admin/mutations/services.test.ts`

- [ ] **Step 1: Write services query tests**

Cover pagination/filter/sort for:

- `service_bookings`
- `service_provider_details`
- `hospitals`
- `adoption_centers`

- [ ] **Step 2: Implement service queries**

Implement:

- `listAdminBookings(options)`
- `getAdminBookingDetail(id)`
- `listAdminProviders(options)`
- `getAdminProviderDetail(id)`
- `listAdminHospitals(options)`
- `getAdminHospitalDetail(id)`
- `listAdminAdoptionCenters(options)`
- `getAdminAdoptionCenterDetail(id)`

- [ ] **Step 3: Write service mutation tests**

Cover:

- Booking cancellation requires reason and writes audit.
- Provider verification changes require reason and write audit.
- Hospital/adoption center edits write audit.

- [ ] **Step 4: Implement services mutations**

Implement:

- `cancelAdminBooking(id, reason)`
- `updateAdminProviderVerification(id, isVerified, reason)`
- `updateAdminHospitalMetadata(id, formData)`
- `updateAdminAdoptionCenterMetadata(id, formData)`

Use `manage_services`, `manage_vets`, or `manage_adoption` permissions as appropriate.

- [ ] **Step 5: Migrate services pages**

Remove fixed `.limit(50)` usage, add URL-driven filters and pagination, and add audit timelines on detail pages.

- [ ] **Step 6: Run verification**

Run:

```bash
rg -n "\\.limit\\(50\\)" src/app/admin/services src/components/admin
npm run typecheck
npm run lint
```

Expected: no services list page relies on `.limit(50)`.

- [ ] **Step 7: Commit**

```bash
git add src/lib/admin/queries/services.ts src/lib/admin/mutations/services.ts src/app/admin/services src/components/admin
git commit -m "feat: upgrade services admin workflows"
```

---

## Task 10: Add Trust And Safety Query And Mutation Layer

**Files:**
- Create: `src/lib/admin/queries/trust-safety.ts`
- Create: `src/lib/admin/mutations/trust-safety.ts`
- Modify: `src/app/admin/users/page.tsx`
- Modify: `src/app/admin/users/[id]/page.tsx`
- Modify: `src/app/admin/verifications/page.tsx`
- Modify: `src/app/admin/community/queue/page.tsx`
- Modify: `src/app/admin/community/posts/page.tsx`
- Modify: `src/app/admin/community/comments/page.tsx`
- Modify: `src/components/admin/UsersPageClient.tsx`
- Modify: `src/components/admin/UserDetailClient.tsx`
- Modify: `src/components/admin/VerificationsPageClient.tsx`
- Modify: `src/components/admin/QueuePageClient.tsx`
- Modify: `src/components/admin/PostsPageClient.tsx`
- Modify: `src/components/admin/CommentsPageClient.tsx`
- Test: `src/lib/admin/queries/trust-safety.test.ts`
- Test: `src/lib/admin/mutations/trust-safety.test.ts`

- [ ] **Step 1: Write trust/safety query tests**

Cover:

- Users filtering by role/status/search.
- Verifications filtering by status.
- Moderation queue filtering by status/item type.
- Posts/comments filtering by approval state and type.

- [ ] **Step 2: Implement query functions**

Implement:

- `listAdminUsers(options)`
- `getAdminUserDetail(id)`
- `listAdminVerifications(options)`
- `listAdminModerationQueue(options)`
- `listAdminPosts(options)`
- `listAdminComments(options)`

- [ ] **Step 3: Write mutation tests**

Cover reason-required workflows:

- Ban user.
- Unban user.
- Approve/reject verification.
- Resolve moderation item.
- Remove post/comment.

- [ ] **Step 4: Implement trust/safety mutations**

Implement:

- `banAdminUser(userId, reason, durationDays)`
- `unbanAdminUser(userId, reason)`
- `reviewAdminVerification(sellerId, status, tier, reason)`
- `resolveAdminModerationItem(itemId, action, reason)`
- `removeAdminPost(id, reason)`
- `removeAdminComment(id, reason)`

- [ ] **Step 5: Migrate pages and components**

Use shared pagination/filter components. Add audit timelines to user detail and moderation/detail surfaces where records have stable target ids.

- [ ] **Step 6: Run verification**

Run:

```bash
rg -n "\\.limit\\(50\\)" src/app/admin/community src/app/admin/users src/app/admin/verifications src/components/admin
npm run typecheck
npm run lint
```

Expected: trust/safety list pages do not rely on fixed limits.

- [ ] **Step 7: Commit**

```bash
git add src/lib/admin/queries/trust-safety.ts src/lib/admin/mutations/trust-safety.ts src/app/admin/users src/app/admin/verifications src/app/admin/community src/components/admin
git commit -m "feat: upgrade trust and safety admin workflows"
```

---

## Task 11: Upgrade Audit Logs, Settings, And Admin Management

**Files:**
- Modify: `src/app/admin/audit-logs/page.tsx`
- Modify: `src/components/admin/AuditLogsPageClient.tsx`
- Modify: `src/app/admin/settings/admins/page.tsx`
- Modify: `src/components/admin/AdminsPageClient.tsx`
- Modify: `src/components/admin/InviteAdminForm.tsx`
- Create: `src/lib/admin/queries/platform.ts`
- Create: `src/lib/admin/mutations/platform.ts`
- Test: `src/lib/admin/queries/platform.test.ts`
- Test: `src/lib/admin/mutations/platform.test.ts`

- [ ] **Step 1: Write platform query tests**

Cover audit log pagination/filtering by actor/action/target/date.

- [ ] **Step 2: Implement platform queries**

Implement:

- `listAdminAuditLogs(options)`
- `listAdminStaff(options)`

- [ ] **Step 3: Implement platform mutations**

Implement admin invite/remove/permission changes behind `manage_admins`. Every mutation writes audit entries.

- [ ] **Step 4: Migrate pages**

Audit logs page should use server-side pagination and filters. Admin settings should reflect permission keys from `src/lib/admin/types.ts` instead of duplicating hard-coded permission labels.

- [ ] **Step 5: Run verification**

Run:

```bash
npm run typecheck
npm run lint
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/admin/queries/platform.ts src/lib/admin/mutations/platform.ts src/app/admin/audit-logs src/app/admin/settings src/components/admin
git commit -m "feat: upgrade platform admin tools"
```

---

## Task 12: Dashboard And Operational Health

**Files:**
- Modify: `src/app/admin/page.tsx`
- Modify: `src/lib/queries/admin.ts` or create `src/lib/admin/queries/dashboard.ts`
- Optional create: `src/components/admin/AdminHealthPanel.tsx`
- Test: `src/lib/admin/queries/dashboard.test.ts`

- [ ] **Step 1: Write dashboard query tests**

Cover counts for:

- Total users.
- New users today.
- Orders today.
- Pending verifications.
- Open moderation items.
- Open bookings.

- [ ] **Step 2: Implement dashboard query**

Create `getAdminDashboardMetrics()` with explicit count queries and defensive fallbacks.

- [ ] **Step 3: Replace placeholder metrics**

Remove hard-coded KPI changes such as fixed `12%` or `8%` unless backed by real comparative queries.

- [ ] **Step 4: Add health panel if feasible**

If Supabase advisor data is not available at runtime, add a static checklist/link panel for super admins instead of live MCP-only data.

- [ ] **Step 5: Run verification**

Run:

```bash
npm run typecheck
npm run lint
```

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/page.tsx src/lib/admin/queries/dashboard.ts src/components/admin/AdminHealthPanel.tsx
git commit -m "feat: improve admin dashboard metrics"
```

---

## Task 13: Final Sweep And Release Verification

**Files:**
- Modify any files needed to fix final verification failures.
- Update docs if implementation materially diverges from spec.

- [ ] **Step 1: Search for unresolved drift**

Run:

```bash
rg -n "audit_log|from as any\\)\\('listings'|from\\('listings'|\\.limit\\(50\\)|updated_at" src supabase
```

Expected:

- No `audit_log` table references.
- No admin mutation targeting `listings`.
- No high-volume admin list using fixed `.limit(50)`.
- `updated_at` writes match real columns or are removed.

- [ ] **Step 2: Run full verification**

Run:

```bash
npm run typecheck
npm run lint
npm run build
```

Expected: all pass. If build fails because `next/font` cannot fetch Google fonts in a restricted network, either request network approval for the build or self-host fonts in a separate fix.

- [ ] **Step 3: Run Supabase verification**

Run:

```bash
supabase migration list --local
supabase db advisors
```

If CLI support is missing, use Supabase MCP advisors.

Expected: migration is present, and remaining advisor warnings are either fixed or documented.

- [ ] **Step 4: Manual admin smoke test**

Start dev server:

```bash
npm run dev
```

Smoke test:

- `/admin` loads for admin.
- `/admin/marketplace/listings` paginates and filters.
- Listing detail loads and edit saves metadata.
- Sensitive listing/order/booking/user actions require reason.
- Audit logs show new action entries.
- Marketplace staff can access only permitted areas.

- [ ] **Step 5: Update spec/plan notes if needed**

If implementation differs from this plan, update:

- `docs/superpowers/specs/2026-05-10-admin-platform-design.md`
- `docs/superpowers/plans/2026-05-10-admin-platform.md`

- [ ] **Step 6: Commit final fixes**

```bash
git add .
git commit -m "chore: verify admin platform rollout"
```

---

## Execution Notes

- Keep commits small and aligned to task boundaries.
- Do not make destructive data changes without a reversible migration strategy.
- Do not broaden staff permissions to make tests pass; fix the permission model.
- Do not suppress TypeScript with broad `any` unless there is a typed Supabase limitation and a narrow cast is documented.
- Prefer server-side pagination and filtering for all operational admin pages.
- Every sensitive action must capture a reason before mutation.
- Every sensitive mutation must write an `audit_logs` entry.
