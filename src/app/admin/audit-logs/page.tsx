import React from "react"
import { listAdminAuditLogs } from "@/lib/admin/queries/platform"
import { AuditLogsPageClient } from "@/components/admin/AuditLogsPageClient"

interface AuditLogsPageProps {
  searchParams: Promise<{
    action?: string
    target_type?: string
    actor_id?: string
    date_from?: string
    date_to?: string
    page?: string
  }>
}

export default async function AuditLogsPage({ searchParams }: AuditLogsPageProps) {
  const params = await searchParams

  const result = await listAdminAuditLogs({
    action: params.action || undefined,
    targetType: params.target_type || undefined,
    actorId: params.actor_id || undefined,
    dateFrom: params.date_from || undefined,
    dateTo: params.date_to || undefined,
    page: params.page || undefined,
    perPage: 50,
  })

  return (
    <AuditLogsPageClient
      data={result.data || []}
      page={result.page ?? 1}
      per_page={result.perPage ?? 50}
      total={result.total ?? 0}
    />
  )
}