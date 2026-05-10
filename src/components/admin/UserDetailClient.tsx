'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateUser } from '@/lib/actions/admin'
import { banAdminUser, unbanAdminUser } from '@/lib/admin/mutations/trust-safety'
import { EntityForm } from '@/components/admin/EntityForm'
import { FormField } from '@/components/admin/FormField'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { StatusBadge } from '@/components/admin/StatusBadge'

interface User {
  id: string
  full_name: string | null
  contact_email: string | null
  phone: string | null
  role: string | null
  is_verified: boolean | null
  verification_status: string | null
  banned_until: string | null
  created_at: string | null
}

interface UserDetailClientProps {
  user: User
}

const ROLE_OPTIONS = [
  { value: 'USER', label: 'User' },
  { value: 'SELLER', label: 'Seller' },
  { value: 'BREEDER', label: 'Breeder' },
  { value: 'INDIVIDUAL_SELLER', label: 'Individual Seller' },
  { value: 'ADOPTION_PROVIDER', label: 'Adoption Provider' },
  { value: 'VET', label: 'Veterinarian' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
]

export function UserDetailClient({ user }: UserDetailClientProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [showBanDialog, setShowBanDialog] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [, startTransition] = useTransition()

  const isBanned = user.banned_until && new Date(user.banned_until) > new Date()

  const handleEdit = () => setIsEditing(true)
  const handleCancel = () => setIsEditing(false)

  const handleUpdateSuccess = () => {
    setIsEditing(false)
    setShowSuccess(true)
    router.refresh()
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleBan = () => setShowBanDialog(true)

  const confirmBan = (notes?: string) => {
    startTransition(async () => {
      await banAdminUser(user.id, notes || 'No reason provided', 30)
      router.refresh()
    })
    setShowBanDialog(false)
  }

  const handleUnban = () => {
    startTransition(async () => {
      await unbanAdminUser(user.id, 'Unbanned by admin')
      router.refresh()
    })
  }

  if (isEditing) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-6">
        <h2 className="text-xl font-headline font-bold text-on-surface mb-6">Edit User</h2>
        <EntityForm
          action={updateUser.bind(null, user.id)}
          onSuccess={handleUpdateSuccess}
          submitLabel="Update User"
        >
          <FormField label="Full Name" name="full_name" type="text" defaultValue={user.full_name || ''} required />
          <FormField label="Contact Email" name="contact_email" type="email" defaultValue={user.contact_email || ''} required />
          <FormField label="Phone" name="phone" type="text" defaultValue={user.phone || ''} />
          <FormField label="Role" name="role" type="select" defaultValue={user.role || ''} options={ROLE_OPTIONS} required />
          <FormField label="Verified" name="is_verified" type="checkbox" defaultValue={user.is_verified ?? false} />
        </EntityForm>
      </div>
    )
  }

  return (
    <>
      {showSuccess && (
        <div className="p-4 rounded-xl bg-green-500/10 text-green-600 text-sm">
          User updated successfully
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-outline-variant/20 flex gap-3">
          <button
            onClick={handleEdit}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary font-medium hover:opacity-90"
          >
            Edit
          </button>
          {isBanned ? (
            <button
              onClick={handleUnban}
              className="px-4 py-2 rounded-xl bg-warning text-on-warning font-medium hover:opacity-90"
            >
              Unban
            </button>
          ) : (
            <button
              onClick={handleBan}
              className="px-4 py-2 rounded-xl bg-error text-on-error font-medium hover:opacity-90"
            >
              Ban
            </button>
          )}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Full Name</label>
              <p className="text-on-surface mt-1">{user.full_name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Contact Email</label>
              <p className="text-on-surface mt-1">{user.contact_email || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Phone</label>
              <p className="text-on-surface mt-1">{user.phone || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Role</label>
              <p className="text-on-surface mt-1">{user.role}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Verification Status</label>
              <div className="mt-1">
                <StatusBadge status={user.is_verified ? 'verified' : 'unverified'} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Admin Status</label>
              <div className="mt-1">
                <StatusBadge status={user.verification_status || 'pending'} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Ban Status</label>
              <div className="mt-1">
                {isBanned ? (
                  <span className="px-3 py-1 rounded-lg text-xs font-medium bg-error/10 text-error">
                    Banned until {new Date(user.banned_until!).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-lg text-xs font-medium bg-green-500/10 text-green-600">
                    Active
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Created</label>
              <p className="text-on-surface mt-1">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showBanDialog}
        title="Ban User"
        message={`Are you sure you want to ban "${user.full_name || user.contact_email}"? They will not be able to access their account.`}
        confirmLabel="Ban"
        variant="danger"
        showNotes
        notesPlaceholder="Reason for ban (optional)"
        onConfirm={confirmBan}
        onCancel={() => setShowBanDialog(false)}
      />
    </>
  )
}