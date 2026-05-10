'use client'

import React, { useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AdminDataTable } from '@/components/admin/AdminDataTable'
import { AdminFilterBar } from '@/components/admin/AdminFilterBar'
import { ActionReasonDialog } from '@/components/admin/ActionReasonDialog'
import { updateAdminProviderVerification } from '@/lib/admin/mutations/services'
import { StatusBadge } from '@/components/admin/StatusBadge'
import type { AdminListResult } from '@/lib/admin/types'
import type { AdminProviderListItem } from '@/lib/admin/queries/services'

interface ProvidersPageClientProps {
  result: AdminListResult<AdminProviderListItem>
}

const PROVIDER_STATUS_OPTIONS = [
  { value: "verified", label: "Verified" },
  { value: "unverified", label: "Unverified" },
]

const PROVIDER_SORT_OPTIONS = [
  { value: "updated_at", label: "Updated At" },
  { value: "service_type", label: "Service Type" },
  { value: "specialization", label: "Specialization" },
  { value: "service_fee", label: "Service Fee" },
  { value: "is_verified", label: "Verification" },
]

export function ProvidersPageClient({ result }: ProvidersPageClientProps) {
  const [, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryEntries = Object.fromEntries(searchParams.entries())
  delete queryEntries.page

  const handleVerifyToggle = (id: string, currentVerified: boolean) => {
    return async (reason: string) => {
      const actionResult = await updateAdminProviderVerification(id, !currentVerified, reason)
      if (actionResult.success) {
        startTransition(() => {
          router.refresh()
        })
      }

      return actionResult
    }
  }

  const columns = [
    { key: "full_name", label: "Name", sortable: true, render: (_: unknown, row: Record<string, unknown>) => ((row.profile as {full_name: string})?.full_name || 'N/A') },
    { key: "service_type", label: "Service Type", sortable: true },
    { key: "specialization", label: "Specialization", render: (v: unknown) => v ? String(v) : "General" },
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
      <ActionReasonDialog
        triggerLabel={row.is_verified ? "Unverify" : "Verify"}
        title={row.is_verified ? "Unverify Provider" : "Verify Provider"}
        description="Provide a reason for this verification change."
        confirmLabel={row.is_verified ? "Unverify Provider" : "Verify Provider"}
        onConfirm={handleVerifyToggle(row.id as string, row.is_verified as boolean)}
      />
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
      <AdminFilterBar
        basePath="/admin/services/providers"
        searchPlaceholder="Search service type, specialization, license..."
        statusOptions={PROVIDER_STATUS_OPTIONS}
        sortOptions={PROVIDER_SORT_OPTIONS}
        defaults={{
          search: searchParams.get("search") ?? "",
          status: searchParams.get("status") ?? "",
          sort: searchParams.get("sort") ?? "updated_at",
          direction: searchParams.get("direction") === "asc" ? "asc" : "desc",
          perPage: result.perPage,
        }}
      />
      <AdminDataTable
        columns={columns}
        data={result.data as Record<string, unknown>[]}
        actions={actions}
        pagination={{
          basePath: "/admin/services/providers",
          page: result.page,
          totalPages: result.totalPages,
          query: queryEntries,
        }}
      />
    </div>
  )
}
