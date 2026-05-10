"use client"

import React from "react"
import Link from "next/link"
import { DataTable } from "@/components/DataTable"

interface UsersPageClientProps {
  initialData: Record<string, unknown>[]
  total: number
}

export function UsersPageClient({ initialData, total }: UsersPageClientProps) {
  const columns = [
    { key: "full_name", label: "Name", sortable: true },
    { key: "contact_email", label: "Email", sortable: true },
    { key: "role", label: "Role", sortable: true },
    { key: "is_verified", label: "Verified", sortable: true, render: (v: unknown) => (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${v ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
        {v ? 'Verified' : 'Unverified'}
      </span>
    )},
    { key: "verification_status", label: "Status", render: (v: unknown) => (
      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700">
        {String(v || 'N/A')}
      </span>
    )},
    { key: "created_at", label: "Joined", sortable: true, render: (v: unknown) => (
      new Date(String(v)).toLocaleDateString()
    )},
  ]

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      <Link
        href={`/admin/users/${row.id}`}
        className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20"
      >
        View
      </Link>
      <button className="px-3 py-1 rounded-lg text-xs font-medium bg-warning/10 text-warning hover:bg-warning/20">
        Suspend
      </button>
      <button className="px-3 py-1 rounded-lg text-xs font-medium bg-error/10 text-error hover:bg-error/20">
        Ban
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
          User Management
        </h1>
        <p className="text-on-surface-variant">Manage all platform users, roles, and permissions</p>
      </div>

      <div className="flex gap-4 bg-surface-container-low p-4 rounded-xl">
        <select className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <option value="">All Roles</option>
          <option value="CUSTOMER">Customer</option>
          <option value="BREEDER">Breeder</option>
          <option value="INDIVIDUAL_SELLER">Individual Seller</option>
          <option value="VET">Veterinarian</option>
          <option value="ADOPTION_PROVIDER">Adoption Provider</option>
        </select>
        <select className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="banned">Banned</option>
        </select>
        <input
          type="search"
          placeholder="Search by name or email..."
          className="flex-1 px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20"
        />
      </div>

      <DataTable
        columns={columns}
        data={initialData}
        actions={actions}
        selectable
        pagination={{
          page: 1,
          perPage: 25,
          total,
          onPageChange: () => {}
        }}
      />
    </div>
  )
}