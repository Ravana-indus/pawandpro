import React from "react"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { EntityHeader } from "@/components/admin/EntityHeader"
import { EntityForm } from "@/components/admin/EntityForm"
import { FormField } from "@/components/admin/FormField"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { updateHospital } from "@/lib/actions/admin"
import Link from "next/link"

interface HospitalDetailPageProps {
  params: { id: string }
}

export default async function HospitalDetailPage({ params }: HospitalDetailPageProps) {
  const supabase = await createClient()

  const { data: hospital } = await supabase
    .from('hospitals')
    .select(`
      *,
      hospital_vets (
        vet:profiles!hospital_vets_vet_id_fkey (
          id,
          full_name,
          contact_email,
          is_verified
        )
      )
    `)
    .eq('id', params.id)
    .single()

  if (!hospital) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <EntityHeader
        title={hospital.name}
        subtitle={hospital.address || 'No address'}
        backHref="/admin/services/vets"
        backLabel="Back to Vets & Hospitals"
        actions={
          <Link
            href={`/admin/services/vets/hospitals/${hospital.id}/edit`}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary font-medium hover:opacity-90"
          >
            Edit
          </Link>
        }
      />

      <div className="bg-surface-container-lowest rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <DetailField label="Name" value={hospital.name} />
          <DetailField label="Address" value={hospital.address || 'N/A'} />
          <DetailField label="Phone" value={hospital.phone || 'N/A'} />
          <DetailField label="Email" value={hospital.email || 'N/A'} />
          <DetailField label="License Number" value={hospital.license_number || 'N/A'} />
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface">Verification Status</label>
            <StatusBadge status={hospital.is_verified ? 'verified' : 'unverified'} />
          </div>
        </div>

        <div className="border-t border-outline-variant/20 pt-4">
          <h3 className="text-lg font-bold text-on-surface mb-3">Linked Vets ({hospital.hospital_vets?.length || 0})</h3>
          {hospital.hospital_vets && hospital.hospital_vets.length > 0 ? (
            <div className="space-y-2">
              {hospital.hospital_vets.map((hv: any) => (
                <div key={hv.vet.id} className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
                  <div>
                    <Link
                      href={`/admin/services/vets/${hv.vet.id}`}
                      className="font-medium text-on-surface hover:text-primary"
                    >
                      {hv.vet.full_name}
                    </Link>
                    <p className="text-sm text-on-surface-variant">{hv.vet.contact_email}</p>
                  </div>
                  <StatusBadge status={hv.vet.is_verified ? 'verified' : 'unverified'} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-on-surface-variant">No vets linked to this hospital</p>
          )}
        </div>
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