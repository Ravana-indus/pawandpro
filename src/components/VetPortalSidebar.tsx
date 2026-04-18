"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function VetPortalSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/vet-portal", icon: "dashboard", exact: true },
    { name: "Appointments", href: "/vet-portal/appointments", icon: "calendar_month", exact: false },
    { name: "Patients", href: "/vet-portal/patients", icon: "pest_control", exact: false },
    { name: "Prescriptions", href: "/vet-portal/prescriptions", icon: "prescriptions", exact: false },
    { name: "Earnings", href: "/vet-portal/earnings", icon: "payments", exact: false },
    { name: "Clinic Settings", href: "/vet-portal/settings", icon: "settings", exact: false }
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="mb-8 px-4">
         <div className="flex items-center gap-2 mb-2">
           <span className="material-symbols-outlined text-tertiary">local_hospital</span>
           <span className="font-label text-xs uppercase tracking-widest text-tertiary font-bold block">Provider</span>
         </div>
        <h3 className="font-headline font-bold text-2xl text-on-surface tracking-tight">Vet Portal</h3>
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
                  ? "bg-tertiary/10 text-tertiary font-bold" 
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
             <span className="material-symbols-outlined text-primary">verified</span>
             <h4 className="font-bold text-sm">SLVC Verified</h4>
           </div>
           <p className="text-xs text-on-surface-variant mb-3">Your license is valid until 2027.</p>
           <button className="text-xs font-bold text-tertiary hover:underline">Update Credentials</button>
        </div>
      </div>
    </aside>
  );
}
