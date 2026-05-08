import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deletePet } from "@/lib/actions/pets";
import { DeletePetButton } from "@/components/DeletePetButton";

export const dynamic = 'force-dynamic';

export default async function PetProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  const { data: pet, error } = await supabase
    .from('pets')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !pet) {
    return notFound();
  }

  // Ensure owner access (or vet access if we implement that check)
  if (pet.owner_id !== user.id) {
    // Check if user is a vet with an active appointment
    const { data: appointment } = await supabase
      .from('appointments')
      .select('id')
      .eq('pet_id', id)
      .eq('vet_id', user.id)
      .limit(1)
      .single();
    
    if (!appointment) {
      return redirect('/dashboard');
    }
  }

  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center gap-2 text-sm text-on-surface-variant">
        <Link href="/dashboard/pets" className="hover:text-primary transition-colors">My Pets</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-bold text-on-surface">{pet.name}'s Profile</span>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-bl-full pointer-events-none -z-10"></div>
        
        {/* Cover Photo Area */}
        <div className="relative h-48 md:h-64">
          <div className="absolute inset-0 bg-surface-container-highest overflow-hidden">
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
            <img src={pet.image_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&h=400&fit=crop"} className="w-full h-full object-cover opacity-60 blur-sm scale-110" />
          </div>
          
          <div className="absolute -bottom-16 left-6 md:left-12 w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-surface border-4 border-surface shadow-xl overflow-hidden group z-10">
             <img src={pet.image_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>
        
        <div className="pt-20 md:pt-24 px-6 md:px-12 pb-12">
           <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8 border-b border-outline-variant/10 pb-8">
             <div>
               <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-on-surface">{pet.name}</h1>
                 <span className="bg-tertiary-container/30 text-tertiary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1 border border-tertiary/20">
                   <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> SLVC Verified
                 </span>
               </div>
               <p className="text-on-surface-variant font-bold text-lg md:text-xl flex items-center gap-2">
                 {pet.breed} • {pet.age} • <span className="text-primary font-black ml-2 tracking-widest uppercase text-sm">Clinical ID: {pet.id.slice(0, 8)}</span>
               </p>
             </div>
             <div className="flex items-center gap-2">
               <form action={deletePet}>
                 <input type="hidden" name="pet_id" value={pet.id} />
                 <DeletePetButton />
               </form>
               <Link href={`/dashboard/pets/${id}/edit`} className="inline-flex bg-surface-container-low px-6 py-3 rounded-xl font-bold hover:bg-surface-container-highest transition-colors shadow-sm items-center justify-center gap-2 border border-outline-variant/20">
                 <span className="material-symbols-outlined text-sm">edit</span> Edit Profile
               </Link>
             </div>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
             <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/10 shadow-inner">
               <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">scale</span> Weight</p>
               <p className="text-2xl font-headline font-black text-on-surface">-- kg</p>
             </div>
             <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/10 shadow-inner">
               <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">barcode</span> Species</p>
               <p className="text-lg font-bold text-on-surface">{pet.species}</p>
             </div>
             <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/10 shadow-inner">
               <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">bloodtype</span> Sex</p>
               <p className="text-2xl font-headline font-black text-on-surface">{pet.sex || '--'}</p>
             </div>
             <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/10 shadow-inner bg-gradient-to-br from-tertiary/10 to-transparent">
               <p className="text-[10px] font-black text-tertiary uppercase tracking-widest mb-2 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">verified_user</span> Insurance</p>
               <p className="text-xl font-bold text-tertiary">Active Plan</p>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-6">
               <h2 className="text-2xl font-headline font-bold flex items-center gap-2 text-on-surface pb-2 border-b border-outline-variant/10">
                 <span className="material-symbols-outlined text-error p-1.5 bg-error/10 rounded-lg">vaccines</span> Vaccination History
               </h2>
               
               <div className="bg-tertiary/5 border border-tertiary/20 p-5 rounded-2xl relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-tertiary"></div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg text-tertiary">DHPP Combo</h4>
                    <span className="bg-tertiary-container/50 text-tertiary px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border border-tertiary/20">Valid</span>
                  </div>
                  <p className="text-sm text-on-surface-variant">Status: Verified by Clinical Core</p>
               </div>
             </div>
             
             <div className="space-y-6">
               <h2 className="text-2xl font-headline font-bold flex items-center gap-2 text-on-surface pb-2 border-b border-outline-variant/10">
                 <span className="material-symbols-outlined text-primary p-1.5 bg-primary/10 rounded-lg">lab_profile</span> Clinical Records
               </h2>
               
               {["Vaccination Certificate", "Annual Bloodwork Panel", "Microchip Registration"].map((doc, idx) => (
                  <div key={idx} className="bg-surface-container-lowest p-5 rounded-2xl flex items-center justify-between hover:bg-surface-container-low cursor-pointer transition-colors border border-outline-variant/20 shadow-sm group">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                           <span className="material-symbols-outlined">picture_as_pdf</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">{doc}</h4>
                          <p className="text-xs text-on-surface-variant mt-1 font-medium">Verified by Central SLVC DB</p>
                        </div>
                     </div>
                     <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white transition-colors shadow-sm">
                       <span className="material-symbols-outlined text-[20px]">download</span>
                     </button>
                  </div>
               ))}
             </div>
           </div>
           
           <div className="mt-12 bg-primary/5 border border-primary/20 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 text-primary/10">
                 <span className="material-symbols-outlined text-[150px]">restaurant</span>
              </div>
              <div className="relative z-10 flex-1">
                 <h3 className="text-2xl font-headline font-bold text-primary mb-2">Personalized Feeding Guide</h3>
                 <p className="text-on-surface-variant leading-relaxed mb-4 max-w-xl">Based on {pet.name}'s profile and species, the AI has generated a clinical transition plan.</p>
                 <Link href="/marketplace" className="inline-block bg-primary text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-primary/90 transition-colors">
                   Shop Recommended Diet
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
