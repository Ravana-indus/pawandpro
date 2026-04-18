import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

import { getVets } from "@/lib/queries";

export default async function VeterinaryPage() {
  const vets = await getVets();


  return (
    <div className="pt-12 pb-20 px-4 md:px-8 max-w-screen-2xl mx-auto">
      {/* Hero Section: Quick Actions */}
      <section className="mb-16">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter text-on-surface mb-4">
            Clinical Care, <br />
            <span className="text-primary">Without the Wait.</span>
          </h1>
          <p className="text-xl text-on-surface-variant max-w-2xl font-body">
            Connect with elite veterinary professionals instantly. Manage your pet's health with the precision of a digital concierge.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Action 1 */}
          <div className="group relative overflow-hidden rounded-xl bg-surface-container-low p-8 transition-transform active:scale-[0.98] cursor-pointer border border-outline-variant/20">
            <div className="relative z-10 flex flex-col h-full justify-between gap-12">
              <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                video_call
              </span>
              <div>
                <h3 className="text-2xl font-headline font-bold mb-2">Instant Video Consult</h3>
                <p className="text-on-surface-variant mb-6">Connect with a certified vet in under 10 minutes.</p>
                <button className="bg-gradient-to-br from-primary to-primary-container text-white font-bold py-4 px-8 rounded-xl flex items-center justify-between w-full group-hover:gap-4 transition-all">
                  <span>Start Call</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
          {/* Action 2 */}
          <div className="group relative overflow-hidden rounded-xl bg-surface-container-low p-8 transition-transform active:scale-[0.98] cursor-pointer border border-outline-variant/20">
            <div className="relative z-10 flex flex-col h-full justify-between gap-12">
              <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_hospital
              </span>
              <div>
                <h3 className="text-2xl font-headline font-bold mb-2">Book Hospital Visit</h3>
                <p className="text-on-surface-variant mb-6">Priority booking at our premium clinical centers.</p>
                <Link href="/veterinary/directory" className="bg-surface-container-highest text-on-surface font-bold py-4 px-8 rounded-xl flex items-center justify-between w-full transition-all hover:bg-surface-dim">
                  <span>Find Centers</span>
                  <span className="material-symbols-outlined text-sm">map</span>
                </Link>
              </div>
            </div>
          </div>
          {/* Action 3 */}
          <div className="group relative overflow-hidden rounded-xl bg-surface-container-low p-8 transition-transform active:scale-[0.98] cursor-pointer border border-outline-variant/20">
            <div className="relative z-10 flex flex-col h-full justify-between gap-12">
              <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                vaccines
              </span>
              <div>
                <h3 className="text-2xl font-headline font-bold mb-2">Schedule Vaccination</h3>
                <p className="text-on-surface-variant mb-6">Our mobile clinic comes directly to your home.</p>
                <Link href="/veterinary/book-home-visit" className="bg-surface-container-highest text-on-surface font-bold py-4 px-8 rounded-xl flex items-center justify-between w-full transition-all hover:bg-surface-dim">
                  <span>Book Home Visit</span>
                  <span className="material-symbols-outlined text-sm">home</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetric Grid: Specialists & Active Records */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Specialist Section (Left - 8 columns) */}
        <section className="lg:col-span-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-xs font-label uppercase tracking-widest text-primary font-bold">Recommended for you</span>
              <h2 className="text-4xl font-headline font-bold tracking-tight">Find a Specialist</h2>
            </div>
            <Link href="/veterinary/directory" className="text-primary font-bold flex items-center gap-1 hover:underline">
              View All <span className="material-symbols-outlined text-sm">chevron_right</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vets.map((vet) => (
              <div key={vet.id} className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6 transition-all hover:shadow-xl hover:shadow-primary/5 flex gap-6">
                <div className="w-24 h-24 rounded-lg bg-surface-container overflow-hidden shrink-0">
                  <img
                    alt={vet.full_name || ''}
                    className="w-full h-full object-cover"
                    src={vet.avatar_url || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop"}
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                   <h4 className="font-headline font-bold text-lg">{vet.full_name}</h4>
                    {vet.details?.is_available_now ? (
                      <span className="bg-tertiary-container/20 text-tertiary px-2 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span> Available
                      </span>
                    ) : (
                      <span className="bg-surface-container-highest text-on-surface-variant px-2 py-1 rounded-full text-[10px] font-bold uppercase">
                        Offline
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-on-surface-variant mb-4">{vet.details?.specialization}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-sm text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-sm font-bold">{vet.details?.rating ?? '4.5'}</span>
                    <span className="text-xs text-on-surface-variant">({vet.details?.experience_years ?? 0}+ yrs)</span>
                  </div>
                  <Link href={`/veterinary/profile/${vet.id}`} className="block text-center mt-auto w-full py-2 bg-surface-container text-primary font-bold rounded-lg text-sm hover:bg-primary hover:text-white transition-colors">
                    Request Appointment
                  </Link>
                </div>
              </div>
            ))}
            {vets.length === 0 && (
              <div className="col-span-full py-12 text-center bg-surface-container-lowest rounded-xl border border-dashed border-outline-variant">
                <p className="text-on-surface-variant font-medium">No specialists found at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* Active Records Section (Right - 4 columns) */}
        <section className="lg:col-span-4">
          <div className="mb-8">
            <span className="text-xs font-label uppercase tracking-widest text-primary font-bold">Real-time status</span>
            <h2 className="text-4xl font-headline font-bold tracking-tight">Active Activity</h2>
          </div>
          <div className="space-y-6">
            {/* Consultation Item */}
            <div className="bg-surface-container p-6 rounded-xl relative border-l-4 border-primary">
               <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black uppercase tracking-tighter bg-primary/10 text-primary px-2 py-0.5 rounded">Current</span>
                  <span className="text-[10px] font-medium text-on-surface-variant">12:30 PM - 01:00 PM</span>
               </div>
               <h4 className="font-bold mb-1">Luna's Cardiology Follow-up</h4>
               <p className="text-xs text-on-surface-variant mb-4">Telehealth Session with Dr. Elena</p>
               <button className="w-full bg-primary text-white text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                 <span className="material-symbols-outlined text-sm">video_chat</span> Join Room
               </button>
            </div>

            {/* Diagnostic Item */}
            <div className="bg-surface-container p-6 rounded-xl relative border-l-4 border-tertiary">
               <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black uppercase tracking-tighter bg-tertiary/10 text-tertiary px-2 py-0.5 rounded">Processing</span>
                  <span className="text-[10px] font-medium text-on-surface-variant">Today, 09:15 AM</span>
               </div>
               <h4 className="font-bold mb-1">Blood Panel (Advanced)</h4>
               <p className="text-xs text-on-surface-variant mb-4">Results expected in 4-6 hours</p>
               <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                  <div className="bg-tertiary h-full w-2/3 rounded-full"></div>
               </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
