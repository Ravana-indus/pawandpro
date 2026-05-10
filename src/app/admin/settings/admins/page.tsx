import React from "react"
import { getUsers } from "@/lib/queries/admin"
import { AdminsPageClient } from "@/components/admin/AdminsPageClient"

export default async function AdminsManagementPage() {
  const { data: admins } = await getUsers({ role: "ADMIN" }, { page: 1, per_page: 100 })

  return (
    <AdminsPageClient initialAdmins={admins || []} />
  )
}
