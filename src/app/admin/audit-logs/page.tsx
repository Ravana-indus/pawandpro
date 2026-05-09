import React from "react"
import { DataTable } from "@/components/DataTable"
import { getAuditLogs } from "@/lib/queries/admin"

export default async function AuditLogsPage() {
  const result = await getAuditLogs({}, { page: 1, per_page: 50 })

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

      <div className="flex gap-4 bg-surface-container-low p-4 rounded-xl">
        <select className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <option value="">All Actions</option>
          <option value="suspend_user">Suspend User</option>
          <option value="ban_user">Ban User</option>
          <option value="change_user_role">Change Role</option>
          <option value="approve_verification">Approve Verification</option>
          <option value="reject_verification">Reject Verification</option>
        </select>
        <select className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <option value="">All Target Types</option>
          <option value="user">User</option>
          <option value="listing">Listing</option>
          <option value="product">Product</option>
          <option value="post">Post</option>
        </select>
        <input
          type="date"
          className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20"
        />
        <input
          type="date"
          className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20"
        />
      </div>

      <DataTable
        columns={columns}
        data={result.data || []}
        pagination={{
          page: result.page,
          perPage: result.per_page,
          total: result.total,
          onPageChange: () => {}
        }}
      />
    </div>
  )
}