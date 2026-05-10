"use client"

import React from "react"
import { DataTable } from "@/components/DataTable"

interface QueuePageClientProps {
  data: Record<string, unknown>[]
}

export function QueuePageClient({ data }: QueuePageClientProps) {
  const columns = [
    { key: "item_type", label: "Type", sortable: true, render: (v: unknown) => (
      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-secondary/10 text-secondary uppercase">
        {String(v)}
      </span>
    )},
    { key: "item_id", label: "Item ID", render: (v: unknown) => String(v).slice(0, 8) + '...' },
    { key: "flagged_by", label: "Flagged By", render: (v: unknown) => (v as {full_name: string})?.full_name || 'N/A' },
    { key: "flag_reason", label: "Reason" },
    { key: "created_at", label: "Flagged", sortable: true, render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
    { key: "status", label: "Status", render: (v: unknown) => (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${v === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
        {String(v)}
      </span>
    )},
  ]

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      <button className="px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200">
        Dismiss
      </button>
      <button className="px-3 py-1 rounded-lg text-xs font-medium bg-warning/10 text-warning hover:bg-warning/20">
        Review
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
          Moderation Queue
        </h1>
        <p className="text-on-surface-variant">Review flagged content requiring moderation</p>
      </div>
      <DataTable columns={columns} data={data} actions={actions} />
    </div>
  )
}
