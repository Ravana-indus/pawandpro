"use client"

import React from "react"
import { DataTable } from "@/components/DataTable"

interface VerificationsPageClientProps {
  data: Record<string, unknown>[]
  total: number
}

export function VerificationsPageClient({ data, total }: VerificationsPageClientProps) {
  const columns = [
    { key: "full_name", label: "Name", sortable: true },
    { key: "contact_email", label: "Email", sortable: true },
    { key: "role", label: "Role", sortable: true },
    { key: "verification_status", label: "Status", render: (v: unknown) => (
      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-yellow-100 text-yellow-700">
        {String(v || 'pending')}
      </span>
    )},
    { key: "created_at", label: "Submitted", sortable: true, render: (v: unknown) => (
      new Date(String(v)).toLocaleDateString()
    )},
  ]

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      <button className="px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200">
        Approve
      </button>
      <button className="px-3 py-1 rounded-lg text-xs font-medium bg-error/10 text-error hover:bg-error/20">
        Reject
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
          Verification Queue
        </h1>
        <p className="text-on-surface-variant">Review and approve verification requests from sellers, vets, and service providers</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface-container-low p-4 rounded-xl">
          <div className="text-2xl font-bold text-on-surface">{data.length || 0}</div>
          <div className="text-sm text-on-surface-variant">Pending Reviews</div>
        </div>
        <div className="bg-surface-container-low p-4 rounded-xl">
          <div className="text-2xl font-bold text-on-surface">0</div>
          <div className="text-sm text-on-surface-variant">Approved Today</div>
        </div>
        <div className="bg-surface-container-low p-4 rounded-xl">
          <div className="text-2xl font-bold text-on-surface">0</div>
          <div className="text-sm text-on-surface-variant">Rejected Today</div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        actions={actions}
        pagination={{
          page: 1,
          perPage: 25,
          total,
          onPageChange: () => {}
        }}
      />
    </div>
  )
}
