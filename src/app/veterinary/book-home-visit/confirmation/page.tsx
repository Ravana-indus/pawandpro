import React from "react";
import Link from "next/link";
import { getVets, getUserPets } from "@/lib/queries";

export default async function BookingConfirmationPage() {
  const vets = await getVets();
  const pets = await getUserPets();
  
  const vet = vets[0];
  const pet = pets[0];

  if (!vet || !pet) {
    return (
      <div className="pt-24 pb-32 px-6 max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Booking Receipt</h1>
        <p className="mb-8">Your booking was successful, but we couldn't load the details right now. Please check your dashboard.</p>
        <Link href="/dashboard" className="bg-primary text-white px-8 py-3 rounded-xl font-bold">Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-32 px-6 max-w-4xl mx-auto relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-tertiary/10 rounded-full blur-[100px] -z-10"></div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[2.5rem] p-8 md:p-16 shadow-2xl relative">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-tertiary text-white rounded-full flex items-center justify-center border-8 border-tertiary/20 shadow-lg shadow-tertiary/30 relative">
            <span className="material-symbols-outlined text-5xl">home</span>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <span className="material-symbols-outlined text-sm">check</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tighter mb-4">Home Visit Confirmed!</h1>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
            Your booking <span className="font-bold text-on-surface">#HV-2026-0418</span> has been confirmed.
            {vet.full_name} will arrive at your location on the scheduled date.
          </p>
        </div>

        {/* Summary card */}
        <div className="bg-surface-container-low rounded-2xl p-6 md:p-8 border border-outline-variant/10 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm border border-outline-variant/10">
                  <img src={vet.avatar_url || ""} alt={vet.full_name || ""} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-on-surface">{vet.full_name}</p>
                  <p className="text-xs text-on-surface-variant">{vet.details.specialization} • {vet.details.slvc_number}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-outline-variant/10">
                  <img src={pet.image_url || ""} alt={pet.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-on-surface">{pet.name}</p>
                  <p className="text-xs text-on-surface-variant">{pet.breed} • {pet.age}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Service</p>
                <p className="font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">vaccines</span> 
                  Vaccination (DHPP + Rabies)
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Date & Time</p>
                <p className="font-bold text-on-surface">Saturday, April 18 • 09:30 AM</p>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Location</p>
                <p className="font-bold text-on-surface text-sm">45/2 Flowing River Road, Colombo 05</p>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Amount</p>
                <p className="font-black text-primary text-xl">Rs. {(vet.details.consultation_fee + 5000).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-10">
          <h3 className="text-lg font-bold font-headline text-on-surface mb-6">What happens next?</h3>
          <div className="space-y-0 relative ml-4">
            <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-outline-variant/20"></div>
            {[
              { icon: "notifications_active", title: "Reminder Sent", desc: "You'll receive an SMS and email confirmation shortly.", done: true },
              { icon: "directions_car", title: "Vet En Route", desc: `You'll be notified when ${vet.full_name} departs for your address.`, done: false },
              { icon: "home", title: "Home Visit", desc: "The vet arrives and performs the clinical service at your location.", done: false },
              { icon: "description", title: "Digital Record", desc: "The health record and invoice are added to your dashboard automatically.", done: false },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 pb-8 relative">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                  item.done ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant border border-outline-variant/30"
                }`}>
                  {item.done ? <span className="material-symbols-outlined text-xs">check</span> : <span className="text-[10px] font-bold">{i + 1}</span>}
                </div>
                <div>
                  <h4 className={`font-bold mb-1 ${item.done ? "text-primary" : "text-on-surface"}`}>{item.title}</h4>
                  <p className="text-sm text-on-surface-variant">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard" className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-transform active:scale-[0.98] text-center flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">dashboard</span> Go to Dashboard
          </Link>
          <Link href="/veterinary" className="bg-surface-container-low hover:bg-surface-container text-on-surface font-bold py-4 px-8 rounded-xl border border-outline-variant/30 transition-colors text-center">
            Back to Veterinary
          </Link>
        </div>
      </div>
    </div>
  );
}
