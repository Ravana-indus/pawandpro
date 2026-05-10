import React from 'react'
import { listAdminUsers } from '@/lib/admin/queries/trust-safety'
import { UsersPageClient } from '@/components/admin/UsersPageClient'

interface UsersPageProps {
  searchParams: Promise<{ page?: string; perPage?: string; role?: string; status?: string; search?: string; sort?: string; direction?: string }>
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const perPage = Number(params.perPage) || 25
  const role = params.role || null
  const status = params.status || null
  const search = params.search || null
  const sort = params.sort || null
  const direction = params.direction || null

  const result = await listAdminUsers({
    page,
    perPage,
    role,
    status,
    search,
    sort,
    direction,
  })

  return (
    <UsersPageClient
      users={result.data || []}
      total={result.total}
      page={page}
      perPage={perPage}
      filters={{ role, status, search }}
    />
  )
}