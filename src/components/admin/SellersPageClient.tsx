"use client"

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'

interface SellersPageClientProps {
  initialData: Record<string, unknown>[]
  total: number
  page: number
  filters: { role?: string; status?: 'active' | 'banned' | 'pending'; search?: string }
}

const SELLER_ROLES = [
  { value: '', label: 'All Roles' },
  { value: 'BREEDER', label: 'Breeder' },
  { value: 'INDIVIDUAL_SELLER', label: 'Individual Seller' },
  { value: 'ADOPTION_PROVIDER', label: 'Adoption Provider' },
  { value: 'SELLER', label: 'Seller' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'banned', label: 'Banned' },
]

export function SellersPageClient({ initialData, total, page, filters }: SellersPageClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function updateQuery(key: string, value: string) {
    const params = new URLSearchParams(window.location.search)
    if (value) params.set(key, value)
    else params.delete(key)
    if (key !== 'page') params.delete('page')
    startTransition(() => {
      router.push(`/admin/marketplace/sellers?${params.toString()}`)
    })
  }

  function goToPage(newPage: number) {
    const params = new URLSearchParams(window.location.search)
    params.set('page', String(newPage))
    startTransition(() => {
      router.push(`/admin/marketplace/sellers?${params.toString()}`)
    })
  }

  const columns = [
    { key: 'full_name', label: 'Name', sortable: true },
    { key: 'contact_email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone' },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'is_verified', label: 'Verified', sortable: true, render: (v: unknown) => <StatusBadge status={v ? 'verified' : 'unverified'} /> },
    { key: 'verification_status', label: 'Status', render: (v: unknown) => <StatusBadge status={String(v || 'pending')} /> },
    { key: 'created_at', label: 'Joined', sortable: true, render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
  ]

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      <Link href={`/admin/users/${row.id}`} className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20">View</Link>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Sellers</h1>
        <p className="text-on-surface-variant">Manage all sellers in the marketplace</p>
      </div>

      <div className="flex gap-4 bg-surface-container-low p-4 rounded-xl">
        <select value={filters.role || ''} onChange={(e) => updateQuery('role', e.target.value)} className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          {SELLER_ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <select value={filters.status || ''} onChange={(e) => updateQuery('status', e.target.value)} className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <input
          type="search"
          placeholder="Search by name or email..."
          defaultValue={filters.search || ''}
          onChange={(e) => { const v = e.target.value; if (v.length > 2 || v === '') updateQuery('search', v) }}
          className="flex-1 px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20"
        />
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
    </div>
  )
}
