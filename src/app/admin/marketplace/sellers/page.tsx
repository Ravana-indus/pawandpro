import React from "react"
import { DataTable } from "@/components/DataTable"
import { createClient } from "@/lib/supabase/server"

export default async function SellersPage() {
  const supabase = await createClient()
  const { data: sellers } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'SELLER')
    .order('created_at', { ascending: false })
    .limit(50)

  const columns = [
    { key: "full_name", label: "Name", sortable: true, render: (v: unknown) => v || 'N/A' },
    { key: "contact_email", label: "Email", sortable: true },
    { key: "phone", label: "Phone" },
    { key: "created_at", label: "Joined", sortable: true, render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
  ]

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      <button className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20">
        View
      </button>
      <button className="px-3 py-1 rounded-lg text-xs font-medium bg-error/10 text-error hover:bg-error/20">
        Suspend
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
          Sellers
        </h1>
        <p className="text-on-surface-variant">Manage all sellers in the marketplace</p>
      </div>
      <DataTable columns={columns} data={sellers || []} actions={actions} />
    </div>
  )
}