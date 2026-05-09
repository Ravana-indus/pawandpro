import React from "react"
import { DataTable } from "@/components/DataTable"
import { getAdoptionCenters } from "@/lib/queries/admin"

export default async function AdoptionPage() {
  const result = await getAdoptionCenters()

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "type", label: "Type", sortable: true },
    { key: "address", label: "Address" },
    { key: "is_verified", label: "Verified", render: (v: unknown) => (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${v ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
        {v ? 'Verified' : 'Pending'}
      </span>
    )},
    { key: "created_at", label: "Added", sortable: true, render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
  ]

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      <button className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20">
        View
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
          Adoption Centers
        </h1>
        <p className="text-on-surface-variant">Manage adoption center verifications and listings</p>
      </div>
      <DataTable columns={columns} data={result.data || []} actions={actions} />
    </div>
  )
}