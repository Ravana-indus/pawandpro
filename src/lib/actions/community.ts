'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const type = formData.get('type') as string || 'discussion'

  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      author_id: user.id,
      title,
      content,
      type,
      is_approved: true
    })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/community')
  revalidatePath('/dashboard')
  return { success: true, post: data }
}

export async function updatePost(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const id = formData.get('id') as string
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const type = formData.get('type') as string

  const { data: post } = await supabase
    .from('community_posts')
    .select('author_id')
    .eq('id', id)
    .single()

  if (!post || post.author_id !== user.id) {
    return { error: 'Not authorized to edit this post' }
  }

  const { error } = await supabase
    .from('community_posts')
    .update({
      title,
      content,
      type,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/community')
  revalidatePath(`/community/post/${id}`)
  return { success: true }
}

export async function deletePost(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const id = formData.get('id') as string

  const { data: post } = await supabase
    .from('community_posts')
    .select('author_id')
    .eq('id', id)
    .single()

  if (!post || post.author_id !== user.id) {
    return { error: 'Not authorized to delete this post' }
  }

  const { error } = await supabase
    .from('community_posts')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/community')
  return redirect('/community')
}

export async function createComment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const postId = formData.get('postId') as string
  const content = formData.get('content') as string
  const parentCommentId = formData.get('parent_comment_id') as string || null

  const { data, error } = await supabase
    .from('community_comments')
    .insert({
      post_id: postId,
      author_id: user.id,
      content,
      parent_comment_id: parentCommentId,
      is_approved: true
    })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath(`/community/post/${postId}`)
  revalidatePath('/community')
  return { success: true, comment: data }
}

export async function updateComment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const id = formData.get('id') as string
  const content = formData.get('content') as string

  const { data: comment } = await supabase
    .from('community_comments')
    .select('author_id')
    .eq('id', id)
    .single()

  if (!comment || comment.author_id !== user.id) {
    return { error: 'Not authorized to edit this comment' }
  }

  const { error } = await supabase
    .from('community_comments')
    .update({
      content,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/community')
  return { success: true }
}

export async function deleteComment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const id = formData.get('id') as string

  const { data: comment } = await supabase
    .from('community_comments')
    .select('author_id')
    .eq('id', id)
    .single()

  if (!comment || comment.author_id !== user.id) {
    return { error: 'Not authorized to delete this comment' }
  }

  const { error } = await supabase
    .from('community_comments')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/community')
  return { success: true }
}

export async function flagContent(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const itemType = formData.get('itemType') as string
  const itemId = formData.get('itemId') as string
  const reason = formData.get('reason') as string

  const { error } = await supabase
    .from('moderation_queue')
    .insert({
      item_type: itemType,
      item_id: itemId,
      flagged_by: user.id,
      flag_reason: reason,
      status: 'pending'
    })

  if (error) return { error: error.message }

  return { success: true }
}