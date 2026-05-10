import React from "react"
import { listAdminModerationQueue } from "@/lib/admin/queries/trust-safety"
import { QueuePageClient } from "@/components/admin/QueuePageClient"

interface QueuePageProps {
  searchParams: Promise<{ page?: string; perPage?: string; status?: string; itemType?: string; sort?: string; direction?: string }>
}

export default async function QueuePage({ searchParams }: QueuePageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const perPage = Number(params.perPage) || 25
  const status = params.status || null
  const itemType = params.itemType || null
  const sort = params.sort || null
  const direction = params.direction || null

  const result = await listAdminModerationQueue({
    page,
    perPage,
    status,
    itemType,
    sort,
    direction,
  })

  return <QueuePageClient data={result.data || []} currentStatus={status || 'all'} total={result.total} page={page} perPage={perPage} />
}