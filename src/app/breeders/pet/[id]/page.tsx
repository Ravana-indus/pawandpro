import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { reservePet } from "@/lib/actions/escrow";

import { getPetListingById } from "@/lib/queries";

export default async function PetDetailPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const errorMessage = resolvedSearchParams.error as string | undefined;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const pet = await getPetListingById(id);

  if (!pet) {
    return notFound();
  }


  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center gap-2 text-sm text-on-surface-variant">
        <Link href="/breeders" className="hover:text-primary transition-colors">Marketplace &amp; Peers</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link href="/breeders/profile" className="hover:text-primary transition-colors">{pet.breederName}</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-bold text-on-surface">{pet.name} ({pet.breed})</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative items-start">
        {/* Left Column: Images & Health */}
        <div className="lg:col-span-7 space-y-8">
          <div className="aspect-[4/3] bg-surface-container-lowest rounded-3xl border border-outline-variant/20 overflow-hidden relative shadow-sm">
            <div className="absolute top-6 left-6 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm border border-amber-200 backdrop-blur-md bg-amber-100/90 text-amber-800 z-10">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              {pet.certificationTier}
            </div>
            <img
              alt={pet.name}
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
              src={pet.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&h=400&fit=crop"}
            />
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
             {[1, 2, 3].map((i) => (
               <div key={i} className={`w-24 h-24 sm:w-32 sm:h-32 rounded-2xl cursor-pointer snap-start shrink-0 border-2 ${i === 1 ? 'border-primary' : 'border-transparent'} overflow-hidden relative`}>
                 <img src={pet.image || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop"} alt="Thumbnail" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
               </div>
             ))}
          </div>
          
          {/* Health & Certification Document Section */}
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 shadow-sm mt-12">
             <h2 className="text-2xl font-bold font-headline mb-6 flex items-center gap-2">
               <span className="material-symbols-outlined text-primary">local_hospital</span> Medical &amp; Clinical Records
             </h2>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className={`p-4 rounded-xl border flex flex-col gap-2 ${pet.healthDocs.vaccinated ? 'bg-tertiary-container/10 border-tertiary/20 text-tertiary shadow-sm' : 'bg-surface-container border-outline-variant/10 text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: pet.healthDocs.vaccinated ? "'FILL' 1" : "'FILL' 0" }}>vaccines</span>
                  <span className="font-bold text-sm">Vaccinated (DHPPI)</span>
                </div>
                <div className={`p-4 rounded-xl border flex flex-col gap-2 ${pet.healthDocs.microchipped ? 'bg-secondary-container/10 border-secondary/20 text-secondary shadow-sm' : 'bg-surface-container border-outline-variant/10 text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: pet.healthDocs.microchipped ? "'FILL' 1" : "'FILL' 0" }}>memory</span>
                  <span className="font-bold text-sm">Microchipped (ISO)</span>
                </div>
                <div className={`p-4 rounded-xl border flex flex-col gap-2 ${pet.healthDocs.healthCertificate ? 'bg-primary-container/10 border-primary/20 text-primary shadow-sm' : 'bg-surface-container border-outline-variant/10 text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: pet.healthDocs.healthCertificate ? "'FILL' 1" : "'FILL' 0" }}>verified</span>
                  <span className="font-bold text-sm">Vet Certified</span>
                </div>
             </div>
             
             <p className="text-sm text-on-surface-variant leading-relaxed bg-surface-container-low p-4 rounded-xl">
               Digital copies of health booklets, lineage certificates, and SLVC veterinary signatures will be securely transferred to your PetZen Family Dashboard upon successful completion of the Escrow transaction.
             </p>
          </div>
        </div>

        {/* Right Column: Details & Action */}
        <div className="lg:col-span-5 flex flex-col lg:sticky lg:top-28">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full">{pet.type} listing</span>
            <button className="text-on-surface hover:text-error transition-colors p-2 bg-surface-container-low rounded-full">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>favorite</span>
            </button>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight mb-2 text-on-surface flex items-center gap-3">
             {pet.name}
             {pet.sex === 'Female' ? (
                <span className="material-symbols-outlined text-tertiary" title="Female">female</span>
             ) : (
                <span className="material-symbols-outlined text-secondary" title="Male">male</span>
             )}
          </h1>
          <p className="text-lg text-on-surface-variant font-medium mb-6">Purebred {pet.breed}</p>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="text-4xl font-black text-primary font-headline">Rs. {pet.price.toLocaleString()}</div>
          </div>
          
          {/* Quick Specs */}
          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-surface-container-lowest border border-outline-variant/20 p-4 rounded-2xl flex flex-col gap-1">
               <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant max-w-[80%] line-clamp-1">Age</span>
               <span className="font-bold text-on-surface text-lg">{pet.age}</span>
             </div>
             <div className="bg-surface-container-lowest border border-outline-variant/20 p-4 rounded-2xl flex flex-col gap-1">
               <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant max-w-[80%] line-clamp-1">Gender</span>
               <span className="font-bold text-on-surface text-lg">{pet.sex}</span>
             </div>
             <div className="bg-surface-container-lowest border border-outline-variant/20 p-4 rounded-2xl flex flex-col gap-1">
               <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant max-w-[80%] line-clamp-1">Location</span>
               <span className="font-bold text-on-surface text-lg">{pet.location.split(',')[0]}</span>
             </div>
             <div className="bg-surface-container-lowest border border-outline-variant/20 p-4 rounded-2xl flex flex-col gap-1">
               <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant max-w-[80%] line-clamp-1">Species</span>
               <span className="font-bold text-on-surface text-lg">{pet.species}</span>
             </div>
          </div>

          <p className="text-on-surface-variant text-base mb-8 leading-relaxed">
            A healthy, playful, and well-socialized {pet.sex.toLowerCase()} {pet.breed} puppy. Raised in a clinical environment with early neurological stimulation (ENS) and exposed to common household noises. Fully weaned onto premium clinical nutrition.
          </p>

          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20 mb-8 shadow-sm group">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4">Breeder Information</h3>
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-container rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">apartment</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">{pet.breederName}</h4>
                    <div className="flex items-center gap-1 text-xs text-amber-600 font-bold mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">star</span> 4.9 Rating
                    </div>
                  </div>
               </div>
               <Link href="/breeders/profile" className="text-primary font-bold bg-primary/10 px-4 py-2 rounded-lg text-sm hover:bg-primary hover:text-white transition-colors">
                 View Info
               </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-auto">
            {pet.status === 'Available' ? (
              user ? (
                <div className="flex flex-col gap-3">
                  {errorMessage && (
                    <div className="bg-error/10 text-error p-4 rounded-xl text-sm flex items-start gap-2 border border-error/20">
                      <span className="material-symbols-outlined text-base">error</span>
                      <p>{errorMessage}. Please verify your account setup or contact support.</p>
                    </div>
                  )}
                  <form action={reservePet}>
                    <input type="hidden" name="listing_id" value={pet.id} />
                    <input type="hidden" name="price" value={pet.price} />
                    <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl flex flex-col items-center justify-center gap-1 shadow-lg hover:shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5 active:scale-95">
                      <span className="flex items-center gap-2 text-lg"><span className="material-symbols-outlined">lock</span> Reserve with Escrow</span>
                      <span className="text-[10px] font-normal opacity-80 uppercase tracking-widest">Fully Refundable Protection</span>
                    </button>
                  </form>
                </div>
              ) : (
                <Link href={`/login?redirect=/breeders/pet/${pet.id}`} className="w-full bg-primary text-white font-bold py-4 rounded-xl flex flex-col items-center justify-center gap-1 shadow-lg hover:shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-0.5 active:scale-95 text-center">
                  <span className="flex items-center gap-2 text-lg"><span className="material-symbols-outlined">login</span> Login to Reserve</span>
                  <span className="text-[10px] font-normal opacity-80 uppercase tracking-widest">Escrow protection requires an account</span>
                </Link>
              )
            ) : (
              <div className="w-full bg-surface-container-high text-on-surface-variant font-bold py-4 rounded-xl flex flex-col items-center justify-center gap-1">
                <span className="flex items-center gap-2 text-lg"><span className="material-symbols-outlined">pending_actions</span> Reserved in Escrow</span>
                <span className="text-[10px] font-normal uppercase tracking-widest">Transaction in progress</span>
              </div>
            )}
            
            <button className="w-full bg-surface-container-lowest text-on-surface font-bold py-4 rounded-xl border border-outline-variant/30 flex items-center justify-center gap-2 hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">calendar_month</span> Schedule Meet &amp; Greet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
