import React from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function EditPetPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: pet } = await supabase
    .from('pets')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (!pet || pet.owner_id !== user?.id) {
    notFound();
  }

  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
      <DashboardSidebar />
      <main className="flex-1 space-y-8">
        <header className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4">
               <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
               <span className="material-symbols-outlined text-[16px]">chevron_right</span>
               <Link href="/dashboard/pets" className="hover:text-primary">My Pets</Link>
               <span className="material-symbols-outlined text-[16px]">chevron_right</span>
               <span className="text-on-surface font-bold">Edit Settings</span>
            </div>
            <h1 className="text-4xl font-headline font-extrabold text-on-surface mb-2">Edit {pet.name}'s Profile</h1>
            <p className="text-on-surface-variant text-lg">Update clinical details to assure accurate recommendations.</p>
          </div>
          
          <button className="text-error bg-error/10 hover:bg-error hover:text-white px-4 py-2 font-bold text-sm rounded-lg transition-colors flex items-center gap-2 shrink-0 md:mt-6">
             <span className="material-symbols-outlined text-[18px]">delete</span> Remove Pet
          </button>
        </header>

        <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
           <form className="space-y-8 relative z-10">
              
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-outline-variant/10">
                 <div className="w-32 h-32 rounded-full overflow-hidden shrink-0 border border-outline-variant/20 relative group cursor-pointer shadow-sm">
                    <img src={pet.image_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop"} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                       <span className="material-symbols-outlined mb-1">edit</span>
                       <span className="text-[10px] font-bold uppercase tracking-widest">Change</span>
                    </div>
                 </div>
                 <div>
                    <h3 className="font-bold text-on-surface mb-1">Profile Photo</h3>
                    <p className="text-sm text-on-surface-variant mb-3">Used for their digital ID and smart tag matching. Max 5MB (JPG/PNG).</p>
                    <button type="button" className="text-xs font-bold text-primary hover:underline bg-primary/5 px-3 py-1.5 rounded-md">Remove Photo</button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Pet's Name</label>
                    <input 
                       type="text" 
                       defaultValue={pet.name}
                       className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Species</label>
                    <select 
                       defaultValue={pet.species?.toLowerCase() || 'dog'}
                       className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none cursor-pointer">
                       <option value="dog">Dog</option>
                       <option value="cat">Cat</option>
                       <option value="bird">Bird</option>
                       <option value="fish">Fish</option>
                       <option value="small_pet">Small Pet</option>
                       <option value="reptile">Reptile</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Breed</label>
                    <input 
                       type="text" 
                       defaultValue={pet.breed}
                       className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Sex</label>
                       <select 
                          defaultValue={pet.sex?.toLowerCase() || 'male'}
                          className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none cursor-pointer">
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Current Age</label>
                        <input 
                           type="text" 
                           defaultValue={pet.age}
                           className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                        />
                    </div>
                 </div>
              </div>

              <div className="pt-6 flex justify-end gap-4">
                 <Link href="/dashboard/pets" className="bg-surface-container-low hover:bg-surface-container text-on-surface font-bold px-6 py-3.5 rounded-xl border border-outline-variant/30 transition-colors">
                    Discard Changes
                 </Link>
                 <button type="button" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">save</span> Update Details
                 </button>
              </div>
           </form>
        </section>
      </main>
    </div>
  );
}
