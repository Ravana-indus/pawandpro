"use client"

import React from "react"
import { DataTable } from "@/components/DataTable"

interface CommentsPageClientProps {
  comments: Record<string, unknown>[]
}

export function CommentsPageClient({ comments }: CommentsPageClientProps) {
  const columns = [
    { key: "content", label: "Content", render: (v: unknown) => (
      <span className="line-clamp-2">{String(v)}</span>
    )},
    { key: "author", label: "Author", render: (v: unknown) => (v as {full_name: string})?.full_name || 'N/A' },
    { key: "post", label: "Post", render: (v: unknown) => (v as {title: string})?.title || 'N/A' },
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
          Community Comments
        </h1>
        <p className="text-on-surface-variant">Moderate and manage community comments</p>
      </div>
      <DataTable columns={columns} data={comments} actions={actions} />
    </div>
  )
}
