import React from "react"
import { getAuditLogs } from "@/lib/queries/admin"
import { AuditLogsPageClient } from "@/components/admin/AuditLogsPageClient"

interface AuditLogsPageProps {
  searchParams: Promise<{
    action?: string
    target_type?: string
    date_from?: string
    date_to?: string
    page?: string
  }>
}

export default async function AuditLogsPage({ searchParams }: AuditLogsPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const per_page = 50

  const result = await getAuditLogs({
    action: params.action || undefined,
    target_type: params.target_type || undefined,
    date_from: params.date_from || undefined,
    date_to: params.date_to || undefined,
  }, { page, per_page })

  return (
    <AuditLogsPageClient
      data={result.data || []}
      page={result.page ?? 1}
      per_page={result.per_page ?? 50}
      total={result.total ?? 0}
    />
  )
}