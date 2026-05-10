import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EntityHeader } from '@/components/admin/EntityHeader'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { DetailSection } from '@/components/admin/DetailSection'
import { AuditTimeline } from '@/components/admin/AuditTimeline'
import { ActionReasonDialog } from '@/components/admin/ActionReasonDialog'
import { transitionAdminOrderStatus } from '@/lib/admin/mutations/marketplace'

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

type OrderStatus = 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled'

type OrderDetail = {
  id: string
  status: OrderStatus | null
  total_amount: number
  created_at: string | null
  updated_at?: string | null
  buyer: {
    full_name: string | null
    contact_email: string | null
  } | null
  order_items: Array<{
    id: string
    quantity: number
    price_at_purchase: number
    product: { id: string; name: string } | null
    pet_listing: { id: string; name: string } | null
  }>
}

const ORDER_STATUS_OPTIONS: OrderStatus[] = ['Processing', 'In Transit', 'Delivered', 'Cancelled']

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  const { id } = await params
  return { title: `Order ${id.slice(0, 8)}... - Admin` }
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select(
      '*, buyer:profiles!orders_buyer_id_fkey(full_name, contact_email), order_items(*, product:products(*), pet_listing:pet_listings(*))',
    )
    .eq('id', id)
    .single()

  if (error || !data) {
    notFound()
  }

  const order = data as unknown as OrderDetail
  const nextStatuses = ORDER_STATUS_OPTIONS.filter((status) => status !== order.status)

  return (
    <div className="space-y-6">
      <EntityHeader
        title={`Order ${order.id.slice(0, 8)}...`}
        subtitle="Marketplace order operational detail"
        backHref="/admin/marketplace/orders"
        backLabel="Back to Orders"
      />

      <DetailSection title="Order Summary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-on-surface-variant">Order ID</p>
            <p className="text-sm font-mono text-on-surface mt-1">{order.id}</p>
          </div>
          <div>
            <p className="text-sm text-on-surface-variant">Status</p>
            <div className="mt-1">
              <StatusBadge status={order.status || 'Processing'} />
            </div>
          </div>
          <div>
            <p className="text-sm text-on-surface-variant">Total Amount</p>
            <p className="text-on-surface font-semibold mt-1">${Number(order.total_amount).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-on-surface-variant">Created</p>
            <p className="text-on-surface mt-1">
              {order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-on-surface-variant">Last Updated</p>
            <p className="text-on-surface mt-1">
              {order.updated_at ? new Date(order.updated_at).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>
      </DetailSection>

      <DetailSection title="Buyer Contact">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-on-surface-variant">Buyer Name</p>
            <p className="text-on-surface mt-1">{order.buyer?.full_name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-on-surface-variant">Buyer Email</p>
            <p className="text-on-surface mt-1">{order.buyer?.contact_email || 'N/A'}</p>
          </div>
        </div>
      </DetailSection>

      <DetailSection title="Order Items">
        {order.order_items.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No items on this order.</p>
        ) : (
          <ul className="space-y-3">
            {order.order_items.map((item) => {
              const productLink = item.product ? `/admin/marketplace/products/${item.product.id}` : null
              const listingLink = item.pet_listing ? `/admin/marketplace/listings/${item.pet_listing.id}` : null
              return (
                <li key={item.id} className="border border-outline-variant/20 rounded-xl p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-1">
                      {productLink ? (
                        <Link href={productLink} className="text-primary hover:underline font-medium">
                          Product: {item.product?.name}
                        </Link>
                      ) : null}
                      {listingLink ? (
                        <Link href={listingLink} className="text-primary hover:underline font-medium block">
                          Listing: {item.pet_listing?.name}
                        </Link>
                      ) : null}
                      {!productLink && !listingLink ? (
                        <p className="text-on-surface">Unknown item</p>
                      ) : null}
                    </div>
                    <div className="text-sm text-on-surface-variant text-right">
                      <p>Qty: {item.quantity}</p>
                      <p>${Number(item.price_at_purchase).toFixed(2)} each</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </DetailSection>

      <DetailSection title="Status Actions" description="Status transitions require an operational reason and are audit logged.">
        {nextStatuses.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No alternate status transitions available.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {nextStatuses.map((status) => (
              <ActionReasonDialog
                key={status}
                triggerLabel={`Mark ${status}`}
                title={`Change status to ${status}`}
                description="Provide the reason for this status transition."
                confirmLabel={`Confirm ${status}`}
                confirmVariant={status === 'Cancelled' ? 'destructive' : 'default'}
                onConfirm={transitionAdminOrderStatus.bind(null, order.id, status)}
              />
            ))}
          </div>
        )}
      </DetailSection>

      <DetailSection title="Audit Timeline">
        <AuditTimeline targetType="orders" targetId={order.id} />
      </DetailSection>
    </div>
  )
}
