import React from "react";
import Link from "next/link";
import { PetListing } from "@/types/models";

interface PetListingCardProps {
  pet: PetListing;
}

export function PetListingCard({ pet }: PetListingCardProps) {
  const getBadgeColor = (tier: string) => {
    switch (tier) {
      case 'Gold': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Silver': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'Verified': return 'bg-primary-container/20 text-primary border-primary/20';
      case 'Shelter': return 'bg-tertiary-container/20 text-tertiary border-tertiary/20';
      default: return 'bg-surface-container text-on-surface';
    }
  };

  const getBadgeIcon = (tier: string) => {
    switch (tier) {
      case 'Gold': return 'workspace_premium';
      case 'Silver': return 'verified';
      case 'Verified': return 'check_circle';
      case 'Shelter': return 'volunteer_activism';
      default: return 'info';
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300 border border-outline-variant/20 flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-container-low">
        <Link href={`/breeders/pet/${pet.id}`}>
          <img
            src={pet.image}
            alt={pet.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </Link>
        <div className={`absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 border shadow-sm backdrop-blur-md bg-white/90 ${getBadgeColor(pet.certificationTier)}`}>
           <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
             {getBadgeIcon(pet.certificationTier)}
           </span>
           {pet.certificationTier}
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm text-on-surface">
           {pet.type}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <Link href={`/breeders/pet/${pet.id}`}>
            <h3 className="text-xl font-headline font-extrabold text-on-surface group-hover:text-primary transition-colors">{pet.name}</h3>
          </Link>
          <span className="text-xs font-bold text-on-surface px-2 py-1 bg-surface-container-low rounded-lg">{pet.age}</span>
        </div>
        
        <p className="text-sm text-on-surface-variant font-medium mb-4 flex items-center gap-2">
           <span className="material-symbols-outlined text-[16px] opacity-70">
              {pet.species === 'Dog' ? 'pets' : 'cruelty_free'}
           </span>
           {pet.breed} • {pet.sex}
        </p>
        
        <div className="flex gap-2 mb-5">
           {pet.healthDocs.vaccinated && (
             <span title="Vaccinated" className="w-8 h-8 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center">
               <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>vaccines</span>
             </span>
           )}
           {pet.healthDocs.healthCertificate && (
             <span title="Health Certificate" className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
               <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
             </span>
           )}
           {pet.healthDocs.microchipped && (
             <span title="Microchipped" className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
               <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>memory</span>
             </span>
           )}
        </div>

        <div className="mt-auto px-4 py-3 bg-surface-container-low rounded-xl">
           <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-1 flex items-center gap-1">
             <span className="material-symbols-outlined text-[14px]">location_on</span>
             {pet.location}
           </p>
           <p className="text-xs font-medium text-on-surface truncate">{pet.breederName}</p>
        </div>

        <div className="mt-4 flex items-center justify-between">
           <span className="text-xl font-black text-on-surface">Rs. {pet.price.toLocaleString()}</span>
           <Link href={`/breeders/pet/${pet.id}`} className="bg-on-surface text-surface px-5 py-2 rounded-lg text-sm font-bold hover:bg-primary transition-colors">
              View Info
           </Link>
        </div>
      </div>
    </div>
  );
}
