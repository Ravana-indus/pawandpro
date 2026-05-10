"use client"

import React, { useTransition } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AdminDataTable } from "@/components/admin/AdminDataTable"
import { AdminFilterBar } from "@/components/admin/AdminFilterBar"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { cancelOrder } from "@/lib/actions/admin"
import type { AdminListResult } from "@/lib/admin/types"
import type { AdminOrderListItem } from "@/lib/admin/queries/marketplace"

interface OrdersPageClientProps {
  result: AdminListResult<AdminOrderListItem>
}

function StatusBadge({ status }: { status: string }) {
  const classes = status === 'Processing' ? 'bg-blue-100 text-blue-700' :
    status === 'In Transit' ? 'bg-yellow-100 text-yellow-700' :
    status === 'Delivered' ? 'bg-green-100 text-green-700' :
    'bg-red-100 text-red-700'
  return (
    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${classes}`}>
      {status}
    </span>
  )
}

const ORDER_STATUS_OPTIONS = [
  { value: "Processing", label: "Processing" },
  { value: "In Transit", label: "In Transit" },
  { value: "Delivered", label: "Delivered" },
  { value: "Cancelled", label: "Cancelled" },
]

const ORDER_SORT_OPTIONS = [
  { value: "created_at", label: "Created At" },
  { value: "total_amount", label: "Total Amount" },
  { value: "status", label: "Status" },
]

export function OrdersPageClient({ result }: OrdersPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false)
  const [orderToCancel, setOrderToCancel] = React.useState<string | null>(null)

  const columns = [
    { key: "id", label: "Order ID", render: (v: unknown) => String(v).slice(0, 8) + '...' },
    { key: "buyer", label: "Buyer", render: (v: unknown) => (v as { full_name: string } | null)?.full_name || 'N/A' },
    { key: "total_amount", label: "Total", sortable: true, render: (v: unknown) => `$${Number(v).toFixed(2)}` },
    { key: "status", label: "Status", sortable: true, render: (v: unknown) => <StatusBadge status={String(v)} /> },
    { key: "created_at", label: "Date", sortable: true, render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
  ]

  const handleCancelConfirm = () => {
    if (orderToCancel) {
      startTransition(async () => {
        await cancelOrder(orderToCancel)
        setCancelDialogOpen(false)
        setOrderToCancel(null)
        router.refresh()
      })
    }
  }

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      <Link
        href={`/admin/marketplace/orders/${row.id as string}`}
        className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20"
      >
        View
      </Link>
      <button
        onClick={() => {
          setOrderToCancel(row.id as string)
          setCancelDialogOpen(true)
        }}
        className="px-3 py-1 rounded-lg text-xs font-medium bg-error/10 text-error hover:bg-error/20"
      >
        Cancel
      </button>
    </div>
  )

  const queryEntries = Object.fromEntries(searchParams.entries())
  delete queryEntries.page

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
            Orders
          </h1>
          <p className="text-on-surface-variant">Manage all marketplace orders</p>
        </div>
        <AdminFilterBar
          basePath="/admin/marketplace/orders"
          searchPlaceholder="Search status, shipping, payment..."
          statusOptions={ORDER_STATUS_OPTIONS}
          sortOptions={ORDER_SORT_OPTIONS}
          defaults={{
            search: searchParams.get("search") ?? "",
            status: searchParams.get("status") ?? "",
            sort: searchParams.get("sort") ?? "created_at",
            direction: searchParams.get("direction") === "asc" ? "asc" : "desc",
            perPage: result.perPage,
          }}
        />
        <AdminDataTable
          columns={columns}
          data={result.data as Record<string, unknown>[]}
          actions={actions}
          pagination={{
            basePath: "/admin/marketplace/orders",
            page: result.page,
            totalPages: result.totalPages,
            query: queryEntries,
          }}
        />
      </div>
      <ConfirmDialog
        open={cancelDialogOpen}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmLabel="Cancel Order"
        cancelLabel="Keep Order"
        variant="warning"
        onConfirm={handleCancelConfirm}
        onCancel={() => {
          setCancelDialogOpen(false)
          setOrderToCancel(null)
        }}
      />
    </>
  )
}
