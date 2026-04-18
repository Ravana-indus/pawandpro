import React from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default function TrackOrderPage() {
  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
      <DashboardSidebar />

      <main className="flex-1">
        <div className="mb-6 flex items-center gap-2 text-sm text-on-surface-variant">
          <Link href="/dashboard/orders" className="hover:text-primary transition-colors font-medium">Order History</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="font-bold text-on-surface">Track Order #PZ-9102</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-headline font-extrabold mb-8 text-on-surface tracking-tight">Live Tracking</h1>
        
        <div className="bg-surface-container-lowest p-8 md:p-12 rounded-3xl border border-outline-variant/20 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full pointer-events-none -z-10 translate-x-1/4 -translate-y-1/4"></div>

           <div className="text-center mb-16 relative z-10">
             <div className="w-28 h-28 bg-primary/10 border-4 border-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 relative shadow-inner">
                <div className="absolute inset-0 rounded-full border border-primary animate-ping opacity-30"></div>
                <span className="material-symbols-outlined text-5xl text-primary drop-shadow-md">local_shipping</span>
             </div>
             <h2 className="text-3xl font-headline font-bold mb-2 text-on-surface">Out for Delivery</h2>
             <p className="text-lg text-on-surface-variant max-w-md mx-auto">Your package is en route with PetZen Courier and should arrive by <strong>6:00 PM today</strong>.</p>
           </div>
           
           <div className="mb-12 border border-outline-variant/20 rounded-2xl p-6 flex items-center justify-between bg-surface-container-low shadow-inner">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/30">
                    <span className="material-symbols-outlined text-on-surface-variant">location_on</span>
                 </div>
                 <div>
                   <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-1">Destination</p>
                   <p className="font-bold text-on-surface">142 Havelock Rd, Colombo 05</p>
                 </div>
              </div>
           </div>
           
           <div className="max-w-xl mx-auto relative pl-4 md:pl-0">
              {/* Vertical Line */}
              <div className="absolute left-[34px] md:left-[23px] top-4 bottom-4 w-1 bg-surface-container-highest rounded-full -z-10"></div>
              {/* Active Line Segment */}
              <div className="absolute left-[34px] md:left-[23px] top-4 h-[70%] w-1 bg-primary rounded-full -z-10 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>
              
              <div className="flex items-start gap-6 mb-10 group">
                 <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shrink-0 border-2 border-surface-container-lowest z-10 mt-1">
                   <span className="material-symbols-outlined text-[18px]">check</span>
                 </div>
                 <div className="bg-surface-container-lowest border border-outline-variant/20 p-5 rounded-2xl flex-1 shadow-sm group-hover:shadow-md transition-shadow">
                   <p className="font-bold text-lg text-on-surface mb-1">Order Placed &amp; Verified</p>
                   <p className="text-sm font-medium text-on-surface-variant flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">schedule</span> Nov 18, 2024 - 10:00 AM</p>
                 </div>
              </div>
              
              <div className="flex items-start gap-6 mb-10 group">
                 <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shrink-0 border-2 border-surface-container-lowest z-10 mt-1">
                   <span className="material-symbols-outlined text-[18px]">check</span>
                 </div>
                 <div className="bg-surface-container-lowest border border-outline-variant/20 p-5 rounded-2xl flex-1 shadow-sm group-hover:shadow-md transition-shadow">
                   <p className="font-bold text-lg text-on-surface mb-1">Processed at Fulfillment Center</p>
                   <p className="text-sm font-medium text-on-surface-variant flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">schedule</span> Nov 18, 2024 - 02:00 PM</p>
                 </div>
              </div>
              
              <div className="flex items-start gap-6 mb-10 group">
                 <div className="w-10 h-10 rounded-full bg-surface-container-lowest border-2 border-primary text-primary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0 z-10 mt-1 relative">
                   <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
                   <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                 </div>
                 <div className="bg-primary/5 border border-primary/30 p-5 rounded-2xl flex-1 shadow-sm">
                   <p className="font-bold text-lg text-primary mb-1">Out for Delivery</p>
                   <p className="text-sm font-medium text-on-surface-variant flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-primary">schedule</span> Today - 08:30 AM</p>
                   <p className="text-xs mt-3 bg-surface-container-lowest inline-block px-3 py-1.5 rounded-lg border border-primary/20 text-on-surface-variant font-medium">Your driver is <span className="font-bold text-on-surface">Kamal</span></p>
                 </div>
              </div>
              
              <div className="flex items-start gap-6 group opacity-60 grayscale group-hover:grayscale-0 transition-all">
                 <div className="w-10 h-10 rounded-full bg-surface-container-highest border-2 border-surface-container-lowest text-on-surface-variant flex items-center justify-center shrink-0 z-10 mt-1">
                   <span className="material-symbols-outlined text-[18px]">home</span>
                 </div>
                 <div className="bg-surface-container-lowest border border-outline-variant/20 p-5 rounded-2xl flex-1">
                   <p className="font-bold text-lg text-on-surface mb-1">Delivered</p>
                   <p className="text-sm font-medium text-on-surface-variant">Pending Signature</p>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
