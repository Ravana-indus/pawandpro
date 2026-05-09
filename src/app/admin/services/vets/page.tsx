import React from "react"
import { DataTable } from "@/components/DataTable"
import { createClient } from "@/lib/supabase/server"
import { getHospitals } from "@/lib/queries/admin"

export default async function VetsPage() {
  const supabase = await createClient()
  const { data: vets } = await supabase
    .from('profiles')
    .select(`
      *,
      service_provider_details (
        specialization,
        is_verified,
        service_fee
      )
    `)
    .eq('role', 'VET')
    .order('created_at', { ascending: false })
    .limit(50)

  const hospitals = await getHospitals()

  const columns = [
    { key: "full_name", label: "Name", sortable: true },
    { key: "contact_email", label: "Email", sortable: true },
    { key: "specialization", label: "Specialization", render: (v: unknown) => String(v || 'General') },
    { key: "is_verified", label: "Verified", render: (v: unknown) => (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${v ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
        {v ? 'Verified' : 'Pending'}
      </span>
    )},
    { key: "service_fee", label: "Fee", render: (v: unknown) => v ? `$${Number(v).toFixed(2)}` : 'N/A' },
    { key: "created_at", label: "Joined", sortable: true, render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
  ]

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      <button className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20">
        View
      </button>
      <button className="px-3 py-1 rounded-lg text-xs font-medium bg-tertiary/10 text-tertiary hover:bg-tertiary/20">
        Link Hospital
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
          Vets & Hospitals
        </h1>
        <p className="text-on-surface-variant">Manage veterinarian and hospital verifications</p>
      </div>

      <div className="bg-surface-container-low p-4 rounded-xl">
        <h2 className="text-lg font-bold text-on-surface mb-4">Hospitals ({hospitals.data?.length || 0})</h2>
        {hospitals.data?.map(hospital => (
          <div key={hospital.id} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg mb-2">
            <div>
              <div className="font-medium text-on-surface">{hospital.name}</div>
              <div className="text-sm text-on-surface-variant">{hospital.address}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${hospital.is_verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {hospital.is_verified ? 'Verified' : 'Pending'}
              </span>
              <button className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20">
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>

      <DataTable columns={columns} data={vets || []} actions={actions} />
    </div>
  )
}