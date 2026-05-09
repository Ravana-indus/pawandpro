"use client"

import React from "react"
import { usePathname } from "next/navigation"

export function AdminTopBar() {
  const pathname = usePathname()

  const getTitle = () => {
    if (pathname === "/admin") return "Dashboard"
    if (pathname.includes("/users")) return "User Management"
    if (pathname.includes("/verifications")) return "Verifications"
    if (pathname.includes("/marketplace")) return "Marketplace"
    if (pathname.includes("/services")) return "Services"
    if (pathname.includes("/community")) return "Community"
    if (pathname.includes("/audit")) return "Audit Logs"
    if (pathname.includes("/settings")) return "Settings"
    return "Admin"
  }

  return (
    <header className="h-16 bg-surface-container-low border-b border-outline-variant/20 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <input
          type="search"
          placeholder="Search..."
          className="w-64 px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20 text-sm"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-xl hover:bg-surface-container-low">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <button className="p-2 rounded-xl hover:bg-surface-container-low">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  )
}