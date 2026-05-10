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
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      await deleteListing(listingId)
      router.push('/admin/marketplace/listings')
      router.refresh()
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
      <ConfirmDialog
        open={open}
        title="Delete Listing"
        message="Are you sure you want to delete this listing? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}