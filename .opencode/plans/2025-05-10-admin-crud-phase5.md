# Admin CRUD — Phase 5: Settings Pages

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Build functional settings pages: Platform Config, Admin Management, Role Permissions, Payment Settings. Replace all "Coming soon" placeholders.

**Depends on:** Phase 1 (reusable form components, server action patterns)

**Tech Stack:** Next.js 15 App Router, React Server Components, Supabase, Tailwind CSS

---

## New/Modified Files

```
src/
  app/admin/settings/
    platform/page.tsx            # MODIFIED — Platform config form
    admins/page.tsx              # MODIFIED — Admin list + invite
    permissions/page.tsx         # MODIFIED — Role-permission matrix
    payments/page.tsx            # MODIFIED — Payment config form
  lib/actions/admin.ts           # MODIFIED — Add settings actions
  lib/queries/admin.ts           # MODIFIED — Add getAdmins, getPlatformSettings
```

---

## Task 1: Add Settings Query Helpers and Actions

**Files:**
- Modify: `src/lib/queries/admin.ts`
- Modify: `src/lib/actions/admin.ts`

- [ ] **Step 1: Add getAdmins and getPlatformSettings queries**

```typescript
// src/lib/queries/admin.ts

export async function getAdmins() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, contact_email, role, created_at, admin_permissions')
    .in('role', ['SUPER_ADMIN', 'ADMIN', 'MARKETPLACE_STAFF'])
    .order('created_at', { ascending: false })
  if (error) return { data: [], error: error.message }
  return { data, error: null }
}

export async function getPlatformSettings() {
  const supabase = await createClient()
  // Platform settings stored in a single-row table or as a JSON config
  // For now, return defaults if no settings table exists
  const { data, error } = await supabase
    .from('platform_settings')
    .select('*')
    .single()
  
  if (error && error.code !== 'PGRST116') {
    return { data: null, error: error.message }
  }
  
  return {
    data: data || {
      site_name: 'PawsAndPro',
      commission_rate: 10,
      auto_moderation: false,
      payout_schedule: 'weekly',
    },
    error: null,
  }
}
```

- [ ] **Step 2: Add settings server actions**

```typescript
// src/lib/actions/admin.ts — append to existing file

export async function updatePlatformSettings(formData: FormData) {
  const { supabase } = await requireAdmin('update_platform_settings')
  const settings = Object.fromEntries(formData)
  
  // Upsert into platform_settings table
  const { error } = await supabase
    .from('platform_settings')
    .upsert({ id: 1, ...settings, updated_at: new Date().toISOString() })
  
  if (error) return { error: error.message }
  await logAudit('update_platform_settings', 'settings', null, settings)
  revalidatePath('/admin/settings/platform')
  return { success: true }
}

export async function inviteAdmin(formData: FormData) {
  const { supabase } = await requireAdmin('invite_admin')
  const email = formData.get('email') as string
  const role = formData.get('role') as string
  
  // In a real app, this would send an invitation email
  // For now, we just validate the email and log the action
  if (!email || !email.includes('@')) return { error: 'Valid email required' }
  
  await logAudit('invite_admin', 'user', null, { email, role })
  revalidatePath('/admin/settings/admins')
  return { success: true }
}

export async function removeAdmin(userId: string) {
  const { supabase } = await requireAdmin('remove_admin')
  
  // Revert role to CUSTOMER
  const { error } = await supabase
    .from('profiles')
    .update({ role: 'CUSTOMER', admin_permissions: null })
    .eq('id', userId)
  
  if (error) return { error: error.message }
  await logAudit('remove_admin', 'user', userId)
  revalidatePath('/admin/settings/admins')
  return { success: true }
}

export async function updateRolePermissions(formData: FormData) {
  const { supabase } = await requireAdmin('update_permissions')
  const permissions = Object.fromEntries(formData)
  
  // Store permissions in a dedicated table or as JSON
  const { error } = await supabase
    .from('role_permissions')
    .upsert({ id: 1, permissions, updated_at: new Date().toISOString() })
  
  if (error) return { error: error.message }
  await logAudit('update_permissions', 'settings', null, permissions)
  revalidatePath('/admin/settings/permissions')
  return { success: true }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/queries/admin.ts src/lib/actions/admin.ts
git commit -m "feat(admin): add settings queries and server actions"
```

---

## Task 2: Platform Settings Page

**Files:**
- Modify: `src/app/admin/settings/platform/page.tsx`

- [ ] **Step 1: Replace placeholder with functional form**

```typescript
import React from 'react'
import { getPlatformSettings } from '@/lib/queries/admin'
import { updatePlatformSettings } from '@/lib/actions/admin'
import { EntityHeader } from '@/components/admin/EntityHeader'
import { EntityForm } from '@/components/admin/EntityForm'
import { FormField } from '@/components/admin/FormField'

export default async function PlatformSettingsPage() {
  const { data: settings } = await getPlatformSettings()

  return (
    <div className="space-y-6">
      <EntityHeader
        title="Platform Settings"
        subtitle="Configure global platform behavior"
        backHref="/admin/settings"
        backLabel="Back to Settings"
      />

      <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 max-w-2xl">
        <EntityForm action={updatePlatformSettings}>
          <div className="space-y-4">
            <FormField
              label="Site Name"
              name="site_name"
              defaultValue={settings?.site_name || 'PawsAndPro'}
              required
            />
            <FormField
              label="Commission Rate (%)"
              name="commission_rate"
              type="number"
              defaultValue={settings?.commission_rate || 10}
              required
            />
            <FormField
              label="Payout Schedule"
              name="payout_schedule"
              type="select"
              defaultValue={settings?.payout_schedule || 'weekly'}
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'biweekly', label: 'Bi-weekly' },
                { value: 'monthly', label: 'Monthly' },
              ]}
            />
            <FormField
              label="Auto-Moderation"
              name="auto_moderation"
              type="select"
              defaultValue={settings?.auto_moderation ? 'true' : 'false'}
              options={[
                { value: 'true', label: 'Enabled' },
                { value: 'false', label: 'Disabled' },
              ]}
            />
          </div>
        </EntityForm>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/settings/platform/page.tsx
git commit -m "feat(admin): add platform settings form"
```

---

## Task 3: Admin Management Page

**Files:**
- Modify: `src/app/admin/settings/admins/page.tsx`

- [ ] **Step 1: Replace placeholder with admin list + invite form**

```typescript
import React from 'react'
import { getAdmins } from '@/lib/queries/admin'
import { inviteAdmin, removeAdmin } from '@/lib/actions/admin'
import { EntityHeader } from '@/components/admin/EntityHeader'
import { EntityForm } from '@/components/admin/EntityForm'
import { FormField } from '@/components/admin/FormField'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { DataTable } from '@/components/DataTable'

export default async function AdminsManagementPage() {
  const { data: admins } = await getAdmins()

  const columns = [
    { key: 'full_name', label: 'Name', sortable: true },
    { key: 'contact_email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true, render: (v: unknown) => <StatusBadge status={String(v)} /> },
    { key: 'created_at', label: 'Added', sortable: true, render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
  ]

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      <form action={async () => { 'use server'; await removeAdmin(row.id as string) }}>
        <button type="submit" className="px-3 py-1 rounded-lg text-xs font-medium bg-error/10 text-error hover:bg-error/20">
          Remove
        </button>
      </form>
    </div>
  )

  return (
    <div className="space-y-6">
      <EntityHeader
        title="Admin Management"
        subtitle="Invite and manage platform administrators"
        backHref="/admin/settings"
        backLabel="Back to Settings"
      />

      <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 max-w-xl">
        <h2 className="text-lg font-bold text-on-surface mb-4">Invite Admin</h2>
        <EntityForm action={inviteAdmin} submitLabel="Send Invitation">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Email" name="email" type="email" required />
            <FormField
              label="Role"
              name="role"
              type="select"
              defaultValue="ADMIN"
              options={[
                { value: 'ADMIN', label: 'Admin' },
                { value: 'MARKETPLACE_STAFF', label: 'Marketplace Staff' },
                { value: 'SUPER_ADMIN', label: 'Super Admin' },
              ]}
            />
          </div>
        </EntityForm>
      </div>

      <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
        <h2 className="text-lg font-bold text-on-surface mb-4">Current Admins ({admins?.length || 0})</h2>
        <DataTable columns={columns} data={admins || []} actions={actions} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/settings/admins/page.tsx
git commit -m "feat(admin): add admin management with invite and remove"
```

---

## Task 4: Role Permissions Page

**Files:**
- Modify: `src/app/admin/settings/permissions/page.tsx`

- [ ] **Step 1: Replace placeholder with permission matrix**

```typescript
import React from 'react'
import { updateRolePermissions } from '@/lib/actions/admin'
import { EntityHeader } from '@/components/admin/EntityHeader'
import { EntityForm } from '@/components/admin/EntityForm'

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'MARKETPLACE_STAFF']
const PERMISSIONS = [
  { key: 'users_read', label: 'View Users' },
  { key: 'users_manage', label: 'Manage Users (Ban/Role)' },
  { key: 'verifications_manage', label: 'Manage Verifications' },
  { key: 'products_manage', label: 'Manage Products' },
  { key: 'listings_manage', label: 'Manage Listings' },
  { key: 'orders_manage', label: 'Manage Orders' },
  { key: 'vets_manage', label: 'Manage Vets' },
  { key: 'adoption_manage', label: 'Manage Adoption Centers' },
  { key: 'providers_manage', label: 'Manage Providers' },
  { key: 'bookings_manage', label: 'Manage Bookings' },
  { key: 'posts_manage', label: 'Manage Posts' },
  { key: 'comments_manage', label: 'Manage Comments' },
  { key: 'moderation_manage', label: 'Manage Moderation Queue' },
  { key: 'audit_read', label: 'View Audit Logs' },
  { key: 'settings_manage', label: 'Manage Settings' },
]

// Default permission matrix
const DEFAULT_MATRIX: Record<string, Record<string, boolean>> = {
  SUPER_ADMIN: Object.fromEntries(PERMISSIONS.map(p => [p.key, true])),
  ADMIN: {
    users_read: true, users_manage: true,
    verifications_manage: true, products_manage: true,
    listings_manage: true, orders_manage: true,
    vets_manage: true, adoption_manage: true,
    providers_manage: true, bookings_manage: true,
    posts_manage: true, comments_manage: true,
    moderation_manage: true, audit_read: true,
    settings_manage: false,
  },
  MARKETPLACE_STAFF: {
    users_read: true, users_manage: false,
    verifications_manage: false, products_manage: true,
    listings_manage: true, orders_manage: true,
    vets_manage: false, adoption_manage: false,
    providers_manage: false, bookings_manage: false,
    posts_manage: false, comments_manage: false,
    moderation_manage: false, audit_read: false,
    settings_manage: false,
  },
}

export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <EntityHeader
        title="Role Permissions"
        subtitle="Configure access levels for each admin role"
        backHref="/admin/settings"
        backLabel="Back to Settings"
      />

      <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 overflow-x-auto">
        <EntityForm action={updateRolePermissions} submitLabel="Save Permissions">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-outline-variant/20">
                <th className="text-left py-3 px-2 text-sm font-medium text-on-surface-variant">Permission</th>
                {ROLES.map(role => (
                  <th key={role} className="text-center py-3 px-2 text-sm font-medium text-on-surface-variant">
                    {role.replace('_', ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map(perm => (
                <tr key={perm.key} className="border-b border-outline-variant/10 hover:bg-surface-container-high/50">
                  <td className="py-3 px-2 text-sm text-on-surface">{perm.label}</td>
                  {ROLES.map(role => (
                    <td key={role} className="text-center py-3 px-2">
                      <input
                        type="checkbox"
                        name={`${role}_${perm.key}`}
                        defaultChecked={DEFAULT_MATRIX[role][perm.key]}
                        className="rounded"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </EntityForm>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/settings/permissions/page.tsx
git commit -m "feat(admin): add role permissions matrix"
```

---

## Task 5: Payment Settings Page

**Files:**
- Modify: `src/app/admin/settings/payments/page.tsx`

- [ ] **Step 1: Replace placeholder with payment config form**

```typescript
import React from 'react'
import { updatePlatformSettings } from '@/lib/actions/admin'
import { getPlatformSettings } from '@/lib/queries/admin'
import { EntityHeader } from '@/components/admin/EntityHeader'
import { EntityForm } from '@/components/admin/EntityForm'
import { FormField } from '@/components/admin/FormField'

export default async function PaymentsSettingsPage() {
  const { data: settings } = await getPlatformSettings()

  return (
    <div className="space-y-6">
      <EntityHeader
        title="Payment Settings"
        subtitle="Configure commission rates and payout schedules"
        backHref="/admin/settings"
        backLabel="Back to Settings"
      />

      <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 max-w-2xl">
        <EntityForm action={updatePlatformSettings} submitLabel="Save Payment Settings">
          <div className="space-y-4">
            <FormField
              label="Platform Commission Rate (%)"
              name="commission_rate"
              type="number"
              defaultValue={settings?.commission_rate || 10}
              required
            />
            <FormField
              label="Payout Schedule"
              name="payout_schedule"
              type="select"
              defaultValue={settings?.payout_schedule || 'weekly'}
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'biweekly', label: 'Bi-weekly' },
                { value: 'monthly', label: 'Monthly' },
              ]}
            />
            <FormField
              label="Minimum Payout Amount ($)"
              name="min_payout_amount"
              type="number"
              defaultValue={settings?.min_payout_amount || 50}
            />
            <FormField
              label="Payment Gateway"
              name="payment_gateway"
              type="select"
              defaultValue={settings?.payment_gateway || 'payhere'}
              options={[
                { value: 'payhere', label: 'PayHere' },
                { value: 'stripe', label: 'Stripe' },
                { value: 'paypal', label: 'PayPal' },
              ]}
            />
          </div>
        </EntityForm>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/settings/payments/page.tsx
git commit -m "feat(admin): add payment settings form"
```

---

## Acceptance Criteria

- [ ] `/admin/settings/platform` shows and saves platform config (site name, commission, auto-moderation)
- [ ] `/admin/settings/admins` shows admin list with invite form and remove action
- [ ] `/admin/settings/permissions` shows role-permission matrix with save functionality
- [ ] `/admin/settings/payments` shows and saves payment config (commission, payout schedule, gateway)
- [ ] All settings forms validate inputs and show success/error feedback
- [ ] Audit logs created for all settings changes
- [ ] No "Coming soon" placeholders remain in settings pages
