"use client"

import React, { useTransition } from "react"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/DataTable"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { resolveModerationItem } from "@/lib/actions/admin"

interface QueuePageClientProps {
  data: Record<string, unknown>[]
  currentStatus?: string
}

export function QueuePageClient({ data, currentStatus = "all" }: QueuePageClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [removeItemId, setRemoveItemId] = React.useState<string | null>(null)

  const tabs = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "dismissed", label: "Dismissed" },
    { key: "removed", label: "Removed" },
    { key: "reviewed", label: "Reviewed" },
  ]

  function updateStatus(status: string) {
    startTransition(() => {
      const params = new URLSearchParams(window.location.search)
      if (status !== "all") params.set("status", status)
      else params.delete("status")
      router.push(`/admin/community/queue?${params.toString()}`)
    })
  }

  async function handleAction(itemId: string, action: "dismiss" | "review" | "remove", notes?: string) {
    const formData = new FormData()
    formData.append("itemId", itemId)
    formData.append("action", action)
    if (notes) formData.append("notes", notes)
    await resolveModerationItem(formData)
    router.refresh()
  }

  async function handleRemove(notes?: string) {
    if (!removeItemId) return
    await handleAction(removeItemId, "remove", notes)
    setRemoveItemId(null)
  }

  const columns = [
    { key: "item_type", label: "Type", sortable: true, render: (v: unknown) => (
      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-secondary/10 text-secondary uppercase">
        {String(v)}
      </span>
    )},
    { key: "item_id", label: "Item ID", render: (v: unknown) => String(v).slice(0, 8) + '...' },
    { key: "reason", label: "Reason" },
    { key: "created_at", label: "Flagged", sortable: true, render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
    { key: "status", label: "Status", render: (v: unknown) => <StatusBadge status={String(v)} /> },
  ]

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      <button
        onClick={() => startTransition(() => handleAction(row.id as string, "dismiss"))}
        className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
      >
        Dismiss
      </button>
      <button
        onClick={() => startTransition(() => handleAction(row.id as string, "review"))}
        className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
      >
        Review
      </button>
      <button
        onClick={() => setRemoveItemId(row.id as string)}
        className="px-3 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200"
      >
        Remove
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

      <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => updateStatus(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentStatus === tab.key
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <DataTable columns={columns} data={data} actions={actions} isLoading={isPending} />

      <ConfirmDialog
        open={!!removeItemId}
        title="Remove Content"
        message="This action will remove the flagged content. Provide notes about the reason for removal."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        variant="warning"
        showNotes
        notesPlaceholder="Reason for removal..."
        onConfirm={(notes) => handleRemove(notes)}
        onCancel={() => setRemoveItemId(null)}
      />
    </div>
  )
}