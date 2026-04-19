import React from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { createPet } from "@/lib/actions/pets";

export default function NewPetPage() {
  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
      <DashboardSidebar />
      <main className="flex-1 space-y-8">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-4">
             <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
             <span className="material-symbols-outlined text-[16px]">chevron_right</span>
             <Link href="/dashboard/pets" className="hover:text-primary">My Pets</Link>
             <span className="material-symbols-outlined text-[16px]">chevron_right</span>
             <span className="text-on-surface font-bold">Add Pet</span>
          </div>
          <h1 className="text-4xl font-headline font-extrabold text-on-surface mb-2">Add a New Pet</h1>
          <p className="text-on-surface-variant text-lg">Enter your pet's basic details to start generating their clinical health record.</p>
        </header>

        <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
           {/* Add Pet Form */}
           <form action={createPet as any} className="space-y-8 relative z-10">
              
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-outline-variant/10">
                 <div className="w-32 h-32 bg-surface-container-low border-2 border-dashed border-outline-variant/50 rounded-full flex flex-col items-center justify-center text-on-surface-variant cursor-pointer hover:bg-surface-container hover:border-primary/50 hover:text-primary transition-all shadow-inner">
                    <span className="material-symbols-outlined text-3xl mb-1">add_a_photo</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Upload Photo</span>
                 </div>
                 <div>
                    <h3 className="font-bold text-on-surface mb-1">Profile Photo</h3>
                    <p className="text-sm text-on-surface-variant">Used for their digital ID and smart tag matching. Max 5MB (JPG/PNG).</p>
                    <input type="hidden" name="image_url" value="" /> {/* In real app, this is handled by upload */}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Pet's Name</label>
                    <input 
                       name="name"
                       type="text" 
                       required
                       placeholder="e.g. Max" 
                       className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Species</label>
                    <select name="species" required className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none cursor-pointer">
                       <option value="">Select Species...</option>
                       <option value="dog">Dog</option>
                       <option value="cat">Cat</option>
                       <option value="bird">Bird</option>
                       <option value="fish">Fish</option>
                       <option value="small pet">Small Pet</option>
                       <option value="reptile">Reptile</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Breed</label>
                    <input 
                       name="breed"
                       type="text" 
                       placeholder="Start typing to search breeds..." 
                       className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Sex</label>
                       <select name="sex" className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none cursor-pointer">
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Age</label>
                        <input 
                           name="age"
                           type="text" 
                           placeholder="e.g. 2 Years" 
                           className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                        />
                    </div>
                 </div>
              </div>

              <div className="pt-6 flex justify-end gap-4">
                 <Link href="/dashboard/pets" className="bg-surface-container-low hover:bg-surface-container text-on-surface font-bold px-6 py-3.5 rounded-xl border border-outline-variant/30 transition-colors">
                    Cancel
                 </Link>
                 <button type="submit" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">save</span> Save Pet Profile
                 </button>
              </div>
           </form>
           
           <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[50px] pointer-events-none"></div>
        </section>
      </main>
    </div>
  );
}
