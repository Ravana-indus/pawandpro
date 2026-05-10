'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateAdoptionCenter, deleteAdoptionCenter } from '@/lib/actions/admin'
import { EntityForm } from '@/components/admin/EntityForm'
import { FormField } from '@/components/admin/FormField'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { StatusBadge } from '@/components/admin/StatusBadge'

interface AdoptionCenter {
  id: string
  name: string
  type: string | null
  address: string | null
  phone: string | null
  email: string | null
  license_number: string | null
  owner_id: string | null
  is_verified: boolean
  created_at: string
  owner: { full_name: string; contact_email: string } | null
}

interface AdoptionCenterDetailClientProps {
  center: AdoptionCenter
}

export function AdoptionCenterDetailClient({ center }: AdoptionCenterDetailClientProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [, startTransition] = useTransition()

  const handleEdit = () => setIsEditing(true)
  const handleCancel = () => setIsEditing(false)

  const handleUpdateSuccess = () => {
    setIsEditing(false)
    setShowSuccess(true)
    router.refresh()
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    startTransition(async () => {
      const result = await deleteAdoptionCenter(center.id)
      if (result.success) {
        router.push('/admin/services/adoption')
      }
    })
    setShowDeleteDialog(false)
  }

  if (isEditing) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-6">
        <h2 className="text-xl font-headline font-bold text-on-surface mb-6">Edit Adoption Center</h2>
        <EntityForm
          action={updateAdoptionCenter.bind(null, center.id)}
          onSuccess={handleUpdateSuccess}
          submitLabel="Update Center"
        >
          <FormField label="Name" name="name" type="text" defaultValue={center.name} required />
          <FormField label="Type" name="type" type="text" defaultValue={center.type || ''} />
          <FormField label="Address" name="address" type="text" defaultValue={center.address || ''} />
          <FormField label="Phone" name="phone" type="text" defaultValue={center.phone || ''} />
          <FormField label="Email" name="email" type="email" defaultValue={center.email || ''} />
          <FormField label="License Number" name="license_number" type="text" defaultValue={center.license_number || ''} />
          <FormField
            label="Verified"
            name="is_verified"
            type="checkbox"
            defaultValue={center.is_verified}
          />
        </EntityForm>
      </div>
    )
  }

  return (
    <>
      {showSuccess && (
        <div className="p-4 rounded-xl bg-green-500/10 text-green-600 text-sm">
          Adoption center updated successfully
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
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-xl bg-error text-on-error font-medium hover:opacity-90"
          >
            Delete
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Name</label>
              <p className="text-on-surface mt-1">{center.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Type</label>
              <p className="text-on-surface mt-1">{center.type || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Address</label>
              <p className="text-on-surface mt-1">{center.address || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Phone</label>
              <p className="text-on-surface mt-1">{center.phone || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Email</label>
              <p className="text-on-surface mt-1">{center.email || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">License Number</label>
              <p className="text-on-surface mt-1">{center.license_number || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Verification Status</label>
              <div className="mt-1">
                <StatusBadge status={center.is_verified ? 'verified' : 'unverified'} />
              </div>
            </div>
            {center.owner && (
              <>
                <div>
                  <label className="text-sm font-medium text-on-surface-variant">Owner Name</label>
                  <p className="text-on-surface mt-1">{center.owner.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-on-surface-variant">Owner Email</label>
                  <p className="text-on-surface mt-1">{center.owner.contact_email}</p>
                </div>
              </>
            )}
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Created</label>
              <p className="text-on-surface mt-1">{new Date(center.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Adoption Center"
        message={`Are you sure you want to delete "${center.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </>
  )
}