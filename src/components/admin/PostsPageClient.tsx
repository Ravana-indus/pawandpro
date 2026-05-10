"use client"

import React, { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/DataTable"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { removeAdminPost } from "@/lib/admin/mutations/trust-safety"
import { approvePost, deletePost, togglePinPost } from "@/lib/actions/admin"

interface PostsPageClientProps {
  data: Record<string, unknown>[]
  total?: number
  page?: number
  perPage?: number
  filters?: { search?: string | null; isApproved?: string | null; type?: string | null }
}

export function PostsPageClient({ data, total, page = 1, perPage = 25, filters }: PostsPageClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function goToPage(newPage: number) {
    const params = new URLSearchParams(window.location.search)
    params.set('page', String(newPage))
    startTransition(() => {
      router.push(`/admin/community/posts?${params.toString()}`)
    })
  }

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(window.location.search)
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    startTransition(() => {
      router.push(`/admin/community/posts?${params.toString()}`)
    })
  }

  const handleApprove = (id: string) => {
    startTransition(async () => {
      await approvePost(id)
      router.refresh()
    })
  }

  const handleTogglePin = (id: string, isPinned: boolean) => {
    startTransition(async () => {
      await togglePinPost(id, !isPinned)
      router.refresh()
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await removeAdminPost(id, 'Deleted by admin')
      setDeleteId(null)
      router.push('/admin/community/posts')
    })
  }

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
      {row.is_approved ? (
        <span className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-500">
          Approved
        </span>
      ) : (
        <button
          onClick={() => handleApprove(row.id as string)}
          disabled={isPending}
          className="px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
        >
          Approve
        </button>
      )}
      <button
        onClick={() => handleTogglePin(row.id as string, Boolean(row.is_pinned))}
        disabled={isPending}
        className={`px-3 py-1 rounded-lg text-xs font-medium ${row.is_pinned ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} disabled:opacity-50`}
      >
        {row.is_pinned ? 'Unpin' : 'Pin'}
      </button>
      <button
        onClick={() => setDeleteId(row.id as string)}
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
          Community Posts
        </h1>
        <p className="text-on-surface-variant">Moderate and manage community posts</p>
      </div>
      {filters && (
        <div className="flex gap-4 bg-surface-container-low p-4 rounded-xl">
          <input
            type="search"
            placeholder="Search posts..."
            defaultValue={filters.search || ''}
            onChange={(e) => {
              const v = e.target.value
              if (v.length > 2 || v === '') updateFilter('search', v)
            }}
            className="flex-1 px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20"
          />
          <select
            value={filters.isApproved || ''}
            onChange={(e) => updateFilter('isApproved', e.target.value)}
            className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20"
          >
            <option value="">All Status</option>
            <option value="true">Approved</option>
            <option value="false">Pending</option>
          </select>
          <select
            value={filters.type || ''}
            onChange={(e) => updateFilter('type', e.target.value)}
            className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20"
          >
            <option value="">All Types</option>
            <option value="General">General</option>
            <option value="Question">Question</option>
            <option value="Advice">Advice</option>
            <option value="Story">Story</option>
          </select>
        </div>
      )}
      <DataTable columns={columns} data={data} actions={actions} isLoading={isPending} pagination={total !== undefined ? { page, perPage, total, onPageChange: goToPage } : undefined} />
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel="Delete"
        variant="warning"
        onConfirm={() => deleteId && handleDelete(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}