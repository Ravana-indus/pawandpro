'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { EntityForm } from '@/components/admin/EntityForm'
import { FormField } from '@/components/admin/FormField'
import { updateListing } from '@/lib/actions/admin'

const speciesOptions = [
  { value: 'Dog', label: 'Dog' },
  { value: 'Cat', label: 'Cat' },
  { value: 'Bird', label: 'Bird' },
  { value: 'Fish', label: 'Fish' },
  { value: 'Small Pet', label: 'Small Pet' },
  { value: 'Reptile', label: 'Reptile' },
]

const sexOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
]

const typeOptions = [
  { value: 'Buy', label: 'Buy' },
  { value: 'Adopt', label: 'Adopt' },
  { value: 'Rehome', label: 'Rehome' },
]

const statusOptions = [
  { value: 'Available', label: 'Available' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Sold', label: 'Sold' },
]

const certificationOptions = [
  { value: 'Gold', label: 'Gold' },
  { value: 'Silver', label: 'Silver' },
  { value: 'Verified', label: 'Verified' },
  { value: 'Shelter', label: 'Shelter' },
]

interface ListingEditFormProps {
  listing: {
    id: string
    name: string
    species: string
    breed: string | null
    sex: string | null
    age: string | null
    price: number
    type: string
    status: string | null
    certification_tier: string | null
    image_url: string | null
    seller_id: string | null
  }
}

export function ListingEditForm({ listing }: ListingEditFormProps) {
  const router = useRouter()

  async function handleUpdateListing(formData: FormData) {
    const result = await updateListing(listing.id, formData)
    if (result.success) {
      router.push(`/admin/marketplace/listings/${listing.id}`)
      router.refresh()
    }
    return result
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6">
      <EntityForm
        action={handleUpdateListing}
        submitLabel="Save Changes"
        onSuccess={() => {}}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Name" name="name" defaultValue={listing.name} required />
          <FormField label="Species" name="species" type="select" defaultValue={listing.species} options={speciesOptions} required />
          <FormField label="Breed" name="breed" defaultValue={listing.breed || ''} />
          <FormField label="Sex" name="sex" type="select" defaultValue={listing.sex || ''} options={sexOptions} />
          <FormField label="Age" name="age" defaultValue={listing.age || ''} />
          <FormField label="Price" name="price" type="number" defaultValue={listing.price} required />
          <FormField label="Type" name="type" type="select" defaultValue={listing.type} options={typeOptions} required />
          <FormField label="Status" name="status" type="select" defaultValue={listing.status || 'Available'} options={statusOptions} />
          <FormField label="Certification Tier" name="certification_tier" type="select" defaultValue={listing.certification_tier || ''} options={certificationOptions} />
        </div>
        <FormField label="Image URL" name="image_url" defaultValue={listing.image_url || ''} />
      </EntityForm>
    </div>
  )
}