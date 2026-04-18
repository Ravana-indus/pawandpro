import React from "react";
import Link from "next/link";

export default function PharmacyPage() {
  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-12 mb-16 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-tertiary/10 -skew-x-12 translate-x-1/4 pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
           <div className="w-20 h-20 bg-tertiary-container/30 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-tertiary/20">
              <span className="material-symbols-outlined text-4xl text-tertiary">prescriptions</span>
           </div>
           <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter mb-6 text-on-surface">Veterinary Pharmacy</h1>
           <p className="text-xl text-on-surface-variant mb-10 leading-relaxed font-medium">
             Upload your SLVC-verified prescriptions to order clinical-grade medications and schedule home vaccinations directly through the PetZen network.
           </p>
           <button className="bg-tertiary text-white px-8 py-4 rounded-xl font-bold hover:scale-105 active:scale-95 transition-transform shadow-lg flex items-center gap-3 shadow-tertiary/20">
             <span className="material-symbols-outlined text-[20px]">upload_file</span> Upload Prescription PDF
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
         <div className="bg-surface-container-lowest border border-outline-variant/20 p-10 rounded-3xl shadow-sm hover:shadow-lg transition-shadow group">
            <div className="w-14 h-14 bg-surface-container rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <span className="material-symbols-outlined text-primary text-[28px]">medication</span>
            </div>
            <h2 className="text-2xl font-bold font-headline mb-4 text-on-surface">Medication Refills</h2>
            <p className="text-on-surface-variant mb-8 leading-relaxed">Easily reorder recurring medications for chronic conditions with zero hassle. Set up auto-ship for uninterrupted clinical care.</p>
            <Link href="/dashboard/records" className="text-primary font-bold hover:underline flex items-center gap-1">
              View Active Prescriptions <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
         </div>
         
         <div className="bg-surface-container-lowest border border-outline-variant/20 p-10 rounded-3xl shadow-sm hover:shadow-lg transition-shadow group">
            <div className="w-14 h-14 bg-surface-container rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <span className="material-symbols-outlined text-secondary text-[28px]">vaccines</span>
            </div>
            <h2 className="text-2xl font-bold font-headline mb-4 text-on-surface">Home Vaccinations</h2>
            <p className="text-on-surface-variant mb-8 leading-relaxed">Schedule a mobile veterinary unit to administer routine vaccinations in the comfort of your home. Reduced stress for your pets.</p>
            <Link href="/veterinary/book-home-visit" className="text-secondary font-bold hover:underline flex items-center gap-1">
              Book Home Appointment <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
         </div>
      </div>
      
      <div className="bg-surface-container-low p-8 rounded-2xl flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left border border-outline-variant/10">
         <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center shrink-0">
           <span className="material-symbols-outlined text-on-surface-variant text-3xl">verified_user</span>
         </div>
         <div>
            <h4 className="font-bold font-headline text-lg text-on-surface mb-1">Authenticity Guaranteed</h4>
            <p className="text-sm text-on-surface-variant">All medications are sourced directly from authorized medical distributors and verified by our in-house pharmacology team.</p>
         </div>
      </div>
    </div>
  );
}
