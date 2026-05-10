"use client"

import React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AdminDataTable } from "@/components/admin/AdminDataTable"
import { AdminFilterBar } from "@/components/admin/AdminFilterBar"
import { StatusBadge } from "@/components/admin/StatusBadge"
import type { AdminListResult } from "@/lib/admin/types"
import type { AdminHospitalListItem } from "@/lib/admin/queries/services"

interface VetsPageClientProps {
  result: AdminListResult<Record<string, unknown>>
  hospitals: AdminHospitalListItem[]
}

const VET_SORT_OPTIONS = [
  { value: "created_at", label: "Joined Date" },
  { value: "full_name", label: "Name" },
  { value: "contact_email", label: "Email" },
]

function getVetServiceDetails(row: Record<string, unknown>) {
  const value = row.service_provider_details
  if (Array.isArray(value)) {
    return (value[0] ?? {}) as Record<string, unknown>
  }

  if (value && typeof value === "object") {
    return value as Record<string, unknown>
  }

  return {}
}

export function VetsPageClient({ result, hospitals }: VetsPageClientProps) {
  const searchParams = useSearchParams()
  const queryEntries = Object.fromEntries(searchParams.entries())
  delete queryEntries.page

  const columns = [
    { key: "full_name", label: "Name", sortable: true },
    { key: "contact_email", label: "Email", sortable: true },
    {
      key: "specialization",
      label: "Specialization",
      render: (_: unknown, row: Record<string, unknown>) => {
        const details = getVetServiceDetails(row)
        return String(details.specialization || "General")
      },
    },
    {
      key: "is_verified",
      label: "Verified",
      render: (_: unknown, row: Record<string, unknown>) => {
        const details = getVetServiceDetails(row)
        return <StatusBadge status={details.is_verified ? 'verified' : 'unverified'} />
      },
    },
    {
      key: "service_fee",
      label: "Fee",
      render: (_: unknown, row: Record<string, unknown>) => {
        const details = getVetServiceDetails(row)
        return details.service_fee ? `$${Number(details.service_fee).toFixed(2)}` : 'N/A'
      },
    },
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

      <AdminFilterBar
        basePath="/admin/services/vets"
        searchPlaceholder="Search vet name or email..."
        sortOptions={VET_SORT_OPTIONS}
        defaults={{
          search: searchParams.get("search") ?? "",
          sort: searchParams.get("sort") ?? "created_at",
          direction: searchParams.get("direction") === "asc" ? "asc" : "desc",
          perPage: result.perPage,
        }}
      />

      <AdminDataTable
        columns={columns}
        data={result.data}
        actions={actions}
        pagination={{
          basePath: "/admin/services/vets",
          page: result.page,
          totalPages: result.totalPages,
          query: queryEntries,
        }}
      />
    </div>
  )
}
