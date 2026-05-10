'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/DataTable'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { banUser, unbanUser } from '@/lib/actions/admin'

interface UsersPageClientProps {
  initialData: Record<string, unknown>[]
  total: number
  page: number
  filters: { role?: string; status?: 'active' | 'banned' | 'pending'; search?: string }
}

export function UsersPageClient({ initialData, total, page, filters }: UsersPageClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirmBan, setConfirmBan] = useState<string | null>(null)
  const [confirmUnban, setConfirmUnban] = useState<string | null>(null)

  function updateQuery(key: string, value: string) {
    const params = new URLSearchParams(window.location.search)
    if (value) params.set(key, value)
    else params.delete(key)
    if (key !== 'page') params.delete('page')
    startTransition(() => {
      router.push(`/admin/users?${params.toString()}`)
    })
  }

  function goToPage(newPage: number) {
    const params = new URLSearchParams(window.location.search)
    params.set('page', String(newPage))
    startTransition(() => {
      router.push(`/admin/users?${params.toString()}`)
    })
  }

  async function handleBan(userId: string) {
    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('reason', 'Admin action')
    await banUser(formData)
    setConfirmBan(null)
    router.refresh()
  }

  async function handleUnban(userId: string) {
    await unbanUser(userId)
    setConfirmUnban(null)
    router.refresh()
  }

  const columns = [
    { key: 'full_name', label: 'Name', sortable: true },
    { key: 'contact_email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'is_verified', label: 'Verified', sortable: true, render: (v: unknown) => <StatusBadge status={v ? 'verified' : 'unverified'} /> },
    { key: 'verification_status', label: 'Status', render: (v: unknown) => <StatusBadge status={String(v || 'pending')} /> },
    { key: 'created_at', label: 'Joined', sortable: true, render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
  ]

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      <Link href={`/admin/users/${row.id}`} className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20">View</Link>
      {row.banned_until ? (
        <button onClick={() => setConfirmUnban(row.id as string)} className="px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200">Unban</button>
      ) : (
        <button onClick={() => setConfirmBan(row.id as string)} className="px-3 py-1 rounded-lg text-xs font-medium bg-error/10 text-error hover:bg-error/20">Ban</button>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">User Management</h1>
        <p className="text-on-surface-variant">Manage all platform users, roles, and permissions</p>
      </div>

      <div className="flex gap-4 bg-surface-container-low p-4 rounded-xl">
        <select value={filters.role || ''} onChange={(e) => updateQuery('role', e.target.value)} className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <option value="">All Roles</option>
          <option value="CUSTOMER">Customer</option>
          <option value="BREEDER">Breeder</option>
          <option value="INDIVIDUAL_SELLER">Individual Seller</option>
          <option value="VET">Veterinarian</option>
          <option value="ADOPTION_PROVIDER">Adoption Provider</option>
        </select>
        <select value={filters.status || ''} onChange={(e) => updateQuery('status', e.target.value)} className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="banned">Banned</option>
        </select>
        <input type="search" placeholder="Search by name or email..." defaultValue={filters.search || ''}
          onChange={(e) => { const v = e.target.value; if (v.length > 2 || v === '') updateQuery('search', v) }}
          className="flex-1 px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20" />
      </div>

      <DataTable
        columns={columns}
        data={initialData}
        actions={actions}
        isLoading={isPending}
        pagination={{
          page,
          perPage: 25,
          total,
          onPageChange: goToPage,
        }}
      />

      <ConfirmDialog open={!!confirmBan} title="Ban User" message="Are you sure you want to ban this user?" onConfirm={() => confirmBan && handleBan(confirmBan)} onCancel={() => setConfirmBan(null)} />
      <ConfirmDialog open={!!confirmUnban} title="Unban User" message="Are you sure you want to unban this user?" variant="info" onConfirm={() => confirmUnban && handleUnban(confirmUnban)} onCancel={() => setConfirmUnban(null)} />
    </div>
  )
}