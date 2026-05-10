import React from 'react'
import { getUsers } from '@/lib/queries/admin'
import { UsersPageClient } from '@/components/admin/UsersPageClient'

interface UsersPageProps {
  searchParams: Promise<{ role?: string; status?: string; search?: string; page?: string }>
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams
  const filters = {
    role: params.role as 'CUSTOMER' | 'BREEDER' | 'INDIVIDUAL_SELLER' | 'VET' | 'ADOPTION_PROVIDER' | undefined,
    status: params.status as 'active' | 'banned' | 'pending' | undefined,
    search: params.search,
  }
  const page = Number(params.page) || 1
  const result = await getUsers(filters, { page, per_page: 25 })

  return <UsersPageClient initialData={result.data || []} total={result.total} page={page} filters={filters} />
}