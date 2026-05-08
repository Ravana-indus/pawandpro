import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return redirect('/login');
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch pets
  const { data: pets } = await supabase
    .from('pets')
    .select('*')
    .eq('owner_id', user.id);

  const myPets = pets || [];
  const primaryPet = myPets[0];

  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
      <DashboardSidebar />

      {/* Main Dashboard Content */}
      <main className="flex-1">
        {/* Welcome & Stats */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-bl-full pointer-events-none -z-10 translate-x-1/4 -translate-y-1/4"></div>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-surface-container overflow-hidden shadow-sm border border-outline-variant/10">
               <img
                  alt="User avatar"
                  className="w-full h-full object-cover"
                  src={profile?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"}
                />
            </div>
            <div>
              <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!</h2>
              <div className="flex items-center gap-2 mt-2">
                 <span className="material-symbols-outlined text-amber-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
                 <p className="text-on-surface-variant font-bold text-sm">You have 1,240 PetZen Coins.</p>
              </div>
            </div>
          </div>
          <Link href="/dashboard/pets/new" className="inline-block bg-primary text-white px-6 py-3.5 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-md flex items-center gap-2 group">
            <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span> Add New Pet
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pet Profiles */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-end mb-6 border-b border-outline-variant/10 pb-4">
              <h3 className="text-2xl font-headline font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">family_restroom</span> Your Family
              </h3>
              <Link href="/dashboard/pets" className="text-primary font-bold text-sm hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              {myPets.map(pet => (
                <Link key={pet.id} href={`/dashboard/pets/${pet.id}`} className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl hover:bg-surface-container cursor-pointer transition-colors border border-outline-variant/10 group">
                  <div className="w-16 h-16 rounded-xl bg-surface-container overflow-hidden shrink-0 shadow-sm border border-outline-variant/10">
                    <img
                      alt={pet.name}
                      src={pet.image_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors">{pet.name}</h4>
                    <p className="text-xs text-on-surface-variant font-medium">{pet.breed} • {pet.age}</p>
                  </div>
                  <span className="material-symbols-outlined text-primary text-sm transition-transform group-hover:translate-x-1">arrow_forward_ios</span>
                </Link>
              ))}
              
              <Link href="/dashboard/pets/new" className="flex items-center gap-4 border-2 border-dashed border-outline-variant/30 p-4 rounded-xl hover:bg-surface-container-lowest cursor-pointer transition-colors group">
                 <div className="w-16 h-16 rounded-xl bg-surface-container-highest flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">add</span>
                 </div>
                 <div>
                    <h4 className="font-bold text-on-surface">Add a Family Member</h4>
                    <p className="text-xs text-on-surface-variant">Track clinical health &amp; diet</p>
                 </div>
              </Link>
            </div>
          </div>

          {/* Upcoming Reminders */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-8 shadow-sm flex flex-col relative overflow-hidden">
            <h3 className="text-2xl font-headline font-bold mb-6 text-on-surface border-b border-outline-variant/10 pb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">bolt</span> Action Needed
            </h3>
            
            <div className="space-y-4 flex-1 relative z-10">
               {primaryPet ? (
                 <div className="bg-error/5 border border-error/20 p-5 rounded-2xl flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                   <span className="material-symbols-outlined text-error p-2 bg-error/10 rounded-lg" style={{ fontVariationSettings: "'FILL' 1" }}>vaccines</span>
                   <div className="flex-1">
                     <h4 className="font-bold text-error">Annual Vaccination Overdue</h4>
                     <p className="text-sm text-error/80 mt-1 leading-relaxed">{primaryPet.name} is due for a Rabies booster. Required for SLVC compliance.</p>
                     <Link href="/veterinary/book-home-visit" className="mt-3 text-[10px] font-black uppercase tracking-widest text-white bg-error px-4 py-2 rounded-lg hover:bg-error/90 transition-colors inline-block">Book Vet Visit</Link>
                   </div>
                 </div>
               ) : (
                 <div className="py-8 text-center bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/40">
                    <p className="text-sm text-on-surface-variant">No immediate actions required.</p>
                 </div>
               )}
               
               <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                 <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-lg" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                 <div className="flex-1">
                   <h4 className="font-bold text-primary">Auto-Delivery Incoming</h4>
                   <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">Clinical Core Kibble arriving tomorrow.</p>
                   <Link href="/dashboard/orders/track" className="inline-block mt-3 text-[10px] font-black uppercase tracking-widest text-primary border border-primary/30 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors">Track Order</Link>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
