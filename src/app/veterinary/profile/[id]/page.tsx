import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { bookAppointment } from "@/lib/actions/appointments";

import { getVetById } from "@/lib/queries";

export default async function VetProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  const vet = await getVetById(id);

  if (!vet) {
    return notFound();
  }

  // Fetch user's pets for booking
  let myPets: any[] = [];
  if (user) {
    const { data } = await supabase.from('pets').select('id, name').eq('owner_id', user.id);
    myPets = data || [];
  }


  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center gap-2 text-sm text-on-surface-variant">
        <Link href="/veterinary" className="hover:text-primary transition-colors">Veterinary Hub</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-bold text-on-surface">{vet.full_name}</span>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-sm border border-outline-variant/20 relative overflow-hidden mb-12 group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-bl-full pointer-events-none transition-transform duration-1000 group-hover:scale-110"></div>
        
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start relative z-10">
          <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-3xl bg-surface-container overflow-hidden shadow-lg shrink-0 border border-outline-variant/10">
             <img
                alt={vet.full_name || ''}
                className="w-full h-full object-cover"
                src={vet.avatar_url || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop"}
              />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-4xl lg:text-5xl font-headline font-extrabold tracking-tight">{vet.full_name}</h1>
              <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-tertiary/20 shadow-sm">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                SLVC Certified
              </span>
            </div>
            <p className="text-xl text-primary font-bold mb-6">{vet.details?.specialization}</p>
            
            <p className="text-on-surface-variant leading-relaxed mb-8 text-lg max-w-2xl">
              With over {vet.details?.experience_years} years of clinical experience, Dr. {(vet.full_name || '').split(' ').pop()} specializes in advanced pet health care and diagnostics.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10 border-t border-outline-variant/20 pt-8">
              <div>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-black mb-1">Consultation Fee</p>
                <p className="font-black text-3xl font-headline text-on-surface">Rs. {(vet.details?.consultation_fee || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-black mb-1">Rating</p>
                <div className="flex items-center gap-1 text-3xl font-black font-headline">
                   {(vet.details?.rating ?? 4.5).toFixed(1)} <span className="material-symbols-outlined text-amber-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
              </div>
              <div className="sm:col-span-2">
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-black mb-2">Availability</p>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${vet.details?.is_available_now ? 'bg-tertiary-container/30 text-tertiary border border-tertiary/20' : 'bg-surface-container-highest text-on-surface-variant border border-outline-variant/20'}`}>
                  {vet.details?.is_available_now && <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse shadow-[0_0_10px_rgba(0,100,0,0.5)]"></span>}
                  {vet.details?.is_available_now ? 'Available Right Now' : 'Currently Busy'}
                </span>
              </div>
            </div>

            {/* Booking Form */}
            {user ? (
              <form action={bookAppointment as any} className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 max-w-xl">
                <h3 className="font-bold mb-4">Book a Consultation</h3>
                <input type="hidden" name="vet_id" value={vet.id} />
                <input type="hidden" name="fee" value={vet.details?.consultation_fee || 0} />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1">Select Pet</label>
                    <select name="pet_id" required className="w-full bg-white border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="">Choose a pet</option>
                      {myPets.map(pet => (
                        <option key={pet.id} value={pet.id}>{pet.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1">Preferred Date</label>
                    <input type="datetime-local" name="scheduled_at" required className="w-full bg-white border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-[10px] font-black uppercase mb-1">Notes for Doctor</label>
                  <textarea name="notes" placeholder="Reason for consultation..." className="w-full bg-white border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 h-20 resize-none"></textarea>
                </div>

                <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">calendar_today</span> Confirm Booking
                </button>
              </form>
            ) : (
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl text-center max-w-xl">
                <p className="font-bold text-primary mb-4">Login to book a consultation</p>
                <Link href="/login" className="inline-block bg-primary text-white font-bold px-8 py-3 rounded-xl">Login Now</Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Clinic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/20">
            <h3 className="font-bold font-headline text-2xl mb-6">Clinic Affiliation</h3>
            <div className="flex items-start gap-4 mb-6">
               <div className="w-16 h-16 bg-surface-container-highest rounded-2xl flex items-center justify-center shrink-0">
                 <span className="material-symbols-outlined text-primary text-3xl">local_hospital</span>
               </div>
               <div>
                  <h4 className="font-bold text-lg">PetZen Clinical Center</h4>
                  <p className="text-on-surface-variant flex items-center gap-1 mt-1 text-sm"><span className="material-symbols-outlined text-[16px]">location_on</span> Colombo 07, Western Province</p>
               </div>
            </div>
            
            <div className="space-y-3 pl-20">
               <div className="flex text-sm">
                 <span className="w-24 text-on-surface-variant">Mon - Fri</span>
                 <span className="font-medium">08:00 AM - 08:00 PM</span>
               </div>
               <div className="flex text-sm">
                 <span className="w-24 text-on-surface-variant">Saturday</span>
                 <span className="font-medium">08:00 AM - 04:00 PM</span>
               </div>
               <div className="flex text-sm text-error">
                 <span className="w-24">Sunday</span>
                 <span className="font-bold">Emergency Only</span>
               </div>
            </div>
         </div>
         
         <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/20">
            <h3 className="font-bold font-headline text-2xl mb-6">Verified Reviews</h3>
            <div className="space-y-6">
               <div className="border-b border-outline-variant/20 pb-6">
                 <div className="flex justify-between items-center mb-2">
                   <span className="font-bold">Amanda D.</span>
                   <div className="flex text-amber-500 text-sm">
                     <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                     <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                     <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                     <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                     <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                   </div>
                 </div>
                 <p className="text-sm text-on-surface-variant bg-surface-container-lowest p-3 rounded-xl">"Correctly diagnosed my pet immediately. The teleconsult feature saved us a stressful trip."</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
