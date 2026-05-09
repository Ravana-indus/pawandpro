import React from "react"
import { DataTable } from "@/components/DataTable"
import { createClient } from "@/lib/supabase/server"

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, seller:profiles!products_seller_id_fkey(full_name, contact_email)')
    .order('created_at', { ascending: false })
    .limit(50)

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "seller", label: "Seller", render: (v: unknown) => (v as { full_name: string } | null)?.full_name || 'N/A' },
    { key: "brand", label: "Brand", sortable: true },
    { key: "price", label: "Price", sortable: true, render: (v: unknown) => `$${Number(v).toFixed(2)}` },
    { key: "stock_quantity", label: "Stock", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "created_at", label: "Added", sortable: true, render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
  ]

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      <button className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20">
        Edit
      </button>
      <button className="px-3 py-1 rounded-lg text-xs font-medium bg-error/10 text-error hover:bg-error/20">
        Delete
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
          Products
        </h1>
        <p className="text-on-surface-variant">Manage all products in the marketplace</p>
      </div>
      <DataTable columns={columns} data={products || []} actions={actions} />
    </div>
  )
}