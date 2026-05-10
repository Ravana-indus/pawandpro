import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EntityHeader } from '@/components/admin/EntityHeader'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { DetailSection } from '@/components/admin/DetailSection'
import { AuditTimeline } from '@/components/admin/AuditTimeline'
import { ActionReasonDialog } from '@/components/admin/ActionReasonDialog'
import { DeleteButton } from './DeleteButton'
import {
  transitionAdminListingStatus,
  updateAdminListingCertification,
} from '@/lib/admin/mutations/marketplace'

interface ListingDetailPageProps {
  params: Promise<{ id: string }>
}

type ListingStatus = 'Available' | 'Pending' | 'Sold'
type CertificationTier = 'Gold' | 'Silver' | 'Verified' | 'Shelter'

type ListingDetail = {
  id: string
  name: string
  species: string
  breed: string | null
  sex: string | null
  age: string | null
  price: number
  type: string
  status: ListingStatus | null
  certification_tier: CertificationTier | null
  image_url: string | null
  created_at: string | null
  seller: {
    full_name: string | null
    contact_email: string | null
  } | null
}

type ListingOrderHistory = Array<{
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
  product: {
    id: string
    name: string
  } | null
}>

const LISTING_STATUS_OPTIONS: ListingStatus[] = ['Available', 'Pending', 'Sold']
const CERTIFICATION_OPTIONS: CertificationTier[] = ['Gold', 'Silver', 'Verified', 'Shelter']

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: listing, error: listingError }, { data: orderHistory, error: orderHistoryError }] = await Promise.all([
    supabase
      .from('pet_listings')
      .select('*, seller:profiles!pet_listings_seller_id_fkey(full_name, contact_email)')
      .eq('id', id)
      .single(),
    supabase
      .from('order_items')
      .select(
        'id, quantity, price_at_purchase, order:orders(id, status, created_at, buyer:profiles!orders_buyer_id_fkey(full_name, contact_email)), product:products(id, name)',
      )
      .eq('pet_listing_id', id),
  ])

  if (listingError || !listing) {
    notFound()
  }

  const typedListing = listing as unknown as ListingDetail
  const typedOrderHistory = (orderHistory ?? []) as unknown as ListingOrderHistory
  const statusTransitions = LISTING_STATUS_OPTIONS.filter((status) => status !== typedListing.status)
  const certificationTransitions = CERTIFICATION_OPTIONS.filter((tier) => tier !== typedListing.certification_tier)

  return (
    <div className="space-y-6">
      <EntityHeader
        title={typedListing.name}
        subtitle={`${typedListing.species} · ${typedListing.breed || 'Unknown breed'} · ${typedListing.sex || 'Unknown sex'}`}
        backHref="/admin/marketplace/listings"
        backLabel="Back to Listings"
        actions={
          <div className="flex gap-2">
            <Link
              href={`/admin/marketplace/listings/${typedListing.id}/edit`}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary font-medium hover:opacity-90"
            >
              Edit
            </Link>
            <DeleteButton listingId={typedListing.id} />
          </div>
        }
      />

      <DetailSection title="Listing Summary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailField label="Species" value={typedListing.species} />
          <DetailField label="Breed" value={typedListing.breed || 'N/A'} />
          <DetailField label="Sex" value={typedListing.sex || 'N/A'} />
          <DetailField label="Age" value={typedListing.age || 'N/A'} />
          <DetailField label="Price" value={`$${Number(typedListing.price).toFixed(2)}`} />
          <DetailField label="Type" value={typedListing.type} />
          <div className="space-y-1">
            <p className="text-sm text-on-surface-variant">Status</p>
            <StatusBadge status={typedListing.status || 'Available'} />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-on-surface-variant">Certification</p>
            {typedListing.certification_tier ? (
              <StatusBadge status={typedListing.certification_tier} />
            ) : (
              <p className="text-on-surface">None</p>
            )}
          </div>
          <DetailField
            label="Created"
            value={typedListing.created_at ? new Date(typedListing.created_at).toLocaleString() : 'N/A'}
          />
        </div>
        {typedListing.image_url ? (
          <div className="pt-2">
            <p className="text-sm text-on-surface-variant mb-2">Image</p>
            <Image
              src={typedListing.image_url}
              alt={typedListing.name}
              width={800}
              height={480}
              className="w-full max-w-lg rounded-xl h-auto"
            />
          </div>
        ) : null}
      </DetailSection>

      <DetailSection title="Seller Context">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailField label="Seller Name" value={typedListing.seller?.full_name || 'N/A'} />
          <DetailField label="Seller Email" value={typedListing.seller?.contact_email || 'N/A'} />
        </div>
      </DetailSection>

      <DetailSection title="Listing Actions" description="Status and certification changes require a reason and are audit logged.">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {statusTransitions.map((status) => (
              <ActionReasonDialog
                key={status}
                triggerLabel={`Set ${status}`}
                title={`Change listing status to ${status}`}
                description="Provide the operational reason for this listing status transition."
                confirmLabel={`Confirm ${status}`}
                confirmVariant={status === 'Sold' ? 'destructive' : 'default'}
                onConfirm={transitionAdminListingStatus.bind(null, typedListing.id, status)}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {certificationTransitions.map((tier) => (
              <ActionReasonDialog
                key={tier}
                triggerLabel={`Cert ${tier}`}
                title={`Update certification to ${tier}`}
                description="Provide the reason for this certification update."
                confirmLabel={`Set ${tier}`}
                onConfirm={updateAdminListingCertification.bind(null, typedListing.id, tier)}
              />
            ))}
          </div>
        </div>
      </DetailSection>

      <DetailSection title="Order History Context">
        {orderHistoryError ? (
          <p className="text-sm text-error">Failed to load order history: {orderHistoryError.message}</p>
        ) : typedOrderHistory.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No order history for this listing yet.</p>
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
                    {entry.product ? (
                      <Link href={`/admin/marketplace/products/${entry.product.id}`} className="text-sm text-primary hover:underline">
                        Also included product: {entry.product.name}
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

      <DetailSection title="Audit Timeline">
        <AuditTimeline targetType="pet_listings" targetId={typedListing.id} />
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
