"use client"

import React, { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/DataTable"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { approveComment, deleteComment } from "@/lib/actions/admin"

interface CommentsPageClientProps {
  comments: Record<string, unknown>[]
}

export function CommentsPageClient({ comments }: CommentsPageClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; content: string } | null>(null)

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
      {!row.is_approved ? (
        <button
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await approveComment(row.id as string)
              router.refresh()
            })
          }}
          className="px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
        >
          Approve
        </button>
      ) : (
        <span className="px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700">
          Approved
        </span>
      )}
      <button
        onClick={() => setDeleteTarget({ id: row.id as string, content: String(row.content).slice(0, 50) })}
        className="px-3 py-1 rounded-lg text-xs font-medium bg-warning/10 text-warning hover:bg-warning/20"
      >
        Delete
      </button>
    </div>
  )

  return (
    <>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Comment"
        message={`Are you sure you want to delete this comment? "${deleteTarget?.content}..."`}
        confirmLabel="Delete"
        variant="warning"
        onConfirm={async () => {
          if (deleteTarget) {
            startTransition(async () => {
              await deleteComment(deleteTarget.id)
              setDeleteTarget(null)
              router.refresh()
            })
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
            Community Comments
          </h1>
          <p className="text-on-surface-variant">Moderate and manage community comments</p>
        </div>
        <DataTable columns={columns} data={comments} actions={actions} />
      </div>
    </>
  )
}
