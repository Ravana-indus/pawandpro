"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Vet } from "@/types/models";

const SERVICE_TYPES = [
  { id: "vaccination", icon: "vaccines", label: "Vaccination", desc: "Routine and overdue vaccinations. DHPP, Rabies, Bordetella." },
  { id: "checkup", icon: "stethoscope", label: "General Check-up", desc: "Full clinical wellness exam at home." },
  { id: "grooming", icon: "shower", label: "Clinical Grooming", desc: "Medical-grade grooming including skin assessment." },
  { id: "geriatric", icon: "elderly", label: "Geriatric Care", desc: "Specialist home assessment for senior pets (7+ yrs)." },
];

const TIME_SLOTS = [
  { time: "08:00 AM", available: true },
  { time: "09:30 AM", available: true },
  { time: "11:00 AM", available: false },
  { time: "01:00 PM", available: true },
  { time: "02:30 PM", available: true },
  { time: "04:00 PM", available: true },
  { time: "05:30 PM", available: false },
];

interface BookingFormProps {
  initialPets: any[];
  initialVets: Vet[];
}

export default function BookingForm({ initialPets, initialVets }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("vaccination");
  const [selectedPet, setSelectedPet] = useState(initialPets[0]?.id || "");
  const [selectedVet, setSelectedVet] = useState(initialVets[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState("2026-04-18");
  const [selectedTime, setSelectedTime] = useState("09:30 AM");
  const [address, setAddress] = useState("45/2 Flowing River Road, Colombo 05");
  const [notes, setNotes] = useState("");

  const totalSteps = 4;
  const vet = initialVets.find(v => v.id === selectedVet) || initialVets[0];
  const pet = initialPets.find(p => p.id === selectedPet) || initialPets[0];
  const service = SERVICE_TYPES.find(s => s.id === selectedService)!;

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(2026, 3, 15 + i);
    return {
      value: d.toISOString().split("T")[0],
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.getDate(),
    };
  });

  if (!vet || !pet) {
     return (
        <div className="p-12 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/20">
           <h2 className="text-2xl font-bold mb-4">Setup Required</h2>
           <p className="text-on-surface-variant mb-8">You need to add a pet to your profile and we need at least one registered vet to continue.</p>
           <div className="flex justify-center gap-4">
              <Link href="/dashboard/pets/add" className="bg-primary text-white px-6 py-3 rounded-xl font-bold">Add a Pet</Link>
              <Link href="/veterinary" className="bg-surface-container text-on-surface px-6 py-3 rounded-xl font-bold">Browse Vets</Link>
           </div>
        </div>
     );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-12">
        {["Service", "Pet & Vet", "Schedule", "Confirm"].map((label, i) => (
          <React.Fragment key={label}>
            <button
              onClick={() => i + 1 < step && setStep(i + 1)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                i + 1 === step ? "bg-primary text-white shadow-md shadow-primary/20" :
                i + 1 < step ? "bg-primary/10 text-primary cursor-pointer hover:bg-primary/20" :
                "bg-surface-container-low text-on-surface-variant"
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                i + 1 < step ? "bg-primary text-white" :
                i + 1 === step ? "bg-white/20 text-white" :
                "bg-surface-container-high text-on-surface-variant"
              }`}>
                {i + 1 < step ? <span className="material-symbols-outlined text-xs">check</span> : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {i < totalSteps - 1 && <div className={`flex-1 h-0.5 rounded-full ${i + 1 < step ? "bg-primary" : "bg-outline-variant/20"}`}></div>}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Service Type */}
      {step === 1 && (
        <section className="space-y-6 animate-in fade-in">
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-6">What service do you need?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SERVICE_TYPES.map(s => (
              <label
                key={s.id}
                className={`relative flex gap-4 p-6 rounded-2xl cursor-pointer border-2 transition-all group ${
                  selectedService === s.id
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-outline-variant/20 bg-surface-container-lowest hover:bg-surface-container-low hover:border-outline-variant/40"
                }`}
              >
                <input
                  type="radio"
                  name="service"
                  value={s.id}
                  checked={selectedService === s.id}
                  onChange={() => setSelectedService(s.id)}
                  className="sr-only"
                />
                {selectedService === s.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">check</span>
                  </div>
                )}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                  selectedService === s.id ? "bg-primary text-white" : "bg-surface-container text-primary"
                }`}>
                  <span className="material-symbols-outlined text-[28px]">{s.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-lg mb-1">{s.label}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{s.desc}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="flex justify-end pt-6">
            <button onClick={() => setStep(2)} className="bg-primary text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center gap-2">
              Continue <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </section>
      )}

      {/* Step 2: Pet & Vet Selection */}
      {step === 2 && (
        <section className="space-y-10 animate-in fade-in">
          <div>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-6">Select your pet</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {initialPets.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPet(p.id)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all min-w-[130px] shrink-0 ${
                    selectedPet === p.id
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-outline-variant/20 bg-surface-container-lowest hover:bg-surface-container-low"
                  }`}
                >
                  <div className={`w-20 h-20 rounded-full overflow-hidden border-2 ${selectedPet === p.id ? "border-primary" : "border-transparent"}`}>
                    <img src={p.image_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop"} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-on-surface text-sm">{p.name}</p>
                    <p className="text-xs text-on-surface-variant">{p.breed}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-6">Choose your veterinarian</h2>
            <div className="space-y-4">
              {initialVets.map(v => (
                <label
                  key={v.id}
                  className={`flex items-center gap-5 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedVet === v.id
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-outline-variant/20 bg-surface-container-lowest hover:bg-surface-container-low"
                  }`}
                >
                  <input type="radio" name="vet" value={v.id} checked={selectedVet === v.id} onChange={() => setSelectedVet(v.id)} className="sr-only" />
                  <div className="w-16 h-16 rounded-xl bg-surface-container overflow-hidden shrink-0 shadow-sm">
                    <img src={v.avatar_url || ""} alt={v.full_name || ""} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-on-surface">{v.full_name}</h4>
                      <span className="bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> {v.details.slvc_number}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant">{v.details.specialization}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-amber-500 mb-1">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-sm font-bold text-on-surface">{v.details.rating || 5.0}</span>
                    </div>
                    <p className="text-sm font-bold text-primary">Rs. {(v.details.consultation_fee + 1500).toLocaleString()}</p>
                    <p className="text-[10px] text-on-surface-variant">Home visit fee incl.</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <button onClick={() => setStep(1)} className="bg-surface-container-low text-on-surface font-bold px-6 py-4 rounded-xl border border-outline-variant/30 hover:bg-surface-container transition-colors">
              Back
            </button>
            <button onClick={() => setStep(3)} className="bg-primary text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center gap-2">
              Continue <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </section>
      )}

      {/* Step 3: Schedule */}
      {step === 3 && (
        <section className="space-y-10 animate-in fade-in">
          <div>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-6">Choose a date</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {dates.map(d => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDate(d.value)}
                  className={`flex flex-col items-center gap-1 px-5 py-4 rounded-2xl border-2 transition-all shrink-0 min-w-[72px] ${
                    selectedDate === d.value
                      ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                      : "border-outline-variant/20 bg-surface-container-lowest hover:bg-surface-container-low text-on-surface"
                  }`}
                >
                  <span className={`text-xs font-bold uppercase ${selectedDate === d.value ? "text-white/70" : "text-on-surface-variant"}`}>{d.day}</span>
                  <span className="text-2xl font-black font-headline">{d.date}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-6">Select a time slot</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`py-3 px-2 rounded-xl text-sm font-bold transition-all ${
                    !slot.available ? "bg-surface-container text-outline cursor-not-allowed line-through opacity-50" :
                    selectedTime === slot.time
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-surface-container-lowest border border-outline-variant/20 text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-headline text-on-surface mb-4">Visit address</h2>
            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-[28px] mt-1">location_on</span>
                <div className="flex-1">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-transparent border-none text-on-surface font-bold text-lg focus:outline-none mb-2"
                  />
                  <p className="text-sm text-on-surface-variant">Western Province, Sri Lanka</p>
                </div>
                <button className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors shrink-0">
                  Change
                </button>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold font-headline text-on-surface mb-3">Additional notes <span className="text-on-surface-variant font-normal text-sm">(optional)</span></h2>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Gate code is #1234, pet is nervous around strangers..."
              rows={3}
              className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium resize-none"
            />
          </div>

          <div className="flex justify-between pt-6">
            <button onClick={() => setStep(2)} className="bg-surface-container-low text-on-surface font-bold px-6 py-4 rounded-xl border border-outline-variant/30 hover:bg-surface-container transition-colors">
              Back
            </button>
            <button onClick={() => setStep(4)} className="bg-primary text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center gap-2">
              Review Booking <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
          </div>
        </section>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && (
        <section className="space-y-8 animate-in fade-in">
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-2">Review & Confirm</h2>
          <p className="text-on-surface-variant mb-8">Please review the details below before confirming your home visit booking.</p>

          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl overflow-hidden shadow-sm">
            {/* Service + Pet */}
            <div className="p-6 md:p-8 border-b border-outline-variant/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[32px]">{service.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-on-surface">{service.label}</h3>
                    <p className="text-sm text-on-surface-variant">{service.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-surface-container-low px-4 py-3 rounded-xl">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant/20">
                    <img src={pet.image_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop"} alt={pet.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface text-sm">{pet.name}</p>
                    <p className="text-xs text-on-surface-variant">{pet.breed} • {pet.age}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vet */}
            <div className="p-6 md:p-8 border-b border-outline-variant/10 flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-sm">
                <img src={vet.avatar_url || ""} alt={vet.full_name || ""} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-on-surface">{vet.full_name}</h4>
                <p className="text-sm text-on-surface-variant">{v.details.specialization} • {v.details.slvc_number}</p>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="text-sm font-bold text-on-surface">{v.details.rating || 5.0}</span>
              </div>
            </div>

            {/* Schedule */}
            <div className="p-6 md:p-8 border-b border-outline-variant/10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Date</p>
                <p className="font-bold text-on-surface text-lg">{new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Time</p>
                <p className="font-bold text-on-surface text-lg">{selectedTime}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Location</p>
                <p className="font-bold text-on-surface text-sm">{address}</p>
              </div>
            </div>

            {/* Pricing */}
            <div className="p-6 md:p-8 bg-surface-container-low/50 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Consultation Fee</span>
                <span className="font-bold text-on-surface">Rs. {v.details.consultation_fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Home Visit Surcharge</span>
                <span className="font-bold text-on-surface">Rs. 1,500</span>
              </div>
              {selectedService === "vaccination" && (
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">DHPP + Rabies Vaccine Pack</span>
                  <span className="font-bold text-on-surface">Rs. 3,500</span>
                </div>
              )}
              <div className="border-t border-outline-variant/20 pt-3 flex justify-between text-base">
                <span className="font-bold text-on-surface">Total Estimated</span>
                <span className="font-black text-primary text-xl">
                  Rs. {(v.details.consultation_fee + 1500 + (selectedService === "vaccination" ? 3500 : 0)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 text-xs font-bold text-on-surface-variant">
            <span className="flex items-center gap-1.5 bg-surface-container-low px-3 py-2 rounded-full border border-outline-variant/10">
              <span className="material-symbols-outlined text-[14px] text-primary">lock</span> E2E Encrypted
            </span>
            <span className="flex items-center gap-1.5 bg-surface-container-low px-3 py-2 rounded-full border border-outline-variant/10">
              <span className="material-symbols-outlined text-[14px] text-tertiary">verified</span> SLVC Certified
            </span>
            <span className="flex items-center gap-1.5 bg-surface-container-low px-3 py-2 rounded-full border border-outline-variant/10">
              <span className="material-symbols-outlined text-[14px] text-secondary">shield</span> PetZen Guarantee
            </span>
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(3)} className="bg-surface-container-low text-on-surface font-bold px-6 py-4 rounded-xl border border-outline-variant/30 hover:bg-surface-container transition-colors">
              Back
            </button>
            <Link
              href="/veterinary/book-home-visit/confirmation"
              className="bg-primary text-white font-bold px-10 py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center gap-2 text-lg"
            >
              <span className="material-symbols-outlined">check_circle</span> Confirm Booking
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
