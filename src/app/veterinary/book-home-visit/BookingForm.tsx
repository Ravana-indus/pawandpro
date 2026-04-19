"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export function BookingForm({ initialVets = [], myPets = [] }: { initialVets: any[], myPets: any[] }) {
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState('');
  const [vets, setVets] = useState(initialVets);
  const [selectedVet, setSelectedVet] = useState<string | null>(null);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [urgency, setUrgency] = useState<'Standard' | 'Urgent'>('Standard');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (search.length > 2) {
      const lower = search.toLowerCase();
      setVets(initialVets.filter(v =>
        v.full_name?.toLowerCase().includes(lower) ||
        v.details?.specialization?.toLowerCase().includes(lower)
      ));
    } else {
      setVets(initialVets);
    }
  }, [search, initialVets]);

  const handleNext = () => setStep(s => Math.min(4, s + 1));
  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const vetDetails = vets.find(v => v.id === selectedVet);
  const petDetails = myPets.find(p => p.id === selectedPet);

  const baseFee = vetDetails?.details?.consultation_fee || 3500;
  const homeVisitSurcharge = 2500;
  const urgencyFee = urgency === 'Urgent' ? 3000 : 0;
  const totalFee = baseFee + homeVisitSurcharge + urgencyFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate booking
    setTimeout(() => {
       window.location.href = `/veterinary/book-home-visit/confirmation?id=${Math.random().toString(36).substr(2, 9)}`;
    }, 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="lg:w-2/3">
         <div className="bg-surface-container-low border border-outline-variant/20 rounded-3xl p-6 md:p-10">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-12 relative">
               <div className="absolute top-1/2 left-0 w-full h-1 bg-outline-variant/20 -z-10 rounded-full"></div>
               <div className={`absolute top-1/2 left-0 h-1 bg-primary -z-10 rounded-full transition-all duration-500`} style={{ width: `${((step - 1) / 3) * 100}%` }}></div>

               {[1, 2, 3, 4].map(s => (
                  <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-4 border-surface-container-low
                     ${step >= s ? 'bg-primary text-white' : 'bg-surface text-on-surface-variant border-outline-variant/20'}
                  `}>
                     {step > s ? <span className="material-symbols-outlined text-[18px]">check</span> : s}
                  </div>
               ))}
            </div>

            <form id="booking-form" onSubmit={handleSubmit}>

              {/* Step 1: Select Pet & Urgency */}
              {step === 1 && (
                <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                   <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">Who needs care today?</h2>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {myPets.map(pet => (
                         <label key={pet.id} className={`cursor-pointer border-2 rounded-2xl p-4 flex items-center gap-4 transition-all ${selectedPet === pet.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-outline-variant/20 hover:border-primary/50'}`}>
                            <input type="radio" name="pet" className="hidden" checked={selectedPet === pet.id} onChange={() => setSelectedPet(pet.id)} />
                            <img src={pet.image_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop"} className="w-14 h-14 rounded-xl object-cover" alt="" />
                            <div>
                               <p className="font-bold text-on-surface">{pet.name}</p>
                               <p className="text-xs text-on-surface-variant">{pet.species} • {pet.age}</p>
                            </div>
                         </label>
                      ))}
                      <Link href="/dashboard/pets/new" className="border-2 border-dashed border-outline-variant/40 rounded-2xl p-4 flex items-center justify-center gap-2 hover:bg-surface transition-colors text-on-surface-variant font-bold">
                         <span className="material-symbols-outlined">add_circle</span> Add Pet
                      </Link>
                   </div>

                   <h3 className="text-xl font-headline font-bold text-on-surface mt-8 mb-4">How urgent is this?</h3>
                   <div className="flex gap-4">
                      <label className={`flex-1 cursor-pointer border-2 rounded-2xl p-6 text-center transition-all ${urgency === 'Standard' ? 'border-primary bg-primary/5 shadow-sm' : 'border-outline-variant/20 hover:border-primary/50'}`}>
                         <input type="radio" className="hidden" checked={urgency === 'Standard'} onChange={() => setUrgency('Standard')} />
                         <span className="material-symbols-outlined text-[32px] text-primary mb-2 block">calendar_month</span>
                         <p className="font-bold text-on-surface">Standard Visit</p>
                         <p className="text-xs text-on-surface-variant mt-1">Within 48 hours</p>
                      </label>
                      <label className={`flex-1 cursor-pointer border-2 rounded-2xl p-6 text-center transition-all ${urgency === 'Urgent' ? 'border-error bg-error/5 shadow-sm' : 'border-outline-variant/20 hover:border-error/50'}`}>
                         <input type="radio" className="hidden" checked={urgency === 'Urgent'} onChange={() => setUrgency('Urgent')} />
                         <span className="material-symbols-outlined text-[32px] text-error mb-2 block">emergency</span>
                         <p className="font-bold text-on-surface text-error">Urgent Dispatch</p>
                         <p className="text-xs text-on-surface-variant mt-1">Within 4 hours (+Rs.3000)</p>
                      </label>
                   </div>
                </div>
              )}

              {/* Step 2: Location & Time */}
              {step === 2 && (
                <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                   <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">When and Where?</h2>

                   <div>
                      <label className="block text-sm font-bold text-on-surface mb-2">Home Address</label>
                      <textarea
                         required
                         rows={3}
                         value={address}
                         onChange={e => setAddress(e.target.value)}
                         className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                         placeholder="Enter your full street address for the vet dispatch..."
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div>
                         <label className="block text-sm font-bold text-on-surface mb-2">Date</label>
                         <input
                            required
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                         />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-on-surface mb-2">Preferred Time</label>
                         <select
                            required
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface appearance-none"
                         >
                            <option value="">Select slot...</option>
                            <option value="09:00">09:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="14:00">02:00 PM</option>
                            <option value="16:00">04:00 PM</option>
                         </select>
                      </div>
                   </div>

                   <div className="bg-surface-container-highest p-4 rounded-xl flex items-start gap-3 mt-4">
                      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">info</span>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                         Exact arrival time may vary by ±30 mins depending on traffic. The vet will contact you via phone upon dispatch.
                      </p>
                   </div>
                </div>
              )}

              {/* Step 3: Select Vet */}
              {step === 3 && (
                <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                   <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">Choose an Available Vet</h2>
                   <p className="text-on-surface-variant mb-6">Select a certified professional for your home visit.</p>

                   <div className="relative mb-6">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                      <input
                         type="text"
                         placeholder="Search by name or specialty..."
                         value={search}
                         onChange={e => setSearch(e.target.value)}
                         className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface text-sm"
                      />
                   </div>

                   <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                      {vets.map(vet => (
                         <label key={vet.id} className={`cursor-pointer border-2 rounded-2xl p-4 flex items-start gap-4 transition-all ${selectedVet === vet.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-outline-variant/20 hover:border-primary/50'}`}>
                            <input type="radio" className="hidden" checked={selectedVet === vet.id} onChange={() => setSelectedVet(vet.id)} />
                            <img src={vet.avatar_url || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop"} className="w-16 h-16 rounded-full object-cover border border-outline-variant/20" alt="" />
                            <div className="flex-1">
                               <h4 className="font-bold text-on-surface">{vet.full_name}</h4>
                               <p className="text-sm text-on-surface-variant">{vet.details?.specialization} • {vet.details?.slvc_number}</p>
                               <div className="flex items-center gap-1 text-amber-500 mt-1">
                                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                  <span className="text-xs font-bold text-on-surface">4.9 <span className="text-on-surface-variant font-normal">(124 visits)</span></span>
                               </div>
                            </div>
                            <div className="text-right">
                               <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">Rs. {vet.details?.consultation_fee || 3500}</span>
                            </div>
                         </label>
                      ))}
                      {vets.length === 0 && (
                        <div className="text-center py-8 text-on-surface-variant">
                           <span className="material-symbols-outlined text-[32px] mb-2">person_off</span>
                           <p>No veterinarians found matching your search.</p>
                        </div>
                      )}
                   </div>
                </div>
              )}

              {/* Step 4: Symptoms & Notes */}
              {step === 4 && (
                <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                   <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">Symptom Details</h2>
                   <p className="text-on-surface-variant mb-6">Help Dr. {vetDetails?.full_name?.split(' ')[0]} prepare for the visit.</p>

                   <div>
                      <label className="block text-sm font-bold text-on-surface mb-2">Chief Complaint / Symptoms</label>
                      <textarea
                         required
                         rows={5}
                         value={notes}
                         onChange={e => setNotes(e.target.value)}
                         className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
                         placeholder="Describe what's wrong, when it started, any changes in appetite or behavior..."
                      />
                   </div>

                   <div className="bg-surface-container-highest p-5 rounded-2xl border border-outline-variant/20">
                      <h4 className="font-bold text-on-surface mb-2 flex items-center gap-2">
                         <span className="material-symbols-outlined text-primary">verified_user</span> Secure Medical Record
                      </h4>
                      <p className="text-sm text-on-surface-variant">
                         Your notes and the vet's findings will be securely encrypted and saved to {petDetails?.name || 'your pet'}'s digital health passport for future reference.
                      </p>
                   </div>
                </div>
              )}
            </form>

            {/* Navigation Actions */}
            <div className="mt-10 pt-6 border-t border-outline-variant/20 flex justify-between">
               {step > 1 ? (
                  <button onClick={handleBack} className="px-6 py-3 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container transition-colors border border-transparent">
                     Back
                  </button>
               ) : <div></div>}

               {step < 4 ? (
                  <button
                     onClick={handleNext}
                     disabled={(step === 1 && !selectedPet) || (step === 2 && (!date || !time || !address)) || (step === 3 && !selectedVet)}
                     className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-transform active:scale-[0.98] shadow-md disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                  >
                     Continue <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
               ) : (
                  <button
                     form="booking-form"
                     type="submit"
                     disabled={isLoading || !notes}
                     className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-transform active:scale-[0.98] shadow-md disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 group"
                  >
                     {isLoading ? (
                        <span className="material-symbols-outlined animate-spin">refresh</span>
                     ) : (
                        <>Confirm & Pay <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">lock</span></>
                     )}
                  </button>
               )}
            </div>
         </div>
      </div>

      {/* Sidebar Summary */}
      <div className="lg:w-1/3">
         <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 sticky top-28 shadow-sm">
            <h3 className="text-xl font-headline font-bold text-on-surface mb-6">Booking Summary</h3>

            <div className="space-y-4 mb-6">
               <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant mt-0.5">pets</span>
                  <div>
                     <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Patient</p>
                     <p className="font-medium text-on-surface">{petDetails?.name || 'Not selected'}</p>
                  </div>
               </div>

               <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant mt-0.5">medical_services</span>
                  <div>
                     <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Veterinarian</p>
                     <p className="font-medium text-on-surface">{vetDetails ? `Dr. ${vetDetails.full_name}` : 'Not selected'}</p>
                  </div>
               </div>

               <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant mt-0.5">schedule</span>
                  <div>
                     <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Time & Location</p>
                     <p className="font-medium text-on-surface">
                        {date && time ? `${new Date(date).toLocaleDateString()} at ${time}` : 'Not scheduled'}
                     </p>
                     {address && <p className="text-sm text-on-surface-variant truncate max-w-[200px] mt-0.5">{address}</p>}
                  </div>
               </div>
            </div>

            <div className="border-t border-outline-variant/20 pt-6 space-y-3 mb-6">
               <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Consultation Fee</span>
                  <span className="font-bold text-on-surface">Rs. {baseFee.toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Home Visit Dispatch</span>
                  <span className="font-bold text-on-surface">Rs. {homeVisitSurcharge.toLocaleString()}</span>
               </div>
               {urgency === 'Urgent' && (
                  <div className="flex justify-between text-sm">
                     <span className="text-error font-medium">Urgent Dispatch Surcharge</span>
                     <span className="font-bold text-error">Rs. {urgencyFee.toLocaleString()}</span>
                  </div>
               )}
            </div>

            <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-center">
               <span className="font-bold text-on-surface">Total Estimation</span>
               <span className="text-2xl font-headline font-black text-primary">Rs. {totalFee.toLocaleString()}</span>
            </div>

            <p className="text-center text-xs text-on-surface-variant mt-6 flex items-center justify-center gap-1.5">
               <span className="material-symbols-outlined text-[14px]">lock</span> Secured by PayHere
            </p>
         </div>
      </div>
    </div>
  );
}
