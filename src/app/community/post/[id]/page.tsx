import React from "react"
import { createClient } from "@/lib/supabase/server"
import { createComment } from "@/lib/actions/community"

export default async function PostPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: post } = await supabase
    .from('community_posts')
    .select('*, author:profiles!community_posts_author_id_fkey(full_name, avatar_url)')
    .eq('id', params.id)
    .single()

  const { data: comments } = await supabase
    .from('community_comments')
    .select('*, author:profiles!community_comments_author_id_fkey(full_name, avatar_url)')
    .eq('post_id', params.id)
    .order('created_at', { ascending: true })

  if (!post) return <div>Post not found</div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-surface-container-low p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 rounded-lg text-xs font-medium bg-secondary/10 text-secondary">{String(post.type)}</span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface mb-2">{post.title}</h1>
        <p className="text-on-surface mb-4">{post.content}</p>
        <div className="text-sm text-on-surface-variant">
          By {post.author?.full_name || 'Anonymous'} • {new Date(String(post.created_at)).toLocaleDateString()}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-on-surface">Comments ({comments?.length || 0})</h2>
        {comments?.map(comment => (
          <div key={comment.id} className="bg-surface-container-low p-4 rounded-xl">
            <div className="text-sm text-on-surface-variant mb-1">{comment.author?.full_name}</div>
            <p className="text-on-surface">{comment.content}</p>
          </div>
        ))}

        {user && (
          <form action={createComment} className="space-y-2">
            <input type="hidden" name="postId" value={post.id} />
            <textarea name="content" rows={3} required placeholder="Write a comment..." className="w-full px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20" />
            <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-on-primary font-medium hover:bg-primary/90">
              Post Comment
            </button>
          </form>
        )}
      </div>
    </div>
  )
}