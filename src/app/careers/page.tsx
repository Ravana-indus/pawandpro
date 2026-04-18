import React from "react";
import Link from "next/link";

export default function CareersPage() {
  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-5xl mx-auto">
       <div className="text-center border-b border-outline-variant/10 pb-8 mb-16 relative">
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10"></div>
          <span className="font-label text-sm uppercase tracking-widest text-primary font-bold mb-4 block">Join The Mission</span>
          <h1 className="text-5xl md:text-6xl font-headline font-extrabold mb-6 text-on-surface tracking-tight">Careers at PetZen</h1>
          <p className="text-xl text-on-surface-variant font-medium max-w-2xl mx-auto leading-relaxed">Help us build Sri Lanka's first unified clinical portal and marketplace for pet welfare.</p>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 shadow-sm">
             <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-[24px]">code</span>
             </div>
             <h3 className="text-xl font-bold font-headline text-on-surface mb-2">Senior Frontend Engineer</h3>
             <p className="text-sm font-medium text-on-surface-variant mb-6">Colombo • Hybrid</p>
             <button className="text-sm font-bold bg-surface-container-highest text-on-surface hover:bg-surface-dim px-6 py-2.5 rounded-lg transition-colors">View Description</button>
          </div>
          
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 shadow-sm">
             <div className="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center text-tertiary mb-6">
                <span className="material-symbols-outlined text-[24px]">local_hospital</span>
             </div>
             <h3 className="text-xl font-bold font-headline text-on-surface mb-2">Clinical Success Manager</h3>
             <p className="text-sm font-medium text-on-surface-variant mb-6">Colombo • On-site</p>
             <button className="text-sm font-bold bg-surface-container-highest text-on-surface hover:bg-surface-dim px-6 py-2.5 rounded-lg transition-colors">View Description</button>
          </div>
          
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 shadow-sm">
             <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-6">
                <span className="material-symbols-outlined text-[24px]">inventory_2</span>
             </div>
             <h3 className="text-xl font-bold font-headline text-on-surface mb-2">Logistics Coordinator</h3>
             <p className="text-sm font-medium text-on-surface-variant mb-6">Kandy • On-site</p>
             <button className="text-sm font-bold bg-surface-container-highest text-on-surface hover:bg-surface-dim px-6 py-2.5 rounded-lg transition-colors">View Description</button>
          </div>
          
          <div className="bg-surface-container-lowest p-8 rounded-3xl border-2 border-dashed border-outline-variant/30 shadow-sm flex flex-col items-center justify-center text-center">
             <span className="material-symbols-outlined text-outline-variant text-[40px] mb-4">mail</span>
             <h3 className="text-xl font-bold font-headline text-on-surface mb-2">Don't see a fit?</h3>
             <p className="text-sm font-medium text-on-surface-variant mb-6 max-w-[200px]">Send us your resume anyway. We're always looking for talent.</p>
             <a href="mailto:careers@petzen.lk" className="text-sm font-bold text-primary hover:underline">careers@petzen.lk</a>
          </div>
       </div>
    </div>
  );
}
