'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { deleteProduct } from '@/lib/actions/admin'
import { DataTable } from '@/components/DataTable'
import { ConfirmDialog } from '@/components/ConfirmDialog'

interface ProductsPageClientProps {
  products: Record<string, unknown>[]
}

export function ProductsPageClient({ products }: ProductsPageClientProps) {
  const router = useRouter()
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [isPending, startTransition] = useTransition()

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

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
            Products
          </h1>
          <p className="text-on-surface-variant">Manage all products in the marketplace</p>
        </div>
        <DataTable columns={columns} data={products} actions={actions} />
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