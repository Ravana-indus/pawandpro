'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { deleteListing } from '@/lib/actions/admin'

interface DeleteButtonProps {
  listingId: string
}

export function DeleteButton({ listingId }: DeleteButtonProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete(reason?: string) {
    const trimmedReason = reason?.trim() ?? ''
    if (!trimmedReason) {
      setError('Reason is required to delete a listing.')
      return
    }

    setError(null)
    startTransition(async () => {
      const result = await deleteListing(listingId, trimmedReason)
      if (result.success) {
        router.push('/admin/marketplace/listings')
        router.refresh()
        return
      }

      setError(typeof result.error === 'string' ? result.error : 'Failed to delete listing')
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-xl bg-error text-on-error font-medium hover:opacity-90"
      >
        Delete
      </button>
      {error ? <p className="mt-2 text-sm text-error">{error}</p> : null}
      <ConfirmDialog
        open={open}
        title="Delete Listing"
        message="Are you sure you want to delete this listing? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        showNotes
        notesPlaceholder="Reason for deletion (required)"
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
