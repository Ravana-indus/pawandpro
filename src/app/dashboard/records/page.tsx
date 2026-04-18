import React from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function RecordsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: pets } = await supabase
    .from('pets')
    .select('*')
    .eq('owner_id', user?.id);

  const userPets = pets || [];


  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
      <DashboardSidebar />

      <main className="flex-1">
        <div className="mb-8">
           <span className="font-label text-sm uppercase tracking-widest text-primary font-bold mb-1 block">SLVC Integrated</span>
           <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-on-surface">Health &amp; Certifications</h1>
        </div>
        
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-8 mb-8 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full pointer-events-none -z-10 group-hover:scale-110 transition-transform"></div>
           <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center shrink-0 border border-primary/20 shadow-inner">
             <span className="material-symbols-outlined text-5xl text-primary">folder_supervised</span>
           </div>
           <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold font-headline mb-2 text-on-surface">Digital Medical Vault</h2>
              <p className="text-on-surface-variant leading-relaxed max-w-2xl font-medium">
                PetZen directly integrates with the Sri Lanka Veterinary Council (SLVC) database. All documents uploaded here or generated via PetZen teleconsults are cryptographically verified to prevent tampering.
              </p>
           </div>
           <button className="bg-primary text-white font-bold px-6 py-4 rounded-xl shadow-md hover:bg-primary/90 transition-colors shrink-0 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">upload_file</span> Upload New Record
           </button>
        </div>

        <div className="space-y-8">
           {userPets.length === 0 ? (
             <div className="text-center py-12 bg-surface-container-low rounded-3xl border border-dashed border-outline-variant/30">
               <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">pets</span>
               <p className="text-on-surface-variant font-medium">Add a pet to your family to see their medical vault.</p>
             </div>
           ) : userPets.map((pet: any) => (
           <div key={pet.id}>
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 rounded-xl bg-surface-container overflow-hidden shrink-0 border border-outline-variant/10 shadow-sm">
                   <img src={pet.image_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop"} className="w-full h-full object-cover" />
                 </div>
                 <h3 className="text-2xl font-headline font-bold text-on-surface">{pet.name}'s Medical File</h3>
              </div>
              
              <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden shadow-sm">
                 <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-outline-variant/10 bg-surface-container-low/50">
                    <div className="col-span-6 md:col-span-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Document Name</div>
                    <div className="col-span-4 md:col-span-3 text-[10px] font-black uppercase tracking-widest text-on-surface-variant hidden md:block">Type</div>
                    <div className="col-span-4 md:col-span-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right md:text-left">Date Added</div>
                    <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Actions</div>
                 </div>
                 
                 {["Vaccination Certificate (DHPP)", "Rabies Vaccination Record", "Annual Bloodwork Panel", "Microchip Registration"].map((doc, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-outline-variant/5 items-center hover:bg-surface-container-lowest/80 transition-colors group">
                       <div className="col-span-8 md:col-span-5 flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg" style={{ fontVariationSettings: "'FILL' 1" }}>picture_as_pdf</span>
                          <div>
                            <p className="font-bold text-on-surface text-sm md:text-base group-hover:text-primary transition-colors line-clamp-1">{doc}</p>
                            <div className="flex items-center gap-1 mt-0.5 md:hidden">
                               <span className="material-symbols-outlined text-[12px] text-tertiary">verified_user</span>
                               <span className="text-[10px] uppercase font-bold text-tertiary">Verified</span>
                            </div>
                          </div>
                       </div>
                       
                       <div className="col-span-3 hidden md:flex items-center gap-1.5">
                          <span className="bg-tertiary-container/30 text-tertiary px-2 py-1 rounded text-[10px] font-bold uppercase border border-tertiary/20 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> SLVC Certified
                          </span>
                       </div>
                       
                       <div className="col-span-4 md:col-span-2 text-right md:text-left font-medium text-on-surface-variant text-sm">
                          Nov 12, 2024
                       </div>
                       
                       <div className="col-span-12 md:col-span-2 flex justify-end gap-2 mt-2 md:mt-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="View">
                             <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                          <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Download">
                             <span className="material-symbols-outlined text-[20px]">download</span>
                          </button>
                       </div>
                    </div>
                 ))}
                 
                 {/* Empty State / Upload Prompt */}
                 <div className="px-6 py-8 border-2 border-dashed border-outline-variant/30 m-4 rounded-xl flex flex-col items-center justify-center text-center hover:bg-surface-container-low transition-colors cursor-pointer group">
                    <span className="material-symbols-outlined text-3xl text-outline-variant mb-2 group-hover:text-primary transition-colors">note_add</span>
                    <p className="font-bold text-on-surface">Drop files to upload</p>
                    <p className="text-xs text-on-surface-variant font-medium mt-1">PDF, JPG, PNG up to 10MB</p>
                 </div>
              </div>
           </div>
           ))}
        </div>
      </main>
    </div>
  );
}
