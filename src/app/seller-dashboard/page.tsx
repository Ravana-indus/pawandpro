import React from "react"
import Link from "next/link"

export default function SellerDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-extrabold text-on-surface">Seller Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/seller-dashboard/products" className="bg-surface-container-low p-6 rounded-2xl hover:bg-surface-container-high">
          <span className="material-symbols-outlined text-3xl text-tertiary">inventory</span>
          <h3 className="text-lg font-bold text-on-surface mt-2">My Products</h3>
          <p className="text-sm text-on-surface-variant">Manage product listings</p>
        </Link>
        <Link href="/seller-dashboard/pets" className="bg-surface-container-low p-6 rounded-2xl hover:bg-surface-container-high">
          <span className="material-symbols-outlined text-3xl text-tertiary">pets</span>
          <h3 className="text-lg font-bold text-on-surface mt-2">Pet Listings</h3>
          <p className="text-sm text-on-surface-variant">List pets for sale or adoption</p>
        </Link>
        <Link href="/seller-dashboard/orders" className="bg-surface-container-low p-6 rounded-2xl hover:bg-surface-container-high">
          <span className="material-symbols-outlined text-3xl text-tertiary">receipt_long</span>
          <h3 className="text-lg font-bold text-on-surface mt-2">Orders</h3>
          <p className="text-sm text-on-surface-variant">View and manage orders</p>
        </Link>
      </div>
    </div>
  )
}