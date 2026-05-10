"use client"

import React from "react"
import { DataTable } from "@/components/DataTable"

interface OrdersPageClientProps {
  orders: Record<string, unknown>[]
}

export function OrdersPageClient({ orders }: OrdersPageClientProps) {
  const columns = [
    { key: "id", label: "Order ID", render: (v: unknown) => String(v).slice(0, 8) + '...' },
    { key: "buyer", label: "Buyer", render: (v: unknown) => (v as { full_name: string } | null)?.full_name || 'N/A' },
    { key: "total_amount", label: "Total", sortable: true, render: (v: unknown) => `$${Number(v).toFixed(2)}` },
    { key: "status", label: "Status", sortable: true, render: (v: unknown) => (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
        v === 'Processing' ? 'bg-blue-100 text-blue-700' :
        v === 'In Transit' ? 'bg-yellow-100 text-yellow-700' :
        v === 'Delivered' ? 'bg-green-100 text-green-700' :
        'bg-red-100 text-red-700'
      }`}>
        {String(v)}
      </span>
    )},
    { key: "created_at", label: "Date", sortable: true, render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
  ]

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      <button className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20">
        View
      </button>
      <button className="px-3 py-1 rounded-lg text-xs font-medium bg-error/10 text-error hover:bg-error/20">
        Cancel
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
          Orders
        </h1>
        <p className="text-on-surface-variant">Manage all marketplace orders</p>
      </div>
      <DataTable columns={columns} data={orders} actions={actions} />
    </div>
  )
}
