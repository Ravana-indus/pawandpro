"use client"

import React from "react"
import Link from "next/link"
import { DataTable } from "@/components/DataTable"
import { StatusBadge } from "@/components/admin/StatusBadge"

interface BookingsPageClientProps {
  bookings: Record<string, unknown>[]
}

export function BookingsPageClient({ bookings }: BookingsPageClientProps) {
  const columns = [
    { key: "id", label: "ID", render: (v: unknown) => String(v).slice(0, 8) + '...' },
    { key: "service_type", label: "Service Type", sortable: true },
    { key: "provider", label: "Provider", render: (v: unknown) => (v as {full_name: string})?.full_name || 'N/A' },
    { key: "customer", label: "Customer", render: (v: unknown) => (v as {full_name: string})?.full_name || 'N/A' },
    { key: "pet", label: "Pet", render: (v: unknown) => (v as {name: string})?.name || 'N/A' },
    { key: "scheduled_at", label: "Date", sortable: true, render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
    { key: "status", label: "Status", render: (v: unknown) => <StatusBadge status={String(v)} /> },
    { key: "fee", label: "Fee", render: (v: unknown) => v ? `$${Number(v).toFixed(2)}` : 'N/A' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
          Service Bookings
        </h1>
        <p className="text-on-surface-variant">View and manage all service bookings</p>
      </div>
      <DataTable
        columns={columns}
        data={bookings}
        actions={(row) => (
          <Link
            href={`/admin/services/bookings/${row.id}`}
            className="text-primary hover:underline text-sm"
          >
            View
          </Link>
        )}
      />
    </div>
  )
}