# Admin CRUD — Phase 4: Community Moderation + Audit Logs

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Build detail pages for Posts, Comments, Moderation Queue. Wire list pages with real moderation actions. Add working filters to Audit Logs.

**Depends on:** Phase 1 (admin.ts actions, reusable components)

**Tech Stack:** Next.js 15 App Router, React Server Components, Supabase, Tailwind CSS

---

## New/Modified Files

```
src/
  app/admin/
    community/
      posts/
        [id]/page.tsx              # NEW — Post detail with content preview
      comments/
        [id]/page.tsx              # NEW — Comment detail
      queue/
        [id]/page.tsx              # NEW — Moderation item detail
    audit-logs/
      page.tsx                     # MODIFIED — Wire filters
  components/admin/
    PostsPageClient.tsx            # MODIFIED — Wire Approve/Delete/Pin
    CommentsPageClient.tsx         # MODIFIED — Wire Approve/Delete
    QueuePageClient.tsx            # MODIFIED — Wire Dismiss/Review
    AuditLogsPageClient.tsx        # MODIFIED — Wire filters
  lib/queries/admin.ts             # MODIFIED — Add getPostById, getCommentById, getModerationItemById
```

---

## Task 1: Add Query Helpers

**Files:**
- Modify: `src/lib/queries/admin.ts`

- [ ] **Step 1: Add getPostById, getCommentById, getModerationItemById**

```typescript
export async function getPostById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('community_posts')
    .select(`
      *,
      author:profiles!community_posts_author_id_fkey(full_name, contact_email, avatar_url)
    `)
    .eq('id', id)
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function getCommentById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('community_comments')
    .select(`
      *,
      author:profiles!community_comments_author_id_fkey(full_name, contact_email),
      post:community_posts!community_comments_post_id_fkey(title)
    `)
    .eq('id', id)
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}

export async function getModerationItemById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('moderation_queue')
    .select(`
      *,
      flagged_by_profile:profiles!flagged_by(full_name, contact_email)
    `)
    .eq('id', id)
    .single()
  if (error) return { data: null, error: error.message }
  return { data, error: null }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/queries/admin.ts
git commit -m "feat(admin): add community moderation query helpers"
```

---

## Task 2: Post Detail Page

**Files:**
- Create: `src/app/admin/community/posts/[id]/page.tsx`
- Modify: `src/components/admin/PostsPageClient.tsx`

- [ ] **Step 1: Create post detail page**

```typescript
import React from 'react'
import { notFound } from 'next/navigation'
import { getPostById } from '@/lib/queries/admin'
import { approvePost, deletePost, togglePinPost } from '@/lib/actions/admin'
import { EntityHeader } from '@/components/admin/EntityHeader'
import { StatusBadge } from '@/components/admin/StatusBadge'

interface PostDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params
  const { data: post } = await getPostById(id)

  if (!post) notFound()

  const author = post.author as { full_name?: string; contact_email?: string; avatar_url?: string } | null

  return (
    <div className="space-y-6">
      <EntityHeader
        title={post.title || 'Untitled Post'}
        subtitle={`By ${author?.full_name || 'Unknown'} — ${new Date(post.created_at).toLocaleDateString()}`}
        backHref="/admin/community/posts"
        backLabel="Back to Posts"
        actions={
          <div className="flex gap-2">
            {!post.is_approved && (
              <form action={async () => { 'use server'; await approvePost(id) }}>
                <button type="submit" className="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-medium hover:bg-green-200">
                  Approve
                </button>
              </form>
            )}
            <form action={async () => { 'use server'; await togglePinPost(id, !post.is_pinned) }}>
              <button type="submit" className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-medium hover:bg-primary/20">
                {post.is_pinned ? 'Unpin' : 'Pin'}
              </button>
            </form>
            <form action={async () => { 'use server'; await deletePost(id) }}>
              <button type="submit" className="px-4 py-2 rounded-xl bg-error/10 text-error font-medium hover:bg-error/20">
                Delete
              </button>
            </form>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
            <h2 className="text-lg font-bold text-on-surface mb-4">Post Info</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Type</span>
                <span className="text-on-surface">{post.type || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Status</span>
                <StatusBadge status={post.is_approved ? 'approved' : 'pending'} />
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Pinned</span>
                <StatusBadge status={post.is_pinned ? 'yes' : 'no'} />
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Author Email</span>
                <span className="text-on-surface">{author?.contact_email || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
            <h2 className="text-lg font-bold text-on-surface mb-4">Content</h2>
            <div className="prose prose-sm max-w-none text-on-surface">
              {post.content || 'No content.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update PostsPageClient with real actions**

Wire Approve, Delete, Pin/Unpin buttons with server action forms. Add status filter.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/community/posts/[id]/page.tsx src/components/admin/PostsPageClient.tsx
git commit -m "feat(admin): add post detail page with approve/pin/delete actions"
```

---

## Task 3: Comment Detail Page

**Files:**
- Create: `src/app/admin/community/comments/[id]/page.tsx`
- Modify: `src/components/admin/CommentsPageClient.tsx`

- [ ] **Step 1: Create comment detail page**

```typescript
import React from 'react'
import { notFound } from 'next/navigation'
import { getCommentById } from '@/lib/queries/admin'
import { approveComment, deleteComment } from '@/lib/actions/admin'
import { EntityHeader } from '@/components/admin/EntityHeader'
import { StatusBadge } from '@/components/admin/StatusBadge'

interface CommentDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function CommentDetailPage({ params }: CommentDetailPageProps) {
  const { id } = await params
  const { data: comment } = await getCommentById(id)

  if (!comment) notFound()

  const author = comment.author as { full_name?: string } | null
  const post = comment.post as { title?: string } | null

  return (
    <div className="space-y-6">
      <EntityHeader
        title="Comment"
        subtitle={`On "${post?.title || 'Unknown Post'}" by ${author?.full_name || 'Unknown'}`}
        backHref="/admin/community/comments"
        backLabel="Back to Comments"
        actions={
          <div className="flex gap-2">
            {!comment.is_approved && (
              <form action={async () => { 'use server'; await approveComment(id) }}>
                <button type="submit" className="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-medium hover:bg-green-200">
                  Approve
                </button>
              </form>
            )}
            <form action={async () => { 'use server'; await deleteComment(id) }}>
              <button type="submit" className="px-4 py-2 rounded-xl bg-error/10 text-error font-medium hover:bg-error/20">
                Delete
              </button>
            </form>
          </div>
        }
      />

      <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
        <div className="flex items-center gap-2 mb-4">
          <StatusBadge status={comment.is_approved ? 'approved' : 'pending'} />
          <span className="text-sm text-on-surface-variant">
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>
        <p className="text-on-surface whitespace-pre-wrap">{comment.content || 'No content.'}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update CommentsPageClient with real actions**

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/community/comments/[id]/page.tsx src/components/admin/CommentsPageClient.tsx
git commit -m "feat(admin): add comment detail page with approve/delete actions"
```

---

## Task 4: Moderation Queue Detail Page

**Files:**
- Create: `src/app/admin/community/queue/[id]/page.tsx`
- Modify: `src/components/admin/QueuePageClient.tsx`

- [ ] **Step 1: Create moderation item detail page**

```typescript
import React from 'react'
import { notFound } from 'next/navigation'
import { getModerationItemById } from '@/lib/queries/admin'
import { resolveModerationItem } from '@/lib/actions/admin'
import { EntityHeader } from '@/components/admin/EntityHeader'
import { StatusBadge } from '@/components/admin/StatusBadge'

interface QueueDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function QueueDetailPage({ params }: QueueDetailPageProps) {
  const { id } = await params
  const { data: item } = await getModerationItemById(id)

  if (!item) notFound()

  const flaggedBy = item.flagged_by_profile as { full_name?: string } | null

  return (
    <div className="space-y-6">
      <EntityHeader
        title={`${(item.item_type || 'Item').toString().toUpperCase()} #${String(item.item_id).slice(0, 8)}`}
        subtitle={`Flagged by ${flaggedBy?.full_name || 'Unknown'}`}
        backHref="/admin/community/queue"
        backLabel="Back to Queue"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
            <h2 className="text-lg font-bold text-on-surface mb-4">Flag Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Type</span>
                <StatusBadge status={String(item.item_type || 'unknown')} />
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Status</span>
                <StatusBadge status={String(item.status || 'pending')} />
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Flagged</span>
                <span className="text-on-surface">{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
            <h2 className="text-lg font-bold text-on-surface mb-4">Actions</h2>
            <div className="space-y-2">
              <form action={async () => { 'use server'; await resolveModerationItem(id, 'dismiss') }}>
                <button type="submit" className="w-full px-4 py-2 rounded-xl bg-green-100 text-green-700 font-medium hover:bg-green-200">
                  Dismiss Flag
                </button>
              </form>
              <form action={async () => { 'use server'; await resolveModerationItem(id, 'review') }}>
                <button type="submit" className="w-full px-4 py-2 rounded-xl bg-primary/10 text-primary font-medium hover:bg-primary/20">
                  Mark Reviewed
                </button>
              </form>
              <form action={async () => { 'use server'; await resolveModerationItem(id, 'remove') }}>
                <button type="submit" className="w-full px-4 py-2 rounded-xl bg-error/10 text-error font-medium hover:bg-error/20">
                  Remove Content
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
            <h2 className="text-lg font-bold text-on-surface mb-4">Reason</h2>
            <p className="text-on-surface whitespace-pre-wrap">{item.flag_reason || 'No reason provided.'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update QueuePageClient with real actions + status filter**

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/community/queue/[id]/page.tsx src/components/admin/QueuePageClient.tsx
git commit -m "feat(admin): add moderation queue detail with dismiss/review/remove actions"
```

---

## Task 5: Wire Audit Logs with Filters

**Files:**
- Modify: `src/app/admin/audit-logs/page.tsx`
- Modify: `src/components/admin/AuditLogsPageClient.tsx`

- [ ] **Step 1: Update audit-logs server component to read URL params**

```typescript
import React from 'react'
import { getAuditLogs } from '@/lib/queries/admin'
import { AuditLogsPageClient } from '@/components/admin/AuditLogsPageClient'

interface AuditLogsPageProps {
  searchParams: Promise<{ action?: string; target_type?: string; date_from?: string; date_to?: string; page?: string }>
}

export default async function AuditLogsPage({ searchParams }: AuditLogsPageProps) {
  const params = await searchParams
  const filters = {
    action: params.action,
    target_type: params.target_type,
    date_from: params.date_from,
    date_to: params.date_to,
  }
  const page = Number(params.page) || 1
  const result = await getAuditLogs(filters, { page, per_page: 50 })

  return (
    <AuditLogsPageClient
      data={result.data || []}
      page={page}
      per_page={50}
      total={result.total}
      filters={filters}
    />
  )
}
```

- [ ] **Step 2: Update AuditLogsPageClient with working filters**

Add `useRouter`, `useTransition`, and `updateFilter` function. Wire all filter selects and date inputs to URL state. Make pagination functional.

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/audit-logs/page.tsx src/components/admin/AuditLogsPageClient.tsx
git commit -m "feat(admin): wire audit logs with real filters and pagination"
```

---

## Acceptance Criteria

- [ ] `/admin/community/posts/[id]` shows post content + approve/pin/delete actions
- [ ] `/admin/community/comments/[id]` shows comment content + approve/delete actions
- [ ] `/admin/community/queue/[id]` shows flag details + dismiss/review/remove actions
- [ ] `/admin/audit-logs` has working filters (action, target_type, date range) and pagination
- [ ] All list pages have functional action buttons
- [ ] Audit logs created for all moderation actions
