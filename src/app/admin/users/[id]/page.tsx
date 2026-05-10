import React from "react"
import { notFound } from "next/navigation"
import { getAdminUserDetail } from "@/lib/admin/queries/trust-safety"
import { EntityHeader } from "@/components/admin/EntityHeader"
import { UserDetailClient } from "@/components/admin/UserDetailClient"
import { AuditTimeline } from "@/components/admin/AuditTimeline"

interface UserDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params

  const result = await getAdminUserDetail(id)

  if (result.error || !result.data) {
    notFound()
  }

  const profile = result.data

  return (
    <div className="space-y-6">
      <EntityHeader
        title={profile.full_name || 'User Details'}
        subtitle={`${profile.role} ${profile.is_verified ? '· Verified' : ''}`}
        backHref="/admin/users"
        backLabel="Users"
      />
      <UserDetailClient user={profile} />
      <AuditTimeline targetType="profiles" targetId={profile.id} />
    </div>
  )
}