'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AdminDataTable } from "@/components/admin/AdminDataTable"
import { AdminFilterBar } from "@/components/admin/AdminFilterBar"
import { deleteAdoptionCenter } from '@/lib/actions/admin'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { StatusBadge } from '@/components/admin/StatusBadge'
import type { AdminListResult } from '@/lib/admin/types'
import type { AdminAdoptionCenterListItem } from '@/lib/admin/queries/services'

interface AdoptionPageClientProps {
  result: AdminListResult<AdminAdoptionCenterListItem>
}

const ADOPTION_STATUS_OPTIONS = [
  { value: "verified", label: "Verified" },
  { value: "unverified", label: "Unverified" },
]

const ADOPTION_SORT_OPTIONS = [
  { value: "created_at", label: "Created At" },
  { value: "name", label: "Name" },
  { value: "type", label: "Type" },
  { value: "is_verified", label: "Verification" },
]

export function AdoptionPageClient({ result }: AdoptionPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const queryEntries = Object.fromEntries(searchParams.entries())
  delete queryEntries.page

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
        <AdminFilterBar
          basePath="/admin/services/adoption"
          searchPlaceholder="Search name, type, location, or license..."
          statusOptions={ADOPTION_STATUS_OPTIONS}
          sortOptions={ADOPTION_SORT_OPTIONS}
          defaults={{
            search: searchParams.get("search") ?? "",
            status: searchParams.get("status") ?? "",
            sort: searchParams.get("sort") ?? "created_at",
            direction: searchParams.get("direction") === "asc" ? "asc" : "desc",
            perPage: result.perPage,
          }}
        />
        <AdminDataTable
          columns={columns}
          data={result.data as Record<string, unknown>[]}
          actions={actions}
          pagination={{
            basePath: "/admin/services/adoption",
            page: result.page,
            totalPages: result.totalPages,
            query: queryEntries,
          }}
        />
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
