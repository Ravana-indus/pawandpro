'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DataTable } from "@/components/DataTable"
import { deleteAdoptionCenter } from '@/lib/actions/admin'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { StatusBadge } from '@/components/admin/StatusBadge'

interface AdoptionPageClientProps {
  data: Record<string, unknown>[]
}

export function AdoptionPageClient({ data }: AdoptionPageClientProps) {
  const router = useRouter()
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    setConfirmDelete(id)
  }

  const confirmDeleteAction = () => {
    if (!confirmDelete) return
    startTransition(async () => {
      await deleteAdoptionCenter(confirmDelete)
      router.refresh()
    })
    setConfirmDelete(null)
  }

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "type", label: "Type", sortable: true },
    { key: "address", label: "Address" },
    { key: "is_verified", label: "Verified", render: (v: unknown) => (
      <StatusBadge status={v ? 'verified' : 'unverified'} />
    )},
    { key: "created_at", label: "Added", sortable: true, render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
  ]

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      <Link
        href={`/admin/services/adoption/${row.id as string}`}
        className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20"
      >
        View
      </Link>
      <button
        onClick={() => handleDelete(row.id as string)}
        className="px-3 py-1 rounded-lg text-xs font-medium bg-error/10 text-error hover:bg-error/20"
      >
        Delete
      </button>
    </div>
  )

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
            Adoption Centers
          </h1>
          <p className="text-on-surface-variant">Manage adoption center verifications and listings</p>
        </div>
        <DataTable columns={columns} data={data} actions={actions} />
      </div>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete Adoption Center"
        message="Are you sure you want to delete this adoption center? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDeleteAction}
        onCancel={() => setConfirmDelete(null)}
      />
    </>
  )
}