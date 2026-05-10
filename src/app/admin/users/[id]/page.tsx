import React from "react"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EntityHeader } from "@/components/admin/EntityHeader"
import { UserDetailClient } from "@/components/admin/UserDetailClient"

interface UserDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !profile) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <EntityHeader
        title={profile.full_name || 'User Details'}
        subtitle={`${profile.role} ${profile.is_verified ? '· Verified' : ''}`}
        backHref="/admin/users"
        backLabel="Users"
      />
      <UserDetailClient user={profile} />
    </div>
  )
}