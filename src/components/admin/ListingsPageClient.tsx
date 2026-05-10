"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/DataTable"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { deleteListing } from "@/lib/actions/admin"

interface ListingsPageClientProps {
  listings: Record<string, unknown>[]
}

export function ListingsPageClient({ listings }: ListingsPageClientProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete(reason?: string) {
    if (!deleteId) return

    const trimmedReason = reason?.trim() ?? ""
    if (!trimmedReason) {
      setDeleteError("Reason is required to delete a listing.")
      return
    }

    setDeleteError(null)
    startTransition(async () => {
      const result = await deleteListing(deleteId, trimmedReason)
      if (result.success) {
        setDeleteError(null)
        router.refresh()
        setDeleteId(null)
        return
      }

      setDeleteError(typeof result.error === "string" ? result.error : "Failed to delete listing")
    })
  }

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "seller", label: "Seller", render: (v: unknown) => (v as { full_name: string } | null)?.full_name || 'N/A' },
    { key: "species", label: "Species", sortable: true },
    { key: "breed", label: "Breed" },
    { key: "price", label: "Price", sortable: true, render: (v: unknown) => `$${Number(v).toFixed(2)}` },
    { key: "type", label: "Type", sortable: true },
    { key: "certification_tier", label: "Cert", sortable: true, render: (v: unknown) => (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
        v === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
        v === 'Silver' ? 'bg-gray-100 text-gray-700' :
        v === 'Verified' ? 'bg-blue-100 text-blue-700' :
        'bg-gray-100 text-gray-600'
      }`}>
        {String(v)}
      </span>
    )},
    { key: "status", label: "Status", sortable: true, render: (v: unknown) => (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
        v === 'Available' ? 'bg-green-100 text-green-700' :
        v === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
        'bg-gray-100 text-gray-600'
      }`}>
        {String(v)}
      </span>
    )},
    { key: "created_at", label: "Added", sortable: true, render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
  ]

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      <Link href={`/admin/marketplace/listings/${row.id as string}`} className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20">
        Edit
      </Link>
      <button
        onClick={() => {
          setDeleteError(null)
          setDeleteId(row.id as string)
        }}
        className="px-3 py-1 rounded-lg text-xs font-medium bg-error/10 text-error hover:bg-error/20"
      >
        Delete
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
          Pet Listings
        </h1>
        <p className="text-on-surface-variant">Manage all pet listings in the marketplace</p>
      </div>
      <DataTable columns={columns} data={listings} actions={actions} />
      {deleteError ? <p className="text-sm text-error">{deleteError}</p> : null}
      <ConfirmDialog
        open={!!deleteId}
        title="Delete Listing"
        message="Are you sure you want to delete this listing? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        showNotes
        notesPlaceholder="Reason for deletion (required)"
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteId(null)
          setDeleteError(null)
        }}
      />
    </div>
  )
}
