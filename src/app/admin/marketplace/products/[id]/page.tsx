import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EntityHeader } from '@/components/admin/EntityHeader'
import { DetailSection } from '@/components/admin/DetailSection'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { AuditTimeline } from '@/components/admin/AuditTimeline'

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

type ProductDetail = {
  id: string
  name: string
  brand: string | null
  category: string | null
  price: number
  stock_quantity: number | null
  details: unknown
  created_at: string | null
  seller: {
    full_name: string | null
    contact_email: string | null
  } | null
}

type ProductOrderHistory = Array<{
  id: string
  quantity: number
  price_at_purchase: number
  order: {
    id: string
    status: string | null
    created_at: string | null
    buyer: {
      full_name: string | null
      contact_email: string | null
    } | null
  } | null
  pet_listing: {
    id: string
    name: string
  } | null
}>

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: product, error: productError }, { data: orderHistory, error: orderHistoryError }] = await Promise.all([
    supabase
      .from('products')
      .select('*, seller:profiles!products_seller_id_fkey(full_name, contact_email)')
      .eq('id', id)
      .single(),
    supabase
      .from('order_items')
      .select(
        'id, quantity, price_at_purchase, order:orders(id, status, created_at, buyer:profiles!orders_buyer_id_fkey(full_name, contact_email)), pet_listing:pet_listings(id, name)',
      )
      .eq('product_id', id),
  ])

  if (productError || !product) {
    notFound()
  }

  const typedProduct = product as unknown as ProductDetail
  const typedOrderHistory = (orderHistory ?? []) as unknown as ProductOrderHistory

  return (
    <div className="space-y-6">
      <EntityHeader
        title={typedProduct.name}
        subtitle="Marketplace product operational detail"
        backHref="/admin/marketplace/products"
        backLabel="Products"
      />

      <DetailSection title="Product Summary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailField label="Brand" value={typedProduct.brand || 'N/A'} />
          <DetailField label="Category" value={typedProduct.category || 'N/A'} />
          <DetailField label="Price" value={`$${Number(typedProduct.price).toFixed(2)}`} />
          <DetailField label="Stock Quantity" value={typedProduct.stock_quantity?.toString() || 'N/A'} />
          <DetailField
            label="Created"
            value={typedProduct.created_at ? new Date(typedProduct.created_at).toLocaleString() : 'N/A'}
          />
        </div>
      </DetailSection>

      <DetailSection title="Seller Context">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailField label="Seller Name" value={typedProduct.seller?.full_name || 'N/A'} />
          <DetailField label="Seller Email" value={typedProduct.seller?.contact_email || 'N/A'} />
        </div>
      </DetailSection>

      <DetailSection title="Order History Context">
        {orderHistoryError ? (
          <p className="text-sm text-error">Failed to load order history: {orderHistoryError.message}</p>
        ) : typedOrderHistory.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No order history for this product yet.</p>
        ) : (
          <ul className="space-y-3">
            {typedOrderHistory.map((entry) => (
              <li key={entry.id} className="rounded-xl border border-outline-variant/20 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    {entry.order ? (
                      <Link href={`/admin/marketplace/orders/${entry.order.id}`} className="text-primary hover:underline font-medium">
                        Order {entry.order.id.slice(0, 8)}...
                      </Link>
                    ) : (
                      <p className="text-on-surface">Unknown order</p>
                    )}
                    <p className="text-sm text-on-surface-variant mt-1">
                      Buyer: {entry.order?.buyer?.full_name || entry.order?.buyer?.contact_email || 'N/A'}
                    </p>
                    {entry.pet_listing ? (
                      <Link href={`/admin/marketplace/listings/${entry.pet_listing.id}`} className="text-sm text-primary hover:underline">
                        Includes listing: {entry.pet_listing.name}
                      </Link>
                    ) : null}
                  </div>
                  <div className="text-right text-sm text-on-surface-variant">
                    <p>Qty: {entry.quantity}</p>
                    <p>${Number(entry.price_at_purchase).toFixed(2)} each</p>
                    {entry.order?.status ? (
                      <div className="mt-1">
                        <StatusBadge status={entry.order.status} />
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DetailSection>

      <DetailSection title="Metadata">
        <pre className="rounded-xl bg-surface-container-high p-3 text-xs text-on-surface overflow-x-auto">
          {JSON.stringify(typedProduct.details ?? {}, null, 2)}
        </pre>
      </DetailSection>

      <DetailSection title="Audit Timeline">
        <AuditTimeline targetType="products" targetId={typedProduct.id} />
      </DetailSection>
    </div>
  )
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-on-surface-variant">{label}</p>
      <p className="text-on-surface mt-1">{value}</p>
    </div>
  )
}
