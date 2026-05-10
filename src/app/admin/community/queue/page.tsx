import React from "react"
import { getModerationQueue } from "@/lib/queries/admin"
import { QueuePageClient } from "@/components/admin/QueuePageClient"

interface QueuePageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function QueuePage({ searchParams }: QueuePageProps) {
  const params = await searchParams
  const status = params.status || "all"
  const result = await getModerationQueue(status)

  return <QueuePageClient data={result.data || []} currentStatus={status} />
}