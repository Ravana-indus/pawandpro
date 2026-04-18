import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="relative min-h-[870px] flex items-center px-6 md:px-12 max-w-[1600px] mx-auto overflow-hidden rounded-[40px] mt-24 mb-16 shadow-2xl bg-surface-container-lowest border border-outline-variant/20">
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-primary/10 rounded-l-full blur-[100px] pointer-events-none -z-10 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-tertiary/10 rounded-full blur-[80px] pointer-events-none -z-10 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="grid grid-cols-12 w-full items-center gap-12 relative z-10">
          <div className="col-span-12 lg:col-span-6 py-12">
            <span className="uppercase tracking-[0.3em] text-primary font-bold text-sm mb-6 block drop-shadow-sm flex items-center gap-2">
              <span className="w-8 h-px bg-primary"></span> The Clinical Concierge
            </span>
            <h1 className="font-headline text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter text-on-surface leading-[0.95] mb-8 drop-shadow-sm">
              Elevated <span className="bg-gradient-to-r from-primary to-primary-fixed-dim bg-clip-text text-transparent">Care</span> <br />
              for Every Life.
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-lg mb-12 leading-relaxed font-medium">
              Redefining pet wellness through professional veterinary authority, ethical breeding logic, and premium lifestyle integration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/veterinary" className="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-lg hover:shadow-primary/30 hover:bg-primary/90 hover:-translate-y-0.5 active:scale-95 transition-all text-center flex items-center justify-center gap-2 group">
                <span className="material-symbols-outlined text-[20px] group-hover:animate-pulse">medical_services</span> Book Consultation
              </Link>
              <Link href="/marketplace" className="bg-surface-container-highest text-on-surface px-10 py-5 rounded-2xl font-bold text-lg hover:bg-surface-dim transition-colors text-center border border-outline-variant/30 flex items-center justify-center gap-2 group">
                Explore Marketplace <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1 border border-outline-variant/50 rounded-full p-0.5">arrow_forward</span>
              </Link>
            </div>
            
            <div className="mt-16 flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all cursor-default">
               <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">verified</span> SLVC Certified Platform</span>
               <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
               <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">lock</span> Encrypted Records</span>
            </div>
          </div>
          
          <div className="col-span-12 lg:col-span-6 relative h-[400px] md:h-[600px] lg:h-[750px] mt-8 lg:mt-0 right-0 lg:-right-12">
            <div className="absolute inset-x-0 lg:inset-x-auto lg:right-0 lg:w-[120%] h-full bg-surface-container-low rounded-3xl lg:rounded-l-[80px] lg:rounded-r-none overflow-hidden shadow-2xl border-l border-t border-b lg:border-r-0 border-outline-variant/20 -skew-x-6 lg:-skew-x-12 origin-bottom hover:-skew-x-3 transition-transform duration-1000 ease-out group">
              <img
                alt="Luxury pet care"
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=2938&ixlib=rb-4.0.3"
                className="w-full h-full object-cover scale-125 skew-x-6 lg:skew-x-12 origin-bottom group-hover:scale-110 transition-transform duration-1000 ease-out opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent mix-blend-multiply pointer-events-none"></div>
            </div>
            {/* Floating Glass Element */}
            <div className="absolute bottom-16 -left-12 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hidden md:flex items-center gap-4 animate-[bounce_6s_ease-in-out_infinite]">
               <div className="w-12 h-12 bg-tertiary-container/80 text-tertiary rounded-full flex items-center justify-center shadow-inner">
                  <span className="material-symbols-outlined">health_and_safety</span>
               </div>
               <div>
                  <p className="font-bold text-on-surface text-sm">24/7 Veterinary Access</p>
                  <p className="text-xs text-on-surface-variant font-medium">Connect in seconds</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Choice Bento */}
      <section className="px-6 md:px-12 py-16 md:py-32 max-w-[1600px] mx-auto">
        <div className="mb-16 md:text-center max-w-3xl mx-auto">
           <span className="uppercase tracking-[0.3em] text-on-surface-variant font-bold text-xs mb-4 block">Ecosystem</span>
           <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight mb-6">A Unified Platform.</h2>
           <p className="text-lg text-on-surface-variant font-medium leading-relaxed">Whether you're shopping for clinical-grade nutrition, seeking medical advice, or looking to add a certified ethical puppy to your family.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Shop Products */}
          <Link href="/marketplace" className="group relative aspect-square md:aspect-[4/5] bg-surface-container-lowest rounded-[32px] overflow-hidden p-8 lg:p-10 flex flex-col justify-end transition-all hover:shadow-[0_20px_60px_rgba(var(--primary-rgb),0.15)] hover:-translate-y-2 border border-outline-variant/10">
            <img
              alt="Shop Products"
              src="https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=2000&ixlib=rb-4.0.3"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity"></div>
            <div className="relative z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <span className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-on-surface mb-6 border border-white/20 shadow-sm">
                 <span className="material-symbols-outlined">shopping_bag</span>
              </span>
              <h3 className="font-headline text-3xl font-bold text-on-surface mb-3 tracking-tight">Shop Clinical</h3>
              <p className="text-on-surface-variant font-medium text-sm leading-relaxed max-w-[250px]">Authentic, authorized medical-grade essentials and intelligent nutrition.</p>
            </div>
          </Link>
          
          {/* Consult a Vet */}
          <Link href="/veterinary" className="group relative aspect-square md:aspect-[4/5] bg-surface-container-lowest rounded-[32px] overflow-hidden p-8 lg:p-10 flex flex-col justify-end transition-all hover:shadow-[0_20px_60px_rgba(var(--primary-rgb),0.15)] hover:-translate-y-2 border border-outline-variant/10">
            <img
              alt="Consult a Vet"
              src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-80 mix-blend-luminosity group-hover:mix-blend-normal"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-primary/10 transition-opacity"></div>
            <div className="relative z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <span className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white mb-6 border border-white/20 shadow-sm">
                 <span className="material-symbols-outlined">stethoscope</span>
              </span>
              <h3 className="font-headline text-3xl font-bold text-white mb-3 tracking-tight">Teleconsultation</h3>
              <p className="text-white/80 font-medium text-sm leading-relaxed max-w-[250px]">Immediate access to SLVC-certified professionals, encrypted and secure.</p>
            </div>
          </Link>
          
          {/* Ethical Breeders */}
          <Link href="/breeders" className="group relative aspect-square md:aspect-[4/5] bg-surface-container-lowest rounded-[32px] overflow-hidden p-8 lg:p-10 flex flex-col justify-end transition-all hover:shadow-[0_20px_60px_rgba(var(--primary-rgb),0.15)] hover:-translate-y-2 border border-outline-variant/10">
            <img
              alt="Ethical Breeders"
              src="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=2874&ixlib=rb-4.0.3"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 filter hover:saturate-150"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity"></div>
            <div className="relative z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <span className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-on-surface mb-6 border border-white/20 shadow-sm">
                 <span className="material-symbols-outlined">favorite</span>
              </span>
              <h3 className="font-headline text-3xl font-bold text-on-surface mb-3 tracking-tight">Ethical Lineage</h3>
              <p className="text-on-surface-variant font-medium text-sm leading-relaxed max-w-[250px]">Verified genetics, rigorous health screening, and strict welfare standards.</p>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
