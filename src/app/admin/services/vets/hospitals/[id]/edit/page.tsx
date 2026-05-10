import React from "react"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { EntityHeader } from "@/components/admin/EntityHeader"
import { EntityForm } from "@/components/admin/EntityForm"
import { FormField } from "@/components/admin/FormField"
import { updateHospital } from "@/lib/actions/admin"

interface HospitalEditPageProps {
  params: { id: string }
}

export default async function HospitalEditPage({ params }: HospitalEditPageProps) {
  const supabase = await createClient()

  const { data: hospital } = await supabase
    .from('hospitals')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!hospital) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <EntityHeader
        title={`Edit: ${hospital.name}`}
        subtitle="Update hospital information"
        backHref={`/admin/services/vets/hospitals/${hospital.id}`}
        backLabel="Back to Hospital"
      />
      <EntityForm action={updateHospital.bind(null, hospital.id)} submitLabel="Update Hospital">
        <FormField label="Name" name="name" defaultValue={hospital.name} required />
        <FormField label="Address" name="address" defaultValue={hospital.address || ''} />
        <FormField label="Phone" name="phone" defaultValue={hospital.phone || ''} />
        <FormField label="Email" name="email" type="email" defaultValue={hospital.email || ''} />
        <FormField label="License Number" name="license_number" defaultValue={hospital.license_number || ''} />
        <FormField label="Verified" name="is_verified" type="checkbox" defaultValue={hospital.is_verified ?? false} />
      </EntityForm>
    </div>
  )
}