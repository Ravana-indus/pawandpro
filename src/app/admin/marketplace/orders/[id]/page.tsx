import React from "react"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { updateOrderStatus } from "@/lib/actions/admin"
import { EntityHeader } from "@/components/admin/EntityHeader"
import { Metadata } from "next"

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  const { id } = await params
  return { title: `Order ${id.slice(0, 8)}... - Admin` }
}

async function OrderDetailClient({
  order,
}: {
  order: {
    id: string
    total_amount: number
    status: string
    created_at: string
    updated_at: string
    buyer: { full_name: string | null; contact_email: string | null } | null
  }
}) {
  "use client"

  const statuses = ['Processing', 'In Transit', 'Delivered', 'Cancelled']

  const handleStatusChange = async (newStatus: string) => {
    "use server"
    await updateOrderStatus(order.id, newStatus)
  }

  return (
    <div className="space-y-6">
      <EntityHeader
        title={`Order ${order.id.slice(0, 8)}...`}
        subtitle="Order Details"
        backHref="/admin/marketplace/orders"
        backLabel="Back to Orders"
      />

      <div className="bg-surface-container-lowest rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-on-surface-variant">Order ID</label>
              <p className="text-on-surface font-mono text-sm">{order.id}</p>
            </div>
            <div>
              <label className="text-sm text-on-surface-variant">Buyer</label>
              <p className="text-on-surface">{order.buyer?.full_name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm text-on-surface-variant">Buyer Email</label>
              <p className="text-on-surface">{order.buyer?.contact_email || 'N/A'}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-on-surface-variant">Total Amount</label>
              <p className="text-on-surface text-xl font-bold">${Number(order.total_amount).toFixed(2)}</p>
            </div>
            <div>
              <label className="text-sm text-on-surface-variant">Created</label>
              <p className="text-on-surface">{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm text-on-surface-variant">Last Updated</label>
              <p className="text-on-surface">{order.updated_at ? new Date(order.updated_at).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm text-on-surface-variant block mb-2">Status</label>
          <select
            value={order.status || 'Processing'}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full md:w-64 px-3 py-2 rounded-xl bg-surface-container-high border border-outline text-on-surface"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href="/admin/marketplace/orders"
          className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-container-low transition-colors"
        >
          Back to Orders
        </Link>
      </div>
    </div>
  )
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, buyer:profiles!orders_buyer_id_fkey(full_name, contact_email)')
    .eq('id', id)
    .single()

  if (!order) {
    notFound()
  }

  const typedOrder = order as unknown as {
    id: string
    total_amount: number
    status: string
    created_at: string
    updated_at: string
    buyer: { full_name: string | null; contact_email: string | null } | null
  }

  return <OrderDetailClient order={typedOrder} />
}
