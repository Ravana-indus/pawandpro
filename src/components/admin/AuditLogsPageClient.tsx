"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/DataTable"

interface AuditLogsPageClientProps {
  data: Record<string, unknown>[]
  page: number
  per_page: number
  total: number
}

const ACTION_OPTIONS = [
  { value: "", label: "All Actions" },
  { value: "update_user", label: "Update User" },
  { value: "ban_user", label: "Ban User" },
  { value: "unban_user", label: "Unban User" },
  { value: "handle_verification", label: "Handle Verification" },
  { value: "create_product", label: "Create Product" },
  { value: "update_product", label: "Update Product" },
  { value: "delete_product", label: "Delete Product" },
  { value: "create_listing", label: "Create Listing" },
  { value: "update_listing", label: "Update Listing" },
  { value: "delete_listing", label: "Delete Listing" },
  { value: "update_order_status", label: "Update Order Status" },
  { value: "cancel_booking", label: "Cancel Booking" },
  { value: "approve_post", label: "Approve Post" },
  { value: "delete_post", label: "Delete Post" },
  { value: "approve_comment", label: "Approve Comment" },
  { value: "delete_comment", label: "Delete Comment" },
]

const TARGET_TYPE_OPTIONS = [
  { value: "", label: "All Target Types" },
  { value: "profiles", label: "User" },
  { value: "listings", label: "Listing" },
  { value: "products", label: "Product" },
  { value: "orders", label: "Order" },
  { value: "community_posts", label: "Post" },
  { value: "community_comments", label: "Comment" },
  { value: "seller_verifications", label: "Verification" },
]

export function AuditLogsPageClient({ data, page, per_page, total }: AuditLogsPageClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [filters, setFilters] = useState({
    action: "",
    target_type: "",
    date_from: "",
    date_to: "",
  })

  function updateQuery(key: string, value: string) {
    const params = new URLSearchParams(window.location.search)
    if (value) params.set(key, value)
    else params.delete(key)
    if (key !== "page") params.delete("page")
    startTransition(() => {
      router.push(`/admin/audit-logs?${params.toString()}`)
    })
  }

  function goToPage(newPage: number) {
    const params = new URLSearchParams(window.location.search)
    params.set("page", String(newPage))
    startTransition(() => {
      router.push(`/admin/audit-logs?${params.toString()}`)
    })
  }

  const columns = [
    { key: "created_at", label: "Timestamp", sortable: true, render: (v: unknown) => (
      new Date(String(v)).toLocaleString()
    )},
    { key: "action", label: "Action", sortable: true },
    { key: "target_type", label: "Target Type", render: (v: unknown) => (
      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-secondary/10 text-secondary uppercase">
        {String(v || 'N/A')}
      </span>
    )},
    { key: "target_id", label: "Target ID", render: (v: unknown) => v ? String(v).slice(0, 8) + '...' : 'N/A' },
    { key: "details", label: "Details", render: (v: unknown) => (
      <code className="text-xs bg-surface-container-low px-2 py-1 rounded">{JSON.stringify(v || {})}</code>
    )},
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
          Audit Logs
        </h1>
        <p className="text-on-surface-variant">Immutable record of all admin actions and sensitive operations</p>
      </div>

      <div className="flex gap-4 bg-surface-container-low p-4 rounded-xl flex-wrap">
        <select
          value={filters.action}
          onChange={(e) => {
            setFilters(f => ({ ...f, action: e.target.value }))
            updateQuery("action", e.target.value)
          }}
          className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20"
        >
          {ACTION_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={filters.target_type}
          onChange={(e) => {
            setFilters(f => ({ ...f, target_type: e.target.value }))
            updateQuery("target_type", e.target.value)
          }}
          className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20"
        >
          {TARGET_TYPE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <input
          type="date"
          value={filters.date_from}
          onChange={(e) => {
            setFilters(f => ({ ...f, date_from: e.target.value }))
            updateQuery("date_from", e.target.value)
          }}
          className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20"
        />
        <input
          type="date"
          value={filters.date_to}
          onChange={(e) => {
            setFilters(f => ({ ...f, date_to: e.target.value }))
            updateQuery("date_to", e.target.value)
          }}
          className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20"
        />
      </div>

      <DataTable
        columns={columns}
        data={data}
        isLoading={isPending}
        pagination={{
          page,
          perPage: per_page,
          total,
          onPageChange: goToPage,
        }}
      />
    </div>
  )
}