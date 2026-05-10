import React from "react"
import { getCommunityPosts } from "@/lib/queries/admin"
import { PostsPageClient } from "@/components/admin/PostsPageClient"

export default async function PostsPage() {
  const result = await getCommunityPosts({ approved: undefined })

  return (
    <PostsPageClient data={result.data || []} />
  )
}
