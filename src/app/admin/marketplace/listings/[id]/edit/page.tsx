import React from "react"
import { getListingById } from "@/lib/queries/admin"
import { notFound } from "next/navigation"
import { EntityHeader } from "@/components/admin/EntityHeader"
import { ListingEditForm } from "./ListingEditForm"

interface ListingEditPageProps {
  params: { id: string }
}

export default async function ListingEditPage({ params }: ListingEditPageProps) {
  const { data: listing, error } = await getListingById(params.id)

  if (error || !listing) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <EntityHeader
        title={`Edit: ${listing.name}`}
        subtitle="Update listing information"
        backHref={`/admin/marketplace/listings/${listing.id}`}
        backLabel="Back to Listing"
      />
      <ListingEditForm listing={listing as any} />
    </div>
  )
}