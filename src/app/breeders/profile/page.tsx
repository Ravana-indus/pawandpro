import React from "react";
import Link from "next/link";
import { PetListingCard } from "@/components/PetListingCard";
import { getPetListings } from "@/lib/queries";

export default async function BreederProfilePage() {
  const breederPets = await getPetListings({ limit: 4 });

  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto">
       {/* Breeder Header */}
       <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/20 mb-12 relative flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 h-64 md:h-auto bg-surface-container relative shrink-0">
             <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoEGHMNAfo7z65AsDLWgQ9kKEP3LSB3mPVHNSd9u3psMyWW59A1ud6uD_5EkioFKc22o0vbAOtjH7QesxOgiMSK46ACoaxjomYx55YUaGRkpqJVBXpEwGs-H5fDqnrnKBPBz4ILAgQI5BjnVsu_2aYk5CFJ75LTGbkItist0DzGgx7P8nbkSNqsYtFFaGJH4zNdybihjNBTH-ETvg81ILMzWtWxVABMUCrBNwtCE7jipwv_ekWpS6_N9l-1Pkoi9VDRgAL-q6lhW4" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
             
             <div className="absolute bottom-6 left-6 right-6 md:inset-x-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:p-8 flex flex-col items-start text-white">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/30">
                  <span className="material-symbols-outlined text-3xl">apartment</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-headline font-extrabold tracking-tight mb-2">Royal Crest Kennels</h1>
                <p className="text-white/80 font-bold flex items-center gap-1 text-sm"><span className="material-symbols-outlined text-[16px]">location_on</span> Nuwara Eliya, Central Province</p>
             </div>
          </div>
          
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
             <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-amber-100/50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                  Gold Certified
                </span>
                <span className="bg-surface-container-low border border-outline-variant/30 text-on-surface px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">pets</span>
                  Golden Retrievers
                </span>
             </div>
             
             <p className="text-on-surface-variant leading-relaxed text-base mb-8">
               Sri Lanka's premier Golden Retriever breeding facility. We prioritize genetic health, temperament testing, and early neurological stimulation. All our dogs undergo rigorous clinical screening before breeding according to SLVC guidelines.
             </p>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 text-center">
                   <div className="text-2xl font-black text-primary mb-1">15</div>
                   <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Years Active</div>
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 text-center">
                   <div className="text-2xl font-black text-primary mb-1 flex items-center justify-center gap-1">
                     4.9 <span className="material-symbols-outlined text-amber-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                   </div>
                   <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">42 Reviews</div>
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 text-center">
                   <div className="text-2xl font-black text-primary mb-1">100%</div>
                   <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Health Guarantee</div>
                </div>
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/10 text-center">
                   <div className="text-2xl font-black text-primary mb-1">12</div>
                   <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Active Litters</div>
                </div>
             </div>
             
             <div className="flex gap-4 w-full sm:w-auto">
               <button className="flex-1 sm:flex-none bg-primary text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:bg-primary/90 transition-colors">
                 Message Breeder
               </button>
               <button className="px-6 py-3.5 bg-surface-container text-on-surface font-bold border border-outline-variant/30 rounded-xl hover:bg-surface-container-high transition-colors text-sm">
                 Read Reviews
               </button>
             </div>
          </div>
       </div>
       
       {/* Available Litters */}
       <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-headline font-bold text-on-surface">Available Litters</h2>
          <div className="bg-surface-container-low border border-outline-variant/30 px-4 py-2 flex items-center gap-2 rounded-lg cursor-pointer">
            <span className="font-bold text-sm">All</span>
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </div>
       </div>
       
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {breederPets.map(pet => (
            <PetListingCard key={pet.id} pet={pet} />
          ))}
          
          {/* Add a placeholder card since they only have 1 mock pet right now */}
          {[1,2].map(i => (
             <div key={i} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 flex flex-col h-full opacity-60">
                <div className="aspect-[4/3] bg-surface-container-low flex items-center justify-center">
                   <span className="material-symbols-outlined text-4xl text-outline-variant">image</span>
                </div>
                <div className="p-5 flex-col flex-1">
                   <div className="h-6 w-3/4 bg-surface-container-high rounded mb-2"></div>
                   <div className="h-4 w-1/2 bg-surface-container rounded mb-8"></div>
                   <div className="mt-auto flex justify-between items-end">
                      <div className="h-6 w-1/3 bg-surface-container rounded"></div>
                      <div className="h-8 w-24 bg-surface-container-high rounded"></div>
                   </div>
                </div>
             </div>
          ))}
       </div>
       
       <section className="mt-24 max-w-4xl mx-auto text-center bg-surface-container-lowest p-12 rounded-3xl border border-outline-variant/20 shadow-sm">
          <span className="material-symbols-outlined text-5xl text-primary mb-4">gavel</span>
          <h3 className="text-2xl font-bold font-headline mb-4">Escrow Verified</h3>
          <p className="text-on-surface-variant leading-relaxed">
            All adoption and purchase transactions with Royal Crest Kennels are protected by PetZen Escrow. Funds are securely held until you complete the Meet & Greet and verify the pet's health.
          </p>
       </section>
    </div>
  );
}
