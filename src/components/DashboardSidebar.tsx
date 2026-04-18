"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: "dashboard", exact: true },
    { name: "My Pets", href: "/dashboard/pets", icon: "pets", exact: false },
    { name: "Order History", href: "/dashboard/orders", icon: "receipt_long", exact: false },
    { name: "Appointments", href: "/dashboard/appointments", icon: "event_upcoming", exact: false },
    { name: "Health Records", href: "/dashboard/records", icon: "folder_shared", exact: false },
    { name: "Rewards", href: "/rewards", icon: "stars", exact: false },
    { name: "Settings", href: "/dashboard/settings", icon: "settings", exact: false }
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="mb-8 px-4">
        <h3 className="font-headline font-bold text-2xl text-on-surface tracking-tight">Family Dashboard</h3>
        <p className="text-sm text-on-surface-variant mt-1">Manage your pets & orders</p>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href);
            
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
          );
        })}
      </nav>

      <div className="mt-12 px-4">
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
           <div className="flex items-center gap-2 mb-2">
             <span className="material-symbols-outlined text-tertiary">workspace_premium</span>
             <h4 className="font-bold text-sm">Pro Membership</h4>
           </div>
           <p className="text-xs text-on-surface-variant mb-3">You are saving 15% on all clinical nutrition orders.</p>
           <Link href="/dashboard/subscriptions" className="text-xs font-bold text-primary hover:underline">Manage Subscription</Link>
        </div>
      </div>
    </aside>
  );
}
