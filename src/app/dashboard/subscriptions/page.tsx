import React from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function SubscriptionsPage() {
  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
      <DashboardSidebar />
      <main className="flex-1 space-y-8">
        <header className="mb-8">
          <h1 className="text-4xl font-headline font-extrabold text-on-surface mb-2">My Subscriptions</h1>
          <p className="text-on-surface-variant text-lg">Manage your recurring deliveries and clinical boxes.</p>
        </header>

        {/* Active Subscription Box */}
        <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-8 shadow-sm">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined">inventory_2</span>
                 </div>
                 <div>
                    <h3 className="text-xl font-bold font-headline text-on-surface">Wellness Box (Dog)</h3>
                    <p className="text-sm text-on-surface-variant font-medium">Billed every 4 weeks</p>
                 </div>
              </div>
              <span className="bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-1">
                 <span className="material-symbols-outlined text-[14px]">check_circle</span> Active
              </span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                 <h4 className="font-bold text-sm text-on-surface-variant mb-4 uppercase tracking-wider">Next Delivery</h4>
                 <div className="flex items-center gap-4 text-on-surface">
                    <span className="material-symbols-outlined text-3xl text-primary">calendar_month</span>
                    <div>
                       <p className="font-black text-xl">Monday, Oct 12</p>
                       <p className="text-sm font-medium">Delivering to Colombo 07</p>
                    </div>
                 </div>
              </div>
              <div>
                 <h4 className="font-bold text-sm text-on-surface-variant mb-4 uppercase tracking-wider">Current Box Contents</h4>
                 <ul className="space-y-3">
                    <li className="flex justify-between items-center text-sm font-medium">
                       <span className="text-on-surface flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Gourmet Salmon & Sweet Potato (12kg)</span>
                       <span className="text-on-surface-variant">Rs. 25,000</span>
                    </li>
                    <li className="flex justify-between items-center text-sm font-medium">
                       <span className="text-on-surface flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Omega Serum +</span>
                       <span className="text-on-surface-variant">Rs. 8,500</span>
                    </li>
                 </ul>
              </div>
           </div>

           <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm font-bold mb-8">
              <div className="flex items-center gap-2 text-primary">
                 <span className="material-symbols-outlined">payments</span>
                 <span>Total Billed: Rs. 28,475 <span className="opacity-70 font-medium">(Includes 15% Box Savings)</span></span>
              </div>
              <button className="text-primary hover:underline group flex items-center gap-1">
                View Invoice <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
           </div>

           <div className="flex flex-wrap gap-3">
              <Link href="/marketplace" className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm transition-colors text-sm">
                Add Products
              </Link>
              <button className="bg-surface-container-high hover:bg-surface-dim text-on-surface font-bold px-6 py-2.5 rounded-xl transition-colors text-sm">
                Skip Next Delivery
              </button>
              <button className="bg-surface-container hover:bg-error/10 hover:text-error text-on-surface-variant font-bold px-6 py-2.5 rounded-xl transition-colors text-sm ml-auto">
                Cancel Subscription
              </button>
           </div>
        </section>

      </main>
    </div>
  );
}
