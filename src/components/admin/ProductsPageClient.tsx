'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { deleteProduct } from '@/lib/actions/admin'
import { AdminDataTable } from '@/components/admin/AdminDataTable'
import { AdminFilterBar } from '@/components/admin/AdminFilterBar'
import { AdminPagination } from '@/components/admin/AdminPagination'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import type { AdminListResult } from '@/lib/admin/types'
import type { AdminProductListItem } from '@/lib/admin/queries/marketplace'

interface ProductsPageClientProps {
  result: AdminListResult<AdminProductListItem>
}

const PRODUCT_STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Out of Stock', label: 'Out of Stock' },
]

const PRODUCT_SORT_OPTIONS = [
  { value: 'created_at', label: 'Created At' },
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Price' },
  { value: 'brand', label: 'Brand' },
  { value: 'category', label: 'Category' },
  { value: 'stock_quantity', label: 'Stock Quantity' },
  { value: 'status', label: 'Status' },
]

export function ProductsPageClient({ result }: ProductsPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [, startTransition] = useTransition()

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'seller', label: 'Seller', render: (v: unknown) => (v as { full_name: string } | null)?.full_name || 'N/A' },
    { key: 'brand', label: 'Brand', sortable: true },
    { key: 'price', label: 'Price', sortable: true, render: (v: unknown) => `$${Number(v).toFixed(2)}` },
    { key: 'stock_quantity', label: 'Stock', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'created_at', label: 'Added', sortable: true, render: (v: unknown) => new Date(String(v)).toLocaleDateString() },
  ]

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name })
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    startTransition(async () => {
      const result = await deleteProduct(deleteTarget.id)
      if (result.success) {
        router.refresh()
      }
      setDeleteTarget(null)
    })
  }

  const actions = (row: Record<string, unknown>) => (
    <div className="flex gap-2 justify-end">
      <Link
        href={`/admin/marketplace/products/${row.id as string}`}
        className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20"
      >
        Edit
      </Link>
      <button
        onClick={() => handleDeleteClick(row.id as string, row.name as string)}
        className="px-3 py-1 rounded-lg text-xs font-medium bg-error/10 text-error hover:bg-error/20"
      >
        Delete
      </button>
    </div>
  )

  const queryEntries = Object.fromEntries(searchParams.entries())
  delete queryEntries.page

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
            Products
          </h1>
          <p className="text-on-surface-variant">Manage all products in the marketplace</p>
        </div>
        <AdminFilterBar
          basePath="/admin/marketplace/products"
          searchPlaceholder="Search name, brand, category..."
          statusOptions={PRODUCT_STATUS_OPTIONS}
          sortOptions={PRODUCT_SORT_OPTIONS}
          defaults={{
            search: searchParams.get('search') ?? '',
            status: searchParams.get('status') ?? '',
            sort: searchParams.get('sort') ?? 'created_at',
            direction: searchParams.get('direction') === 'asc' ? 'asc' : 'desc',
            perPage: result.perPage,
          }}
        />
        <AdminDataTable columns={columns} data={result.data as Record<string, unknown>[]} actions={actions} />
        <AdminPagination
          basePath="/admin/marketplace/products"
          page={result.page}
          totalPages={result.totalPages}
          query={queryEntries}
        />
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}
