'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { reviewAdminVerification } from '@/lib/admin/mutations/trust-safety'

interface VerificationsPageClientProps {
  data: Record<string, unknown>[]
  total: number
  page?: number
  perPage?: number
  filters?: { search?: string | null; status?: string | null }
}

export function VerificationsPageClient({ data, total, page = 1, perPage = 25, filters }: VerificationsPageClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirmReject, setConfirmReject] = useState<string | null>(null)
  const [approveTier, setApproveTier] = useState<{id: string; tier: string} | null>(null)

  function goToPage(newPage: number) {
    const params = new URLSearchParams(window.location.search)
    params.set('page', String(newPage))
    startTransition(() => {
      router.push(`/admin/verifications?${params.toString()}`)
    })
  }

  function updateSearch(key: string, value: string) {
    const params = new URLSearchParams(window.location.search)
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    startTransition(() => {
      router.push(`/admin/verifications?${params.toString()}`)
    })
  }

  async function doApprove(userId: string, tier: string) {
    await reviewAdminVerification(userId, 'approved', tier as 'Gold' | 'Silver' | 'Verified' | 'Shelter', 'Approved by admin')
    setApproveTier(null)
    startTransition(() => router.refresh())
  }

  async function doReject(userId: string) {
    await reviewAdminVerification(userId, 'rejected', undefined, 'Rejected by admin')
    setConfirmReject(null)
    startTransition(() => router.refresh())
  }

  const columns = [
    { key: 'full_name', label: 'Name', sortable: true },
    { key: 'contact_email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'verification_status', label: 'Status', render: (v: unknown) => <StatusBadge status={String(v || 'pending')} /> },
    { key: 'created_at', label: 'Submitted', sortable: true, render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
  ]

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      <button
        onClick={() => setApproveTier({ id: row.id as string, tier: 'Verified' })}
        className="px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200"
      >
        Approve
      </button>
      <button
        onClick={() => setConfirmReject(row.id as string)}
        className="px-3 py-1 rounded-lg text-xs font-medium bg-error/10 text-error hover:bg-error/20"
      >
        Reject
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
          Verification Queue
        </h1>
        <p className="text-on-surface-variant">Review and approve verification requests</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface-container-low p-4 rounded-xl">
          <div className="text-2xl font-bold text-on-surface">{data.length || 0}</div>
          <div className="text-sm text-on-surface-variant">Pending Reviews</div>
        </div>
        <div className="bg-surface-container-low p-4 rounded-xl">
          <div className="text-2xl font-bold text-on-surface">0</div>
          <div className="text-sm text-on-surface-variant">Approved Today</div>
        </div>
        <div className="bg-surface-container-low p-4 rounded-xl">
          <div className="text-2xl font-bold text-on-surface">0</div>
          <div className="text-sm text-on-surface-variant">Rejected Today</div>
        </div>
      </div>

      <DataTable columns={columns} data={data} actions={actions} isLoading={isPending} pagination={total !== undefined ? { page, perPage, total, onPageChange: goToPage } : undefined} />

      {filters && (
        <div className="flex gap-4 bg-surface-container-low p-4 rounded-xl">
          <input
            type="search"
            placeholder="Search by name or email..."
            defaultValue={filters.search || ''}
            onChange={(e) => {
              const v = e.target.value
              if (v.length > 2 || v === '') updateSearch('search', v)
            }}
            className="flex-1 px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20"
          />
          <select
            value={filters.status || ''}
            onChange={(e) => updateSearch('status', e.target.value)}
            className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      )}

      {approveTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setApproveTier(null)} />
          <div className="relative bg-surface-container-lowest p-6 rounded-2xl shadow-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-on-surface mb-4">Approve Verification</h3>
            <label className="text-sm font-medium text-on-surface block mb-2">Select Tier</label>
            <select
              value={approveTier.tier}
              onChange={(e) => setApproveTier({ ...approveTier, tier: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20 mb-6"
            >
              <option value="Verified">Verified</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Shelter">Shelter</option>
            </select>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setApproveTier(null)} className="px-4 py-2 rounded-xl hover:bg-surface-container-low font-medium">Cancel</button>
              <button onClick={() => doApprove(approveTier.id, approveTier.tier)} className="px-4 py-2 rounded-xl bg-primary text-on-primary font-medium hover:opacity-90">Approve</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmReject}
        title="Reject Verification"
        message="Are you sure you want to reject this verification request?"
        variant="warning"
        onConfirm={() => confirmReject && doReject(confirmReject)}
        onCancel={() => setConfirmReject(null)}
      />
    </div>
  )
}