import React from 'react'
import { listAdminComments } from '@/lib/admin/queries/trust-safety'
import { CommentsPageClient } from '@/components/admin/CommentsPageClient'

interface CommentsPageProps {
  searchParams: Promise<{ page?: string; perPage?: string; search?: string; isApproved?: string }>
}

export default async function CommentsPage({ searchParams }: CommentsPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const perPage = Number(params.perPage) || 25
  const search = params.search || null
  const isApproved = params.isApproved || null

  const result = await listAdminComments({
    page,
    perPage,
    search,
    isApproved,
  })

  return (
    <CommentsPageClient
      comments={result.data || []}
      total={result.total}
      page={page}
      perPage={perPage}
      filters={{ search, isApproved }}
    />
  )
}
