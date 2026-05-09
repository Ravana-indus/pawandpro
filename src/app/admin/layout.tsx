import React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/AdminSidebar"
import { AdminTopBar } from "@/components/AdminTopBar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, admin_permissions")
    .eq("id", user.id)
    .single()

  const adminRoles = ["SUPER_ADMIN", "ADMIN", "MARKETPLACE_STAFF"]
  if (!profile || !adminRoles.includes(profile.role)) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 min-h-screen">
          <AdminTopBar />
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}