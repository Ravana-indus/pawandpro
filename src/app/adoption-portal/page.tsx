import React from "react"
import Link from "next/link"

export default function AdoptionPortal() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-extrabold text-on-surface">Adoption Portal</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/adoption-portal/pets" className="bg-surface-container-low p-6 rounded-2xl hover:bg-surface-container-high">
          <span className="material-symbols-outlined text-3xl text-secondary">pets</span>
          <h3 className="text-lg font-bold text-on-surface mt-2">Adoptable Pets</h3>
          <p className="text-sm text-on-surface-variant">Manage adoption listings</p>
        </Link>
        <Link href="/adoption-portal/applications" className="bg-surface-container-low p-6 rounded-2xl hover:bg-surface-container-high">
          <span className="material-symbols-outlined text-3xl text-secondary">description</span>
          <h3 className="text-lg font-bold text-on-surface mt-2">Applications</h3>
          <p className="text-sm text-on-surface-variant">Review adoption applications</p>
        </Link>
        <Link href="/adoption-portal/settings" className="bg-surface-container-low p-6 rounded-2xl hover:bg-surface-container-high">
          <span className="material-symbols-outlined text-3xl text-secondary">settings</span>
          <h3 className="text-lg font-bold text-on-surface mt-2">Center Settings</h3>
          <p className="text-sm text-on-surface-variant">Manage your adoption center</p>
        </Link>
      </div>
    </div>
  )
}