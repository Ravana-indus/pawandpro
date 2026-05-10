"use client"

import type React from "react"

import { DataTable } from "@/components/DataTable"

type AdminDataTableProps = React.ComponentProps<typeof DataTable>

export function AdminDataTable(props: AdminDataTableProps) {
  return <DataTable {...props} />
}
