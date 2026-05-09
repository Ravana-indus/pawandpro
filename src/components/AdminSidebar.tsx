"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavItem {
  name: string
  href: string
  icon: string
  exact?: boolean
  permission?: string
}

export function AdminSidebar() {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { name: "Dashboard", href: "/admin", icon: "dashboard", exact: true },
    { name: "Users", href: "/admin/users", icon: "people", exact: false },
    { name: "Verifications", href: "/admin/verifications", icon: "verified_user", exact: false },
    { name: "Products", href: "/admin/marketplace/products", icon: "inventory", exact: false },
    { name: "Pet Listings", href: "/admin/marketplace/listings", icon: "pets", exact: false },
    { name: "Orders", href: "/admin/marketplace/orders", icon: "receipt_long", exact: false },
    { name: "Sellers", href: "/admin/marketplace/sellers", icon: "store", exact: false },
    { name: "Vets & Hospitals", href: "/admin/services/vets", icon: "local_hospital", exact: false },
    { name: "Adoption Centers", href: "/admin/services/adoption", icon: "home", exact: false },
    { name: "Service Providers", href: "/admin/services/providers", icon: "person", exact: false },
    { name: "Bookings", href: "/admin/services/bookings", icon: "event", exact: false },
    { name: "Posts", href: "/admin/community/posts", icon: "article", exact: false },
    { name: "Comments", href: "/admin/community/comments", icon: "comment", exact: false },
    { name: "Moderation Queue", href: "/admin/community/queue", icon: "flag", exact: false },
    { name: "Audit Logs", href: "/admin/audit-logs", icon: "history", exact: false },
    { name: "Settings", href: "/admin/settings", icon: "settings", exact: false },
  ]

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="mb-8 px-4">
        <Link href="/admin" className="block">
          <h3 className="font-headline font-bold text-2xl text-on-surface tracking-tight">Admin Panel</h3>
          <p className="text-sm text-on-surface-variant mt-1">Platform management</p>
        </Link>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href)
            
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors ${
                isActive 
                  ? "bg-primary/10 text-primary font-bold" 
                  : "text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              <span 
                className="material-symbols-outlined" 
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}