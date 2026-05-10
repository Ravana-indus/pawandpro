import React from "react"
import { listAdminPosts } from "@/lib/admin/queries/trust-safety"
import { PostsPageClient } from "@/components/admin/PostsPageClient"

interface PostsPageProps {
  searchParams: Promise<{ page?: string; perPage?: string; search?: string; isApproved?: string; type?: string; sort?: string; direction?: string }>
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const perPage = Number(params.perPage) || 25
  const search = params.search || null
  const isApproved = params.isApproved || null
  const type = params.type || null
  const sort = params.sort || null
  const direction = params.direction || null

  const result = await listAdminPosts({
    page,
    perPage,
    search,
    isApproved,
    type,
    sort,
    direction,
  })

  return (
    <PostsPageClient data={result.data || []} total={result.total} page={page} perPage={perPage} filters={{ search, isApproved, type }} />
  )
}
