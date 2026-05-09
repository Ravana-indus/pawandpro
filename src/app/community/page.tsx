import React from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getCommunityPosts } from "@/lib/queries/admin"

export default async function CommunityPage() {
  const result = await getCommunityPosts({ approved: true })
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-extrabold text-on-surface">Community</h1>
        {user && (
          <Link href="/community/new" className="px-4 py-2 rounded-xl bg-primary text-on-primary font-medium hover:bg-primary/90">
            Create Post
          </Link>
        )}
      </div>

      <div className="flex gap-2">
        <button className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-medium">All</button>
        <button className="px-4 py-2 rounded-xl bg-surface-container-low text-on-surface-variant font-medium hover:bg-surface-container-high">Discussion</button>
        <button className="px-4 py-2 rounded-xl bg-surface-container-low text-on-surface-variant font-medium hover:bg-surface-container-high">Questions</button>
        <button className="px-4 py-2 rounded-xl bg-surface-container-low text-on-surface-variant font-medium hover:bg-surface-container-high">Stories</button>
      </div>

      <div className="space-y-4">
        {result.data?.map(post => (
          <Link key={post.id} href={`/community/post/${post.id}`} className="block bg-surface-container-low p-6 rounded-2xl hover:bg-surface-container-high">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded-lg text-xs font-medium bg-secondary/10 text-secondary">{String(post.type)}</span>
              {post.is_pinned && (
                <span className="px-2 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary">Pinned</span>
              )}
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-1">{post.title}</h3>
            <p className="text-on-surface-variant line-clamp-2">{post.content}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-on-surface-variant">
              <span>{post.author?.full_name || 'Anonymous'}</span>
              <span>{new Date(String(post.created_at)).toLocaleDateString()}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}