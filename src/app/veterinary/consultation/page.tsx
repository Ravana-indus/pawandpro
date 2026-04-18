import React from "react";
import Link from "next/link";
import { getVets } from "@/lib/queries";

export default async function ConsultationPage() {
  const vets = await getVets();
  const vet = vets[0];
  
  if (!vet) {
    return (
      <div className="pt-24 pb-32 px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Teleconsultation</h1>
        <p className="mb-8">No veterinarians are currently available for consultation. Please try again later.</p>
        <Link href="/veterinary" className="bg-primary text-white px-8 py-3 rounded-xl font-bold">Back to Veterinary</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-8 px-6 max-w-5xl mx-auto h-[calc(100vh-80px)] flex flex-col">
      <header className="mb-6 flex justify-between items-center bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/20">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 rounded-full bg-surface-container overflow-hidden border-2 border-tertiary p-0.5">
             <div className="w-full h-full rounded-full overflow-hidden">
               <img src={vet.avatar_url || ""} alt={vet.full_name || ""} className="w-full h-full object-cover" />
             </div>
           </div>
           <div>
             <h2 className="font-bold text-lg text-on-surface">{vet.full_name}</h2>
             <span className="text-xs font-black uppercase tracking-widest text-tertiary flex items-center gap-1.5 mt-0.5">
               <span className="relative w-2 h-2 flex">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                 <span className="relative inline-flex rounded-full w-2 h-2 bg-tertiary"></span>
               </span>
               Live Teleconsultation
             </span>
           </div>
        </div>
        <div className="flex gap-3">
           <button className="p-3.5 bg-surface-container-highest rounded-full hover:bg-surface-dim transition-colors text-on-surface-variant shadow-sm border border-outline-variant/20">
             <span className="material-symbols-outlined">mic_off</span>
           </button>
           <button className="p-3.5 bg-error text-white rounded-full hover:bg-error/90 transition-colors shadow-lg shadow-error/20 font-bold px-6 flex items-center gap-2">
             <span className="material-symbols-outlined text-[20px]">call_end</span> End Session
           </button>
        </div>
      </header>

      <div className="flex-1 bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant/20 flex flex-col shadow-inner">
         <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-hide">
            <div className="text-center text-[10px] text-on-surface-variant font-black uppercase tracking-widest mb-6 border-b border-outline-variant/10 pb-4">Secured E2E Encrypted Chat • Today, 2:40 PM</div>
            
            {/* System Message / AI Checker */}
            <div className="flex justify-center mb-8">
              <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl max-w-lg text-sm flex gap-4 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                 <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychiatry</span>
                 </div>
                 <div>
                   <p className="font-bold text-primary mb-1 text-base">PetZen Clinical AI Active</p>
                   <p className="text-on-surface-variant leading-relaxed">Based on Luna's profile (Golden Retriever, 2y) and reported symptoms (Lethargy, loss of appetite since yesterday), AI detected a 70% probability of mild GI upset. Medical history transferred to {vet.full_name}.</p>
                 </div>
              </div>
            </div>

            {/* Doctor Message */}
            <div className="flex gap-4 group">
              <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden shrink-0 mt-auto shadow-sm">
                <img src={vet.avatar_url || ""} className="w-full h-full object-cover" />
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant/20 px-6 py-4 rounded-3xl rounded-bl-sm max-w-md shadow-sm">
                 <p className="text-on-surface leading-relaxed">Hello! I've reviewed the clinical AI synopsis and Luna's recent vaccination chart. When did she first start showing signs of lethargy? Was it after the evening walk?</p>
              </div>
            </div>

            {/* User Message */}
            <div className="flex gap-4 justify-end group">
              <div className="bg-primary text-white border border-primary px-6 py-4 rounded-3xl rounded-br-sm max-w-md shadow-md">
                 <p className="leading-relaxed">Hi Dr. Elena. Yes, it started yesterday evening immediately after her walk. We switched her kibble brand 2 days ago, could that be it?</p>
              </div>
            </div>
            
            {/* Typing Indicator */}
            <div className="flex gap-4 opacity-50">
              <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden shrink-0 mt-auto">
                <img src={vet.avatar_url || ""} className="w-full h-full object-cover" />
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant/10 px-6 py-4 rounded-3xl rounded-bl-sm w-24 flex items-center justify-center gap-1.5 shadow-sm">
                 <span className="w-2 h-2 rounded-full bg-outline-variant animate-bounce"></span>
                 <span className="w-2 h-2 rounded-full bg-outline-variant animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                 <span className="w-2 h-2 rounded-full bg-outline-variant animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
         </div>

         {/* Input Area */}
         <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/20">
            <div className="flex gap-3 items-center bg-surface-container-low px-2 py-2 rounded-full border border-outline-variant/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all shadow-inner">
               <button className="text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors p-3 rounded-full shrink-0">
                 <span className="material-symbols-outlined text-[20px]">attach_file</span>
               </button>
               <input type="text" placeholder="Describe symptoms, share a photo, or ask a question..." className="flex-1 bg-transparent border-none focus:ring-0 text-sm outline-none font-medium px-2" />
               <button className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all flex items-center justify-center shrink-0 shadow-md">
                 <span className="material-symbols-outlined text-[18px]">send</span>
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
