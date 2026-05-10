import React from "react"
import { getAuditLogs } from "@/lib/queries/admin"
import { AuditLogsPageClient } from "@/components/admin/AuditLogsPageClient"

export default async function AuditLogsPage() {
  const result = await getAuditLogs({}, { page: 1, per_page: 50 })

  return (
    <AuditLogsPageClient
      data={result.data || []}
      page={result.page ?? 1}
      per_page={result.per_page ?? 50}
      total={result.total ?? 0}
    />
  )
}
