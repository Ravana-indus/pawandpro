# Admin Platform Improvement Design

## Context

The current `/admin` area covers users, marketplace, services, community moderation, settings, and audit logs, but the implementation is not ready for large operational volume. The live Supabase schema and the admin code have drifted in several important places:

- Admin listing mutations write to `listings`, while the live schema and read pages use `pet_listings`.
- Admin audit writes target `audit_log`, while the live table is `audit_logs`.
- Some mutations write fields that are not present in the live schema, such as `updated_at` on tables that do not currently have that column.
- `MARKETPLACE_STAFF` can enter `/admin`, but most server actions reject that role.
- Most high-volume admin pages hard-limit data to 50 rows instead of using scalable server-side pagination, filtering, and sorting.
- Supabase advisors report missing foreign-key indexes, expensive RLS policies, broad GraphQL exposure, mutable function search paths, and callable `SECURITY DEFINER` functions.

This design uses a balanced phased rebuild: stabilize broken operations first, then build shared admin primitives, then upgrade each operational domain.

## Goals

- Make current admin actions reliable and auditable.
- Support high-volume operations through server-side pagination, filtering, sorting, and domain-specific queues.
- Separate generic editing from sensitive workflow actions.
- Enforce role and permission checks consistently across pages and server actions.
- Improve Supabase performance and security posture before operational volume grows.
- Create a foundation that allows marketplace, services, trust/safety, and platform workflows to evolve without duplicating patterns.

## Non-Goals

- Do not redesign the public customer-facing marketplace, services, or community pages.
- Do not build a full BI/analytics platform in the first phases.
- Do not introduce a separate admin backend service unless the current Next.js/Supabase architecture blocks a requirement.
- Do not implement broad bulk destructive actions until audit, permissions, and reason capture are in place.

## Architecture

The admin platform will be rebuilt in four phases.

### Phase 1: Stabilization

Fix broken operations and schema drift before changing UX heavily.

- Use `pet_listings` consistently for listing reads and writes.
- Use `audit_logs` consistently for admin audit records.
- Decide whether operational tables should gain `updated_at`; either add columns/triggers or remove invalid writes.
- Align `requireAdmin` with the actual role/permission model.
- Add missing indexes for high-volume joins and filters.
- Address Supabase advisor warnings that affect admin reliability, security, and scale.

### Phase 2: Shared Admin Primitives

Introduce reusable foundations for all admin domains.

- Typed server-side list query helpers.
- Typed detail query helpers.
- Typed mutation/action helpers.
- Centralized permission checks.
- Centralized audit logging.
- Reusable admin table, filter bar, pagination, detail sections, action panels, reason dialogs, and audit timeline components.

### Phase 3: Domain Workspaces

Apply the shared primitives to each domain.

- Marketplace: listings, products, orders, sellers.
- Services: providers, vets, hospitals, adoption centers, bookings.
- Trust and safety: users, verifications, moderation queue, posts, comments.
- Platform: admins, permissions, audit logs, payments, settings.

### Phase 4: Operational Tooling

Add higher-level management capabilities after stable workflows exist.

- Dashboard metrics backed by reliable queries.
- Saved filters and operational views.
- Audit search and review workflows.
- Exports and reporting.
- Supabase health/advisor visibility for operators or super admins.

## Data Flow

Admin pages should stop making ad hoc Supabase calls directly inside page files when the page has operational complexity. Instead, each domain should use an admin data layer with functions such as:

- `listAdminListings`
- `getAdminListingDetail`
- `updateAdminListingMetadata`
- `transitionAdminListingStatus`
- `listAdminOrders`
- `getAdminOrderDetail`
- `transitionAdminOrderStatus`
- `listAdminBookings`
- `getAdminBookingDetail`
- `cancelAdminBooking`
- `listAdminUsers`
- `getAdminUserDetail`
- `banAdminUser`
- `writeAdminAuditLog`

List functions should accept:

- `page`
- `perPage`
- `sort`
- `direction`
- `search`
- Domain-specific filters

List functions should return:

- `data`
- `total`
- `page`
- `perPage`
- `totalPages`
- Optional `facets` for counts by status/type when useful

Mutation functions should:

- Validate input with schema definitions.
- Check role and granular permissions.
- Fetch the current record when needed for before/after audit data.
- Perform the mutation.
- Write an audit record.
- Revalidate affected routes.
- Return structured success/error data.

## Permissions

The admin permission model should be explicit and shared.

- `SUPER_ADMIN` can manage all admin domains.
- `ADMIN` can manage all operational domains, but platform-level admin management can remain super-admin-only.
- `MARKETPLACE_STAFF` can access marketplace and selected trust/safety workflows only when `admin_permissions` grants the operation.
- Future staff roles should be added through permissions rather than hard-coded page-specific checks.

Server actions should use a single helper, for example `requireAdminPermission(permission)`, instead of each action checking roles differently.

Suggested permission keys:

- `manage_users`
- `manage_marketplace`
- `manage_orders`
- `verify_sellers`
- `manage_services`
- `manage_vets`
- `manage_adoption`
- `moderate_content`
- `view_analytics`
- `manage_payments`
- `audit_logs`
- `manage_admins`
- `manage_platform_settings`

## Audit Logging

Every sensitive admin mutation should write to `audit_logs`.

Audit entries should include:

- `actor_id`
- `action`
- `target_type`
- `target_id`
- `details`
- `created_at`

The `details` payload should include:

- `reason` for sensitive actions.
- `before` and `after` summaries when feasible.
- `changed_fields` for metadata edits.
- `source` such as `admin`.
- Optional request metadata if available later.

Sensitive actions requiring reason capture:

- Delete listing.
- Cancel order.
- Cancel booking.
- Ban or unban user.
- Reject verification.
- Remove post or comment.
- Change provider verification.
- Change seller certification.
- Change payment/order state.

## Page And Workflow Design

### List Pages

List pages should become scalable work queues.

Required capabilities:

- Server-side pagination.
- Server-side filtering.
- Server-side sorting with a whitelist of allowed sort fields.
- Search across relevant fields.
- Clear loading, empty, and error states.
- Row-level actions.
- Optional row selection for safe bulk operations.
- URL-driven filters so views can be shared and revisited.

Priority list pages:

- Orders.
- Pet listings.
- Service bookings.
- Users.
- Verifications.
- Moderation queue.
- Products.
- Providers.

### Detail Pages

Detail pages should become decision surfaces, not just record dumps.

Each detail page should show:

- Primary record summary.
- Related records.
- Status and status history where available.
- Audit timeline.
- Owner/customer/seller/provider context.
- Notes or operational metadata.
- Available actions based on permissions and current state.

Examples:

- Order detail should show buyer, order items, linked products/listings, payment context, current status, valid transitions, and audit trail.
- Listing detail should show seller, certification, media, status, linked order history, moderation history, and safe edit/workflow actions.
- Booking detail should show provider, customer, pet, schedule, status, fee, notes, cancellation/reschedule context, and audit trail.
- User detail should show profile, roles, verification state, pets/listings/orders/bookings, ban state, and audit trail.

### Edit Pages

Edit pages should be limited to safe metadata changes. Workflow actions should be separated.

Examples:

- Listing metadata edit: name, species, breed, age, price, image URL.
- Listing workflow actions: approve, reject, change certification, mark sold, delete.
- Order metadata should usually not be directly editable; operators should use explicit status transitions.
- User role and permission changes should be separate from profile metadata edits.

## Supabase Schema And Security Work

Phase 1 should include database work before scaling the admin UI.

Schema consistency:

- Replace all admin references to `listings` with `pet_listings`.
- Replace all admin references to `audit_log` with `audit_logs`.
- Add missing `updated_at` columns and triggers where the app needs them, or remove invalid writes.
- Consider adding lifecycle/history tables for status transitions if audit logs are not sufficient.

Indexes:

- Add indexes for unindexed foreign keys reported by Supabase advisors.
- Add composite indexes for common admin filters such as status plus created date.
- Add indexes for audit log queries by `created_at`, `actor_id`, `target_type`, and `target_id`.

RLS and security:

- Set stable `search_path` on database functions.
- Revoke unnecessary execution on public `SECURITY DEFINER` functions.
- Move privileged functions out of exposed schemas where appropriate.
- Optimize RLS policies that call `auth.uid()` per row.
- Reduce duplicate permissive policies where practical.
- Review GraphQL exposure and revoke broad access from internal tables.

## Testing Strategy

Testing should target operational safety.

Phase 1 tests:

- Admin permission helper allows and denies expected roles.
- Audit logger writes the correct table and payload.
- Listing mutations target `pet_listings`.
- Booking/order mutations do not write invalid columns.
- List query builders correctly sanitize pagination, sorting, and filters.

Domain tests:

- List pages apply pagination, filters, and sorting.
- Detail pages render related records.
- Edit pages submit only safe fields.
- Sensitive actions require reason capture.
- Mutations write audit records.
- Unauthorized roles receive structured denial errors.

Project tooling:

- Add a working typecheck script.
- Fix lint script for the installed Next.js version.
- Keep `npm run build` as a release gate.
- Use Supabase advisors after schema migrations.

## Rollout Plan

### Phase 1: Stabilize

- Fix table-name drift and audit logging.
- Fix permission helper behavior.
- Fix invalid column writes.
- Add missing indexes.
- Address highest-priority Supabase advisor warnings.
- Add basic tests and scripts needed to verify work.

### Phase 2: Shared Admin Foundation

- Add admin query/action modules.
- Add reusable list/detail/action/audit UI primitives.
- Convert the highest-volume pages to server-side pagination and filtering.

### Phase 3A: Marketplace Workspace

- Upgrade listings, products, orders, and sellers.
- Add order item context and listing/product links.
- Add safe status transitions and reason capture.

### Phase 3B: Services Workspace

- Upgrade providers, vets, hospitals, adoption centers, and bookings.
- Add provider/customer/pet context.
- Add booking cancellation and provider verification workflows.

### Phase 3C: Trust And Safety Workspace

- Upgrade users, verifications, moderation queue, posts, and comments.
- Add user context, ban workflow, verification review, moderation decisions, and audit timelines.

### Phase 4: Operational Tooling

- Add dashboard improvements.
- Add saved views.
- Add audit search.
- Add exports.
- Add health/advisor checks.

## Acceptance Criteria

- Admin listing create/update/delete actions operate on `pet_listings`.
- Admin audit records are written to `audit_logs` with actor and reason metadata for sensitive actions.
- Marketplace staff permissions are consistent between layout access and server actions.
- High-volume list pages do not rely on fixed `.limit(50)` queries.
- Detail pages show enough related context for operators to make decisions.
- Sensitive workflow actions require confirmation and reason capture.
- Supabase advisor issues that affect admin scale/security are either fixed or explicitly deferred with rationale.
- Build, typecheck, and relevant tests pass before implementation is considered complete.

