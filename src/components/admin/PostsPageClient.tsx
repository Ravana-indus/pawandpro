"use client"

import React from "react"
import { DataTable } from "@/components/DataTable"

interface PostsPageClientProps {
  data: Record<string, unknown>[]
}

export function PostsPageClient({ data }: PostsPageClientProps) {
  const columns = [
    { key: "title", label: "Title", sortable: true },
    { key: "author", label: "Author", render: (v: unknown) => (v as {full_name: string})?.full_name || 'N/A' },
    { key: "type", label: "Type", sortable: true },
    { key: "is_pinned", label: "Pinned", render: (v: unknown) => (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${v ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'}`}>
        {v ? 'Pinned' : 'No'}
      </span>
    )},
    { key: "is_approved", label: "Status", render: (v: unknown) => (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${v ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
        {v ? 'Approved' : 'Pending'}
      </span>
    )},
    { key: "created_at", label: "Posted", sortable: true, render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
  ]

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      {!row.is_approved && (
        <button className="px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200">
          Approve
        </button>
      )}
      <button className="px-3 py-1 rounded-lg text-xs font-medium bg-error/10 text-error hover:bg-error/20">
        Delete
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
          Community Posts
        </h1>
        <p className="text-on-surface-variant">Moderate and manage community posts</p>
      </div>
      <DataTable columns={columns} data={data} actions={actions} />
    </div>
  )
}
