"use client"

import React from "react"
import { DataTable } from "@/components/DataTable"

interface ProvidersPageClientProps {
  data: Record<string, unknown>[]
}

export function ProvidersPageClient({ data }: ProvidersPageClientProps) {
  const columns = [
    { key: "full_name", label: "Name", sortable: true, render: (_: unknown, row: Record<string, unknown>) => ((row.profile as {full_name: string})?.full_name || 'N/A') },
    { key: "service_type", label: "Service Type", sortable: true },
    { key: "specialization", label: "Specialization" },
    { key: "is_verified", label: "Verified", render: (v: unknown) => (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${v ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
        {v ? 'Verified' : 'Pending'}
      </span>
    )},
    { key: "service_fee", label: "Fee", render: (v: unknown) => v ? `$${Number(v).toFixed(2)}` : 'N/A' },
    { key: "is_available_now", label: "Available", render: (v: unknown) => (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${v ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
        {v ? 'Yes' : 'No'}
      </span>
    )},
  ]

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      <button className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20">
        View
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
          Service Providers
        </h1>
        <p className="text-on-surface-variant">Manage groomers, trainers, and transporters</p>
      </div>
      <DataTable columns={columns} data={data} actions={actions} />
    </div>
  )
}
