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
          </div>
       </div>
    </div>
  );
}
