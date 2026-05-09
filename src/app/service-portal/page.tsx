import React from "react"
import Link from "next/link"

export default function ServicePortal() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-extrabold text-on-surface">Service Portal</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/service-portal/bookings" className="bg-surface-container-low p-6 rounded-2xl hover:bg-surface-container-high">
          <span className="material-symbols-outlined text-3xl text-primary">event</span>
          <h3 className="text-lg font-bold text-on-surface mt-2">My Bookings</h3>
          <p className="text-sm text-on-surface-variant">View and manage service bookings</p>
        </Link>
        <Link href="/service-portal/availability" className="bg-surface-container-low p-6 rounded-2xl hover:bg-surface-container-high">
          <span className="material-symbols-outlined text-3xl text-primary">schedule</span>
          <h3 className="text-lg font-bold text-on-surface mt-2">Availability</h3>
          <p className="text-sm text-on-surface-variant">Set your service schedule</p>
        </Link>
        <Link href="/service-portal/settings" className="bg-surface-container-low p-6 rounded-2xl hover:bg-surface-container-high">
          <span className="material-symbols-outlined text-3xl text-primary">settings</span>
          <h3 className="text-lg font-bold text-on-surface mt-2">Settings</h3>
          <p className="text-sm text-on-surface-variant">Manage your profile and services</p>
        </Link>
      </div>
    </div>
  )
}