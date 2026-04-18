import React from "react";
import { VetPortalSidebar } from "@/components/VetPortalSidebar";
import Link from "next/link";
import { getVets } from "@/lib/queries";

export default async function VetPortalDashboardPage() {
  const vets = await getVets();
  const vetProfile = vets[0];
  
  if (!vetProfile) {
    return (
      <div className="pt-24 pb-32 px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Vet Portal</h1>
        <p className="mb-8">Access restricted to registered veterinarians. Please log in with a vet account.</p>
        <Link href="/login" className="bg-primary text-white px-8 py-3 rounded-xl font-bold">Log In</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
      <VetPortalSidebar />
      
      <main className="flex-1 space-y-8">
         <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-headline font-extrabold text-on-surface mb-2">Welcome, {vetProfile.full_name}</h1>
              <p className="text-on-surface-variant text-lg">You have 4 appointments and 2 pending prescriptions today.</p>
            </div>
            <div className="flex items-center gap-3">
               <button className="bg-tertiary text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-tertiary/90 transition-colors shadow-sm">
                 <span className="material-symbols-outlined text-[18px]">add</span> New Record
               </button>
            </div>
         </header>

         {/* Stats Row */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/20 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 rounded-bl-full pointer-events-none"></div>
               <span className="material-symbols-outlined text-tertiary mb-4">calendar_month</span>
               <h4 className="text-on-surface-variant text-sm font-medium mb-1">Today's Queue</h4>
               <p className="text-3xl font-black font-headline text-on-surface">4</p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/20 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full pointer-events-none"></div>
               <span className="material-symbols-outlined text-secondary mb-4">prescriptions</span>
               <h4 className="text-on-surface-variant text-sm font-medium mb-1">Pending Prescriptions</h4>
               <p className="text-3xl font-black font-headline text-on-surface">2</p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/20 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full pointer-events-none"></div>
               <span className="material-symbols-outlined text-primary mb-4">payments</span>
               <h4 className="text-on-surface-variant text-sm font-medium mb-1">Earnings Today</h4>
               <p className="text-3xl font-black font-headline text-on-surface">Rs. 18,000</p>
            </div>
         </div>

         {/* Today's Schedule */}
         <section className="bg-surface-container-lowest rounded-3xl border border-outline-variant/20 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
               <h2 className="text-xl font-bold font-headline flex items-center gap-2 text-on-surface">
                 <span className="material-symbols-outlined text-tertiary">schedule</span>
                 Today's Appointments
               </h2>
               <button className="text-sm font-bold text-tertiary hover:underline">View All</button>
            </div>
            <div className="divide-y divide-outline-variant/10">
               {[
                 { time: "09:00 AM", type: "Tele-Consult", patient: "Charlie (Dog)", client: "Amara S.", status: "Completed" },
                 { time: "11:30 AM", type: "In-Clinic", patient: "Bella (Cat)", client: "John D.", status: "In-Progress" },
                 { time: "02:00 PM", type: "Tele-Consult", patient: "Max (Dog)", client: "Kamal P.", status: "Upcoming" },
                 { time: "04:15 PM", type: "Home Visit", patient: "Luna (Cat)", client: "Sarah W.", status: "Upcoming" },
               ].map((apt, i) => (
                 <div key={i} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-container-low transition-colors">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 bg-surface-container rounded-xl flex flex-col items-center justify-center font-bold text-on-surface shrink-0">
                          <span className="text-sm">{apt.time.split(' ')[0]}</span>
                          <span className="text-[10px] text-on-surface-variant uppercase">{apt.time.split(' ')[1]}</span>
                       </div>
                       <div>
                         <h4 className="font-bold text-on-surface mb-1">{apt.patient}</h4>
                         <p className="text-sm text-on-surface-variant flex items-center gap-2">
                           <span className="material-symbols-outlined text-[16px]">person</span> {apt.client}
                           <span className="w-1 h-1 bg-outline-variant rounded-full hidden sm:block"></span>
                           <span className="material-symbols-outlined text-[16px] hidden sm:block">video_camera_front</span> {apt.type}
                         </p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                         apt.status === "Completed" ? "bg-secondary/10 text-secondary" :
                         apt.status === "In-Progress" ? "bg-primary/10 text-primary" : "bg-surface-container-highest text-on-surface-variant"
                       }`}>
                         {apt.status}
                       </span>
                       <button className="material-symbols-outlined text-outline hover:text-tertiary transition-colors">more_vert</button>
                    </div>
                 </div>
               ))}
            </div>
         </section>
      </main>
    </div>
  );
}
