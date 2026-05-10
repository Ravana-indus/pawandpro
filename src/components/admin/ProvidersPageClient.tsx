'use client'

import React, { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/DataTable'
import { updateProviderStatus } from '@/lib/actions/admin'
import { StatusBadge } from '@/components/admin/StatusBadge'

interface ProvidersPageClientProps {
  data: Record<string, unknown>[]
}

export function ProvidersPageClient({ data }: ProvidersPageClientProps) {
  const [, startTransition] = useTransition()
  const router = useRouter()

  const handleVerifyToggle = (id: string, currentVerified: boolean) => {
    startTransition(async () => {
      await updateProviderStatus(id, !currentVerified)
      router.refresh()
    })
  }

  const columns = [
    { key: "full_name", label: "Name", sortable: true, render: (_: unknown, row: Record<string, unknown>) => ((row.profile as {full_name: string})?.full_name || 'N/A') },
    { key: "service_type", label: "Service Type", sortable: true },
    { key: "specialization", label: "Specialization" },
    { key: "is_verified", label: "Verified", render: (v: unknown) => (
      <StatusBadge status={v ? 'verified' : 'pending'} />
    )},
    { key: "service_fee", label: "Fee", render: (v: unknown) => v ? `$${Number(v).toFixed(2)}` : 'N/A' },
    { key: "is_available_now", label: "Available", render: (v: unknown) => (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${v ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
        {v ? 'Yes' : 'No'}
      </span>
    )},
  ]

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      <Link
        href={`/admin/services/providers/${row.id as string}`}
        className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20"
      >
        View
      </Link>
      <button
        onClick={() => handleVerifyToggle(row.id as string, row.is_verified as boolean)}
        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
          row.is_verified
            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            : 'bg-green-100 text-green-700 hover:bg-green-200'
        }`}
      >
        {row.is_verified ? 'Unverify' : 'Verify'}
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
          Service Providers
        </h1>
        <p className="text-on-surface-variant">Manage groomers, trainers, and transporters</p>
      </div>
      <DataTable columns={columns} data={data} actions={actions} />
    </div>
  )
}