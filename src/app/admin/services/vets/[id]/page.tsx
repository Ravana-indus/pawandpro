import React from "react"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { EntityHeader } from "@/components/admin/EntityHeader"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { LinkHospitalForm } from "@/components/admin/LinkHospitalForm"
import { getHospitals } from "@/lib/queries/admin"
import Link from "next/link"

interface VetDetailPageProps {
  params: { id: string }
}

export default async function VetDetailPage({ params }: VetDetailPageProps) {
  const supabase = await createClient()

  const { data: vet } = await supabase
    .from('profiles')
    .select(`
      *,
      service_provider_details (
        specialization,
        is_verified,
        service_fee
      )
    `)
    .eq('id', params.id)
    .eq('role', 'VET')
    .single()

  if (!vet) {
    notFound()
  }

  const { data: hospitalVets } = await supabase
    .from('hospital_vets')
    .select(`
      hospital:hospitals!hospital_vets_hospital_id_fkey (
        id,
        name
      )
    `)
    .eq('vet_id', params.id)

  const hospitalsResult = await getHospitals()
  const hospitals = (hospitalsResult.data || []).map((h: any) => ({
    id: h.id,
    name: h.name,
  }))

  const spd = (vet.service_provider_details as unknown) as { specialization: string | null; is_verified: boolean | null; service_fee: number | null } | null
  const linkedHospital = hospitalVets?.[0]?.hospital
  const vetName = vet.full_name || 'Unknown Vet'

  return (
    <div className="space-y-6">
      <EntityHeader
        title={vetName}
        subtitle={spd?.specialization || 'General'}
        backHref="/admin/services/vets"
        backLabel="Back to Vets & Hospitals"
      />

      <div className="bg-surface-container-lowest rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <DetailField label="Full Name" value={vetName} />
          <DetailField label="Email" value={vet.contact_email || 'N/A'} />
          <DetailField label="Specialization" value={spd?.specialization || 'General'} />
          <DetailField label="Service Fee" value={spd?.service_fee ? `$${Number(spd.service_fee).toFixed(2)}` : 'N/A'} />
          <div className="space-y-1">
            <label className="text-sm font-medium text-on-surface">Verification Status</label>
            <StatusBadge status={vet.is_verified ? 'verified' : 'unverified'} />
          </div>
          <DetailField label="Joined" value={vet.created_at ? new Date(vet.created_at).toLocaleDateString() : 'N/A'} />
        </div>

        <div className="border-t border-outline-variant/20 pt-4">
          <h3 className="text-lg font-bold text-on-surface mb-3">Hospital Link</h3>
          {linkedHospital ? (
            <div className="flex items-center gap-3 mb-3">
              <span className="text-on-surface">Linked to: <strong>{linkedHospital.name}</strong></span>
              <Link
                href={`/admin/services/vets/hospitals/${linkedHospital.id}`}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20"
              >
                View Hospital
              </Link>
            </div>
          ) : (
            <p className="text-on-surface-variant mb-3">Not linked to any hospital</p>
          )}

          <LinkHospitalForm
            vetId={vet.id}
            hospitals={hospitals}
            currentHospitalId={linkedHospital?.id}
          />
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