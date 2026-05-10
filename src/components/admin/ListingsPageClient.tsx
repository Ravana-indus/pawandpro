"use client"

import React from "react"
import { DataTable } from "@/components/DataTable"

interface ListingsPageClientProps {
  listings: Record<string, unknown>[]
}

export function ListingsPageClient({ listings }: ListingsPageClientProps) {
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
      <button className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20">
        Edit
      </button>
      <button className="px-3 py-1 rounded-lg text-xs font-medium bg-error/10 text-error hover:bg-error/20">
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
    </div>
  )
}
