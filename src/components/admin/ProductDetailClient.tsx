'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateProduct, deleteProduct } from '@/lib/actions/admin'
import { EntityForm } from '@/components/admin/EntityForm'
import { FormField } from '@/components/admin/FormField'
import { ConfirmDialog } from '@/components/ConfirmDialog'

interface Product {
  id: string
  name: string
  brand: string | null
  category: string | null
  price: number
  stock_quantity: number | null
  seller_id: string | null
  details: unknown | null
  created_at: string
  seller: { full_name: string; contact_email: string } | null
}

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleEdit = () => setIsEditing(true)
  const handleCancel = () => setIsEditing(false)

  const handleUpdateSuccess = () => {
    setIsEditing(false)
    setShowSuccess(true)
    router.refresh()
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    startTransition(async () => {
      const result = await deleteProduct(product.id)
      if (result.success) {
        router.push('/admin/marketplace/products')
      }
    })
    setShowDeleteDialog(false)
  }

  if (isEditing) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-6">
        <h2 className="text-xl font-headline font-bold text-on-surface mb-6">Edit Product</h2>
        <EntityForm
          action={updateProduct.bind(null, product.id)}
          onSuccess={handleUpdateSuccess}
          submitLabel="Update Product"
        >
          <FormField label="Name" name="name" type="text" defaultValue={product.name} required />
          <FormField label="Brand" name="brand" type="text" defaultValue={product.brand || ''} />
          <FormField label="Category" name="category" type="text" defaultValue={product.category || ''} />
          <FormField label="Price" name="price" type="number" defaultValue={product.price} required />
          <FormField label="Stock Quantity" name="stock_quantity" type="number" defaultValue={product.stock_quantity ?? 0} required />
        </EntityForm>
      </div>
    )
  }

  return (
    <>
      {showSuccess && (
        <div className="p-4 rounded-xl bg-green-500/10 text-green-600 text-sm">
          Product updated successfully
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-outline-variant/20">
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary font-medium hover:opacity-90"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl bg-error text-on-error font-medium hover:opacity-90"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Name</label>
              <p className="text-on-surface mt-1">{product.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Brand</label>
              <p className="text-on-surface mt-1">{product.brand || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Category</label>
              <p className="text-on-surface mt-1">{product.category || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Price</label>
              <p className="text-on-surface mt-1">${Number(product.price).toFixed(2)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Stock Quantity</label>
              <p className="text-on-surface mt-1">{product.stock_quantity ?? 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Seller</label>
              <p className="text-on-surface mt-1">{product.seller?.full_name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Seller Email</label>
              <p className="text-on-surface mt-1">{product.seller?.contact_email || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-on-surface-variant">Created</label>
              <p className="text-on-surface mt-1">{new Date(product.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {typeof product.details === 'object' && product.details !== null && Object.keys(product.details as object).length > 0 && (
            <div className="mt-6">
              <label className="text-sm font-medium text-on-surface-variant">Details</label>
              <pre className="mt-2 p-4 bg-surface-container-low rounded-xl text-sm overflow-x-auto">
                {JSON.stringify(product.details, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </>
  )
}