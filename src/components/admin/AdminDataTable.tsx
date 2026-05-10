"use client"

import type React from "react"

import { DataTable } from "@/components/DataTable"
import { AdminPagination } from "@/components/admin/AdminPagination"

type AdminDataTableProps = React.ComponentProps<typeof DataTable> & {
  pagination?: {
    basePath: string
    page: number
    totalPages: number
    query?: Record<string, string | number | null | undefined>
  }
}

export function AdminDataTable({ pagination, ...props }: AdminDataTableProps) {
  return (
    <div className="space-y-4">
      <DataTable {...props} />
      {pagination ? (
        <AdminPagination
          basePath={pagination.basePath}
          page={pagination.page}
          totalPages={pagination.totalPages}
          query={pagination.query}
        />
      ) : null}
    </div>
  )
}
