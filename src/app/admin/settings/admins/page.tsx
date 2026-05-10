import React from "react"
import { listAdminStaff } from "@/lib/admin/queries/platform"
import { AdminsPageClient } from "@/components/admin/AdminsPageClient"

export default async function AdminsManagementPage() {
  const result = await listAdminStaff({
    page: 1,
    perPage: 100,
    role: "ADMIN",
  })

  const adminRoleResult = await listAdminStaff({
    page: 1,
    perPage: 100,
    role: "SUPER_ADMIN",
  })

  const allAdmins = [...(result.data || []), ...(adminRoleResult.data || [])]

  return (
    <AdminsPageClient initialAdmins={allAdmins as Record<string, unknown>[]} />
  )
}
