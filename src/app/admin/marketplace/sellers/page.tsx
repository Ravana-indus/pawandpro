import React from 'react'
import { getUsers } from '@/lib/queries/admin'
import { SellersPageClient } from '@/components/admin/SellersPageClient'

interface SellersPageProps {
  searchParams: Promise<{ role?: string; status?: string; search?: string; page?: string }>
}

const SELLER_ROLES = ['BREEDER', 'INDIVIDUAL_SELLER', 'ADOPTION_PROVIDER', 'SELLER'] as const

export default async function SellersPage({ searchParams }: SellersPageProps) {
  const params = await searchParams
  const filters = {
    role: params.role as typeof SELLER_ROLES[number] | undefined,
    status: params.status as 'active' | 'banned' | 'pending' | undefined,
    search: params.search,
  }
  const page = Number(params.page) || 1
  const result = await getUsers(filters, { page, per_page: 25 })

  return <SellersPageClient initialData={result.data || []} total={result.total} page={page} filters={filters} />
}
