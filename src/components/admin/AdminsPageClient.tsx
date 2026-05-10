'use client'

import React, { useState } from 'react'
import { EntityHeader } from '@/components/admin/EntityHeader'
import { DataTable } from '@/components/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { InviteAdminForm } from '@/components/admin/InviteAdminForm'
import { removeAdmin } from '@/lib/admin/mutations/platform'

interface AdminsPageClientProps {
  initialAdmins: Record<string, unknown>[]
}

export function AdminsPageClient({ initialAdmins }: AdminsPageClientProps) {
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null)

  const columns = [
    { key: 'full_name', label: 'Name' },
    { key: 'contact_email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'is_verified', label: 'Verified', render: (v: unknown) => <StatusBadge status={v ? 'verified' : 'unverified'} /> },
    { key: 'created_at', label: 'Joined', render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
  ]

  async function handleRemoveAdmin(userId: string) {
    const result = await removeAdmin(userId)
    if (result.success) {
      window.location.reload()
    } else {
      alert(result.error || 'Failed to remove admin')
    }
    setConfirmRemove(null)
  }

  const actions = (row: Record<string, unknown>) => (
    <button
      onClick={() => setConfirmRemove(row.id as string)}
      className="px-3 py-1 rounded-lg text-xs font-medium bg-error/10 text-error hover:bg-error/20"
    >
      Remove Admin
    </button>
  )

  return (
    <div className="space-y-6">
      <EntityHeader
        title="Admin Management"
        subtitle="Manage admin users and permissions"
        backHref="/admin"
        backLabel="Back to Admin"
      />

      <div className="bg-surface-container-low p-4 rounded-xl">
        <h2 className="text-lg font-semibold text-on-surface mb-4">Invite New Admin</h2>
        <div className="max-w-md">
          <InviteAdminForm />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={initialAdmins}
        actions={actions}
        emptyMessage="No admin users found"
      />

      <ConfirmDialog
        open={!!confirmRemove}
        title="Remove Admin"
        message="Are you sure you want to remove this user's admin privileges?"
        confirmLabel="Remove"
        variant="danger"
        onConfirm={() => confirmRemove && handleRemoveAdmin(confirmRemove)}
        onCancel={() => setConfirmRemove(null)}
      />
    </div>
  )
}
