import React from "react";
import Link from "next/link";
import { VetCard } from "@/components/VetCard";
import { getVets } from "@/lib/queries";

export default async function VetDirectoryPage() {
  const vets = await getVets();
  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto">
      <header className="mb-12 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tertiary/10 blur-3xl rounded-full -z-10 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-tertiary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
              <span className="font-label text-sm uppercase tracking-widest text-primary font-bold block">SLVC Registered Professionals</span>
            </div>
            <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface">
              Veterinary Network
            </h1>
          </div>
          <div className="flex gap-2">
             <div className="flex items-center bg-surface-container-lowest px-4 py-3.5 rounded-2xl border border-outline-variant/30 flex-1 md:w-80 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
               <span className="material-symbols-outlined text-slate-400 text-xl mr-2">search</span>
               <input className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none placeholder:text-on-surface-variant/50 font-medium" placeholder="Search by name, specialty, or clinic..." type="text"/>
             </div>
             <Link href="/search" className="bg-primary text-white px-6 py-3.5 rounded-2xl font-bold shadow-md hover:bg-primary/90 transition-colors flex items-center justify-center">
               Search
             </Link>
          </div>
        </div>
      </header>

      {/* Filter Chips */}
      <section className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
           {['All Specialists', 'Available Now', 'Home Visits', 'Surgeons', 'Feline Experts'].map((filter, i) => (
             <button key={filter} className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${i === 0 ? 'bg-surface-container-high text-on-surface border border-outline-variant/50' : 'bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant/30 text-on-surface-variant'}`}>
               {i === 1 && <span className="inline-block w-2 h-2 rounded-full bg-tertiary animate-pulse mr-2"></span>}
               {filter}
             </button>
           ))}
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="bg-surface-container-low px-4 py-2.5 rounded-full border border-outline-variant/30 flex items-center gap-2 shrink-0">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            <select className="bg-transparent text-sm font-bold text-on-surface focus:outline-none cursor-pointer">
              <option>Any Location</option>
              <option>Colombo Centers</option>
              <option>Kandy Clinics</option>
            </select>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
        {vets.map((vet) => (
           <VetCard key={vet.id} vet={vet} />
        ))}
      </div>
      
      {/* Emergency GPS Finder Promo */}
      <section className="mt-8 bg-gradient-to-br from-error to-error-container text-error-on-container rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between border border-error/20">
         <div className="absolute top-0 right-0 p-8 opacity-10">
           <span className="material-symbols-outlined text-[200px]">emergency</span>
         </div>
         <div className="relative z-10 max-w-xl mb-8 md:mb-0">
           <div className="flex items-center gap-2 mb-4 bg-error/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-md border border-error/30">
             <span className="material-symbols-outlined text-sm text-white" style={{ fontVariationSettings: "'FILL' 1" }}>crisis_alert</span>
             <span className="font-bold uppercase tracking-widest text-xs text-white">24/7 Critical Support</span>
           </div>
           <h2 className="text-4xl md:text-5xl font-headline font-extrabold mb-4 text-white tracking-tight">Emergency Veterinary Unit</h2>
           <p className="text-white/80 text-lg leading-relaxed">
             Use our GPS-enabled locator to instantly route to the nearest open SLVC emergency clinical facility or dispatch a mobile trauma unit.
           </p>
         </div>
         <Link href="/veterinary/emergency" className="block relative z-10 bg-white text-error font-black px-10 py-5 rounded-xl text-lg hover:scale-105 active:scale-95 transition-transform w-full md:w-auto text-center shadow-[0_10px_40px_rgba(147,0,10,0.4)]">
           Locate Nearest Center
         </Link>
      </section>
    </div>
  );
}
