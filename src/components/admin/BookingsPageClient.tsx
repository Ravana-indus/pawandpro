"use client"

import React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AdminDataTable } from "@/components/admin/AdminDataTable"
import { AdminFilterBar } from "@/components/admin/AdminFilterBar"
import { StatusBadge } from "@/components/admin/StatusBadge"
import type { AdminListResult } from "@/lib/admin/types"
import type { AdminBookingListItem } from "@/lib/admin/queries/services"

interface BookingsPageClientProps {
  result: AdminListResult<AdminBookingListItem>
}

const BOOKING_STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
]

const BOOKING_SORT_OPTIONS = [
  { value: "scheduled_at", label: "Scheduled At" },
  { value: "created_at", label: "Created At" },
  { value: "service_type", label: "Service Type" },
  { value: "status", label: "Status" },
  { value: "fee", label: "Fee" },
]

export function BookingsPageClient({ result }: BookingsPageClientProps) {
  const searchParams = useSearchParams()
  const queryEntries = Object.fromEntries(searchParams.entries())
  delete queryEntries.page

  const columns = [
    { key: "id", label: "ID", render: (v: unknown) => String(v).slice(0, 8) + '...' },
    { key: "service_type", label: "Service Type", sortable: true },
    { key: "provider", label: "Provider", render: (v: unknown) => (v as { full_name: string })?.full_name || 'N/A' },
    { key: "customer", label: "Customer", render: (v: unknown) => (v as { full_name: string })?.full_name || 'N/A' },
    { key: "pet", label: "Pet", render: (v: unknown) => (v as { name: string })?.name || 'N/A' },
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
      <AdminFilterBar
        basePath="/admin/services/bookings"
        searchPlaceholder="Search service type, notes, or status..."
        statusOptions={BOOKING_STATUS_OPTIONS}
        sortOptions={BOOKING_SORT_OPTIONS}
        defaults={{
          search: searchParams.get("search") ?? "",
          status: searchParams.get("status") ?? "",
          sort: searchParams.get("sort") ?? "scheduled_at",
          direction: searchParams.get("direction") === "asc" ? "asc" : "desc",
          perPage: result.perPage,
        }}
      />
      <AdminDataTable
        columns={columns}
        data={result.data as Record<string, unknown>[]}
        actions={(row) => (
          <Link
            href={`/admin/services/bookings/${row.id}`}
            className="text-primary hover:underline text-sm"
          >
            View
          </Link>
        )}
        pagination={{
          basePath: "/admin/services/bookings",
          page: result.page,
          totalPages: result.totalPages,
          query: queryEntries,
        }}
      />
    </div>
  )
}
