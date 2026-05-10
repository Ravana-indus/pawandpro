import React from 'react'
import { listAdminVerifications } from '@/lib/admin/queries/trust-safety'
import { VerificationsPageClient } from '@/components/admin/VerificationsPageClient'

interface VerificationsPageProps {
  searchParams: Promise<{ page?: string; perPage?: string; search?: string; status?: string }>
}

export default async function VerificationsPage({ searchParams }: VerificationsPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const perPage = Number(params.perPage) || 25
  const search = params.search || null
  const status = params.status || null

  const result = await listAdminVerifications({
    page,
    perPage,
    search,
    status,
  })

  return <VerificationsPageClient data={result.data || []} total={result.total} page={page} perPage={perPage} filters={{ search, status }} />
}