"use client"

import React from "react"
import Link from "next/link"
import { DataTable } from "@/components/DataTable"
import { StatusBadge } from "@/components/admin/StatusBadge"

interface VetsPageClientProps {
  vets: Record<string, unknown>[]
  hospitals: { id: string; name: string; address: string | null; is_verified: boolean | null }[]
}

export function VetsPageClient({ vets, hospitals }: VetsPageClientProps) {
  const columns = [
    { key: "full_name", label: "Name", sortable: true },
    { key: "contact_email", label: "Email", sortable: true },
    { key: "specialization", label: "Specialization", render: (v: unknown) => String(v || 'General') },
    { key: "is_verified", label: "Verified", render: (v: unknown) => <StatusBadge status={v ? 'verified' : 'unverified'} /> },
    { key: "service_fee", label: "Fee", render: (v: unknown) => v ? `$${Number(v).toFixed(2)}` : 'N/A' },
    { key: "created_at", label: "Joined", sortable: true, render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
  ]

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      <Link
        href={`/admin/services/vets/${row.id as string}`}
        className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20"
      >
        View
      </Link>
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
        <h2 className="text-lg font-bold text-on-surface mb-4">Hospitals ({hospitals.length || 0})</h2>
        {hospitals.map(hospital => (
          <div key={hospital.id} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg mb-2">
            <div>
              <div className="font-medium text-on-surface">{hospital.name}</div>
              <div className="text-sm text-on-surface-variant">{hospital.address}</div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={hospital.is_verified ? 'verified' : 'unverified'} />
              <Link
                href={`/admin/services/vets/hospitals/${hospital.id}`}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20"
              >
                Manage
              </Link>
            </div>
          </div>
        ))}
      </div>

      <DataTable columns={columns} data={vets} actions={actions} />
    </div>
  )
}