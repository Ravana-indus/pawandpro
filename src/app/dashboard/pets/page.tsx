import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function PetsDirectoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Fetch user's pets
  const { data: pets, error } = await supabase
    .from('pets')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true });

  const myPets = pets || [];

  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
      <DashboardSidebar />

      <main className="flex-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
           <div>
             <span className="font-label text-sm uppercase tracking-widest text-primary font-bold mb-1 block">Clinical Tracker</span>
             <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface">My Pets</h1>
           </div>
           <Link href="/dashboard/pets/new" className="inline-flex bg-primary text-white font-bold px-6 py-3.5 rounded-xl hover:bg-primary/90 transition-colors shadow-sm items-center justify-center gap-2">
             <span className="material-symbols-outlined text-sm">add</span> Add Pet
           </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPets.map((myPet) => (
            <Link key={myPet.id} href={`/dashboard/pets/${myPet.id}`} className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all hover:border-primary/30 group flex flex-col relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none -z-10 group-hover:scale-110 transition-transform"></div>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-surface-container overflow-hidden border border-outline-variant/10 shrink-0 shadow-sm relative">
                   <img src={myPet.image_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop"} alt={myPet.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1">
                   <h3 className="font-headline font-bold text-2xl text-on-surface group-hover:text-primary transition-colors">{myPet.name}</h3>
                   <p className="text-xs font-bold text-on-surface-variant flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[14px]">pets</span> {myPet.species}
                   </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                 <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/10">
                   <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Breed</p>
                   <p className="text-sm font-bold text-on-surface line-clamp-1">{myPet.breed}</p>
                 </div>
                 <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/10">
                   <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Age</p>
                   <p className="text-sm font-bold text-on-surface">{myPet.age}</p>
                 </div>
              </div>
              
              <div className="mt-auto px-4 py-3 bg-tertiary-container/30 border border-tertiary/20 rounded-xl flex items-center justify-between">
                 <span className="text-xs font-bold text-tertiary flex items-center gap-1.5 uppercase tracking-widest">
                   <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span> Insurance Active
                 </span>
                 <span className="material-symbols-outlined text-tertiary text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
              </div>
            </Link>
          ))}
          
          <Link href="/dashboard/pets/new" className="bg-surface-container-lowest border-2 border-dashed border-outline-variant/30 rounded-3xl p-6 shadow-sm hover:bg-surface-container-low transition-colors group flex flex-col items-center justify-center text-center h-full min-h-[300px]">
             <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-3xl text-outline-variant group-hover:text-primary transition-colors">add</span>
             </div>
             <h3 className="font-bold text-lg text-on-surface mb-2">Register Pet</h3>
             <p className="text-sm text-on-surface-variant max-w-[200px]">Add another family member to start clinical tracking &amp; manage vaccinations.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
