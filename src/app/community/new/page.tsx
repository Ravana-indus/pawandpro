import React from "react"
import { createPost } from "@/lib/actions/community"

export default function NewPostPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-headline font-extrabold text-on-surface">Create Post</h1>
      <form action={createPost} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">Title</label>
          <input name="title" type="text" required className="w-full px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20" />
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">Type</label>
          <select name="type" className="w-full px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
            <option value="discussion">Discussion</option>
            <option value="question">Question</option>
            <option value="story">Story</option>
            <option value="alert">Alert</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">Content</label>
          <textarea name="content" rows={6} required className="w-full px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20" />
        </div>
        <button type="submit" className="px-6 py-2 rounded-xl bg-primary text-on-primary font-medium hover:bg-primary/90">
          Publish Post
        </button>
      </form>
    </div>
  )
}