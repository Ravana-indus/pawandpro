"use client"

import React, { useTransition } from "react"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/DataTable"
import { ActionReasonDialog } from "@/components/admin/ActionReasonDialog"
import { removeAdminComment } from "@/lib/admin/mutations/trust-safety"

interface CommentsPageClientProps {
  comments: Record<string, unknown>[]
  total?: number
  page?: number
  perPage?: number
  filters?: { search?: string | null; isApproved?: string | null }
}

export function CommentsPageClient({ comments, total, page = 1, perPage = 25, filters }: CommentsPageClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function goToPage(newPage: number) {
    const params = new URLSearchParams(window.location.search)
    params.set('page', String(newPage))
    startTransition(() => {
      router.push(`/admin/community/comments?${params.toString()}`)
    })
  }

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
      <ActionReasonDialog
        triggerLabel="Delete"
        title="Delete Comment"
        description="This action requires a reason and will be logged."
        confirmLabel="Delete"
        confirmVariant="destructive"
        onConfirm={async (reason) => {
          const result = await removeAdminComment(row.id as string, reason)
          if (result?.success) {
            router.refresh()
            return { success: true }
          }
          return { success: false, error: result?.error }
        }}
      />
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
      {filters && (
        <div className="flex gap-4 bg-surface-container-low p-4 rounded-xl">
          <input
            type="search"
            placeholder="Search comments..."
            defaultValue={filters.search || ''}
            onChange={(e) => {
              const v = e.target.value
              const params = new URLSearchParams(window.location.search)
              if (v.length > 2 || v === '') params.set('search', v)
              else params.delete('search')
              params.delete('page')
              startTransition(() => {
                router.push(`/admin/community/comments?${params.toString()}`)
              })
            }}
            className="flex-1 px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20"
          />
          <select
            value={filters.isApproved || ''}
            onChange={(e) => {
              const params = new URLSearchParams(window.location.search)
              if (e.target.value) params.set('isApproved', e.target.value)
              else params.delete('isApproved')
              params.delete('page')
              startTransition(() => {
                router.push(`/admin/community/comments?${params.toString()}`)
              })
            }}
            className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20"
          >
            <option value="">All Status</option>
            <option value="true">Approved</option>
            <option value="false">Pending</option>
          </select>
        </div>
      )}
      <DataTable
        columns={columns}
        data={comments}
        actions={actions}
        isLoading={isPending}
        pagination={total !== undefined ? { page, perPage, total, onPageChange: goToPage } : undefined}
      />
    </div>
  )
}