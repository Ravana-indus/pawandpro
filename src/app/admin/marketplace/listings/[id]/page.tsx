import React from "react"
import { getListingById } from "@/lib/queries/admin"
import { notFound } from "next/navigation"
import Link from "next/link"
import { EntityHeader } from "@/components/admin/EntityHeader"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { DeleteButton } from "./DeleteButton"

interface ListingDetailPageProps {
  params: { id: string }
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { data: listing, error } = await getListingById(params.id)

  if (error || !listing) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <EntityHeader
        title={listing.name}
        subtitle={`${listing.species} · ${listing.breed || 'Unknown breed'} · ${listing.sex || 'Unknown sex'}`}
        backHref="/admin/marketplace/listings"
        backLabel="Back to Listings"
        actions={
          <div className="flex gap-2">
            <Link
              href={`/admin/marketplace/listings/${listing.id}/edit`}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary font-medium hover:opacity-90"
            >
              Edit
            </Link>
            <DeleteButton listingId={listing.id} />
          </div>
        }
      />

      <div className="bg-surface-container-lowest rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <DetailField label="Name" value={listing.name} />
          <DetailField label="Species" value={listing.species} />
          <DetailField label="Breed" value={listing.breed || 'N/A'} />
          <DetailField label="Sex" value={listing.sex || 'N/A'} />
          <DetailField label="Age" value={listing.age || 'N/A'} />
          <DetailField label="Price" value={`$${Number(listing.price).toFixed(2)}`} />
          <DetailField label="Type" value={listing.type} />
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface">Status</label>
            <StatusBadge status={listing.status || 'Available'} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface">Certification Tier</label>
            {listing.certification_tier ? (
              <StatusBadge status={listing.certification_tier} />
            ) : (
              <p className="text-on-surface-variant">None</p>
            )}
          </div>
          <DetailField label="Seller" value={listing.seller?.full_name || 'N/A'} />
          <DetailField label="Seller Email" value={listing.seller?.contact_email || 'N/A'} />
          <DetailField label="Created" value={new Date(listing.created_at).toLocaleDateString()} />
        </div>

        {listing.image_url && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface">Image</label>
            <img src={listing.image_url} alt={listing.name} className="w-full max-w-md rounded-xl" />
          </div>
        )}
      </div>
    </div>
  )
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-on-surface">{label}</label>
      <p className="text-on-surface-variant">{value}</p>
    </div>
  )
}