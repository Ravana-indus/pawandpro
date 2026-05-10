import React from "react"
import { createClient } from "@/lib/supabase/server"
import { CommentsPageClient } from "@/components/admin/CommentsPageClient"

export default async function CommentsPage() {
  const supabase = await createClient()
  const { data: comments } = await supabase
    .from('community_comments')
    .select(`
      *,
      author:profiles!community_comments_author_id_fkey(full_name),
      post:community_posts!community_comments_post_id_fkey(title)
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <CommentsPageClient comments={comments || []} />
  )
}
