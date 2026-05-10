import React from "react"
import { notFound } from "next/navigation"
import { getProductById } from "@/lib/queries/admin"
import { EntityHeader } from "@/components/admin/EntityHeader"
import { ProductDetailClient } from "@/components/admin/ProductDetailClient"

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  const { data: product, error } = await getProductById(id)

  if (error || !product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <EntityHeader
        title={product.name as string}
        subtitle={`Product details`}
        backHref="/admin/marketplace/products"
        backLabel="Products"
      />
      <ProductDetailClient product={product as Parameters<typeof ProductDetailClient>[0]['product']} />
    </div>
  )
}