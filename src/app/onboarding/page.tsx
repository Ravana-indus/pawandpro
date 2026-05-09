import React from "react";
import Link from "next/link";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen py-24 flex items-center justify-center p-6 bg-surface-container-lowest relative overflow-hidden">
       {/* Ambient Background Elements */}
       <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
       <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-tertiary/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
       
       <div className="max-w-5xl w-full">
          <div className="text-center mb-12">
             <Link href="/" className="inline-block mb-10">
               <span className="font-headline font-black text-3xl tracking-tighter bg-gradient-to-r from-primary to-primary-fixed-dim bg-clip-text text-transparent">PETZEN</span>
             </Link>
             <h1 className="text-5xl md:text-6xl font-headline font-extrabold mb-4 tracking-tight text-on-surface">Choose Your Path</h1>
             <p className="text-on-surface-variant text-lg md:text-xl font-medium max-w-2xl mx-auto">Select how you want to experience the PetZen platform. You can always change this later in your settings.</p>
          </div>
          
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/signup?role=PARENT" className="bg-surface-container-lowest p-10 rounded-3xl border border-outline-variant/20 hover:border-primary/50 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 group text-center flex flex-col items-center relative overflow-hidden h-full">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                 <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner border border-primary/20">
                    <span className="material-symbols-outlined text-4xl text-primary drop-shadow-md" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
                 </div>
                 <h3 className="text-2xl font-bold mb-3 font-headline text-on-surface">Pet Parent</h3>
                 <p className="text-on-surface-variant text-sm font-medium leading-relaxed">Shop clinical products, manage digital health records, and book teleconsultations.</p>
                 <span className="mt-auto pt-6 text-sm font-black uppercase tracking-widest text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Select Path <span className="material-symbols-outlined text-[16px]">arrow_forward</span></span>
              </Link>
              
              <Link href="/signup?role=SELLER" className="bg-surface-container-lowest p-10 rounded-3xl border border-outline-variant/20 hover:border-tertiary/50 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 group text-center flex flex-col items-center relative overflow-hidden h-full">
                 <div className="absolute inset-0 bg-gradient-to-br from-tertiary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                 <div className="w-20 h-20 bg-tertiary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner border border-tertiary/20">
                    <span className="material-symbols-outlined text-4xl text-tertiary drop-shadow-md" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
                 </div>
                 <h3 className="text-2xl font-bold mb-3 font-headline text-on-surface">Verified Seller</h3>
                 <p className="text-on-surface-variant text-sm font-medium leading-relaxed">List authenticated products or ethical litters with PetZen Certified Trust integration.</p>
                 <span className="mt-auto pt-6 text-sm font-black uppercase tracking-widest text-tertiary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Select Path <span className="material-symbols-outlined text-[16px]">arrow_forward</span></span>
              </Link>
              
              <Link href="/signup?role=VET" className="bg-surface-container-lowest p-10 rounded-3xl border border-outline-variant/20 hover:border-cyan-600/50 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 group text-center flex flex-col items-center relative overflow-hidden h-full">
                 <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                 <div className="w-20 h-20 bg-cyan-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner border border-cyan-600/20">
                    <span className="material-symbols-outlined text-4xl text-cyan-600 drop-shadow-md" style={{ fontVariationSettings: "'FILL' 1" }}>local_hospital</span>
                 </div>
                 <h3 className="text-2xl font-bold mb-3 font-headline text-on-surface">Veterinarian</h3>
                 <p className="text-on-surface-variant text-sm font-medium leading-relaxed">Provide online teleconsultations and manage clinic appointments securely.</p>
                 <span className="mt-auto pt-6 text-sm font-black uppercase tracking-widest text-cyan-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Select Path <span className="material-symbols-outlined text-[16px]">arrow_forward</span></span>
              </Link>

              <Link href="/signup?role=BREEDER" className="bg-surface-container-lowest p-10 rounded-3xl border border-outline-variant/20 hover:border-secondary/50 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 group text-center flex flex-col items-center relative overflow-hidden h-full">
                 <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                 <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner border border-secondary/20">
                    <span className="material-symbols-outlined text-4xl text-secondary drop-shadow-md" style={{ fontVariationSettings: "'FILL' 1" }}>cruelty_free</span>
                 </div>
                 <h3 className="text-2xl font-bold mb-3 font-headline text-on-surface">Breeder</h3>
                 <p className="text-on-surface-variant text-sm font-medium leading-relaxed">List ethical litters with health certifications and breeder verification.</p>
                 <span className="mt-auto pt-6 text-sm font-black uppercase tracking-widest text-secondary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Select Path <span className="material-symbols-outlined text-[16px]">arrow_forward</span></span>
              </Link>

              <Link href="/signup?role=INDIVIDUAL_SELLER" className="bg-surface-container-lowest p-10 rounded-3xl border border-outline-variant/20 hover:border-secondary/50 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 group text-center flex flex-col items-center relative overflow-hidden h-full">
                 <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                 <div className="w-20 h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner border border-secondary/20">
                    <span className="material-symbols-outlined text-4xl text-secondary drop-shadow-md" style={{ fontVariationSettings: "'FILL' 1" }}>sell</span>
                 </div>
                 <h3 className="text-2xl font-bold mb-3 font-headline text-on-surface">Individual Seller</h3>
                 <p className="text-on-surface-variant text-sm font-medium leading-relaxed">Sell pet products directly to pet parents with verified listings.</p>
                 <span className="mt-auto pt-6 text-sm font-black uppercase tracking-widest text-secondary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Select Path <span className="material-symbols-outlined text-[16px]">arrow_forward</span></span>
              </Link>

              <Link href="/signup?role=ADOPTION_PROVIDER" className="bg-surface-container-lowest p-10 rounded-3xl border border-outline-variant/20 hover:border-primary-fixed/50 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 group text-center flex flex-col items-center relative overflow-hidden h-full">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                 <div className="w-20 h-20 bg-primary-fixed/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner border border-primary-fixed/20">
                    <span className="material-symbols-outlined text-4xl text-primary-fixed drop-shadow-md" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
                 </div>
                 <h3 className="text-2xl font-bold mb-3 font-headline text-on-surface">Adoption Provider</h3>
                 <p className="text-on-surface-variant text-sm font-medium leading-relaxed">Manage adoption listings and review applications from pet seekers.</p>
                 <span className="mt-auto pt-6 text-sm font-black uppercase tracking-widest text-primary-fixed flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Select Path <span className="material-symbols-outlined text-[16px]">arrow_forward</span></span>
              </Link>

              <Link href="/signup?role=GROOMER" className="bg-surface-container-lowest p-10 rounded-3xl border border-outline-variant/20 hover:border-tertiary/50 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 group text-center flex flex-col items-center relative overflow-hidden h-full">
                 <div className="absolute inset-0 bg-gradient-to-br from-tertiary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                 <div className="w-20 h-20 bg-tertiary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner border border-tertiary/20">
                    <span className="material-symbols-outlined text-4xl text-tertiary drop-shadow-md" style={{ fontVariationSettings: "'FILL' 1" }}>content_cut</span>
                 </div>
                 <h3 className="text-2xl font-bold mb-3 font-headline text-on-surface">Groomer</h3>
                 <p className="text-on-surface-variant text-sm font-medium leading-relaxed">Offer professional pet grooming services with booking management.</p>
                 <span className="mt-auto pt-6 text-sm font-black uppercase tracking-widest text-tertiary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Select Path <span className="material-symbols-outlined text-[16px]">arrow_forward</span></span>
              </Link>

              <Link href="/signup?role=PET_TRAINER" className="bg-surface-container-lowest p-10 rounded-3xl border border-outline-variant/20 hover:border-secondary-container/50 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 group text-center flex flex-col items-center relative overflow-hidden h-full">
                 <div className="absolute inset-0 bg-gradient-to-br from-secondary-container/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                 <div className="w-20 h-20 bg-secondary-container/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner border border-secondary-container/50">
                    <span className="material-symbols-outlined text-4xl text-on-secondary-container drop-shadow-md" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
                 </div>
                 <h3 className="text-2xl font-bold mb-3 font-headline text-on-surface">Pet Trainer</h3>
                 <p className="text-on-surface-variant text-sm font-medium leading-relaxed">Provide training services and manage pet behavioral sessions.</p>
                 <span className="mt-auto pt-6 text-sm font-black uppercase tracking-widest text-on-secondary-container flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Select Path <span className="material-symbols-outlined text-[16px]">arrow_forward</span></span>
              </Link>

              <Link href="/signup?role=TRANSPORTER" className="bg-surface-container-lowest p-10 rounded-3xl border border-outline-variant/20 hover:border-outline/50 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 group text-center flex flex-col items-center relative overflow-hidden h-full">
                 <div className="absolute inset-0 bg-gradient-to-br from-outline/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                 <div className="w-20 h-20 bg-outline/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner border border-outline/20">
                    <span className="material-symbols-outlined text-4xl text-outline drop-shadow-md" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                 </div>
                 <h3 className="text-2xl font-bold mb-3 font-headline text-on-surface">Transporter</h3>
                 <p className="text-on-surface-variant text-sm font-medium leading-relaxed">Offer pet transport services with scheduled pickups and deliveries.</p>
                 <span className="mt-auto pt-6 text-sm font-black uppercase tracking-widest text-outline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Select Path <span className="material-symbols-outlined text-[16px]">arrow_forward</span></span>
              </Link>

              <Link href="/signup?role=ADMIN" className="bg-surface-container-lowest p-10 rounded-3xl border border-error/20 hover:border-error/50 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 group text-center flex flex-col items-center relative overflow-hidden h-full">
                 <div className="absolute inset-0 bg-gradient-to-br from-error/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                 <div className="w-20 h-20 bg-error/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner border border-error/20">
                    <span className="material-symbols-outlined text-4xl text-error drop-shadow-md" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
                 </div>
                 <h3 className="text-2xl font-bold mb-3 font-headline text-on-surface">Admin</h3>
                 <p className="text-on-surface-variant text-sm font-medium leading-relaxed">Platform administration with full system access and moderation tools.</p>
                 <span className="mt-auto pt-6 text-sm font-black uppercase tracking-widest text-error flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Select Path <span className="material-symbols-outlined text-[16px]">arrow_forward</span></span>
              </Link>
           </div>
       </div>
    </div>
  );
}
