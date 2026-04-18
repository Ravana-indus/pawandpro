import React from "react";
import Link from "next/link";
import { Vet } from "@/types/models";

interface VetCardProps {
  vet: Vet;
}

export function VetCard({ vet }: VetCardProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6 transition-all hover:shadow-xl hover:shadow-primary/5 flex flex-col h-full group">
      <div className="flex gap-4 mb-4">
        <div className="w-20 h-20 rounded-xl bg-surface-container overflow-hidden shrink-0 relative">
          <img
            alt={vet.full_name || ""}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={vet.avatar_url || ""}
          />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h4 className="font-headline font-bold text-lg text-on-surface">{vet.full_name}</h4>
          <p className="text-sm text-on-surface-variant font-medium">{vet.details.specialization}</p>
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-outline tracking-wider mt-1">
            <span className="material-symbols-outlined text-[12px] text-tertiary">verified</span>
            {vet.details.slvc_number}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mb-5 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          <span className="font-bold">{(vet.details.rating || 0).toFixed(1)}</span>
          <span className="text-on-surface-variant">({vet.details.reviews_count || 0})</span>
        </div>
        <div className="w-1 h-1 bg-outline-variant rounded-full"></div>
        <div className="text-on-surface-variant">
           {vet.details.years_experience} Years Exp.
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {((vet.details.languages as string[]) || []).map(lang => (
          <span key={lang} className="px-2 py-1 bg-surface-container-low text-on-surface-variant rounded-md text-xs font-medium border border-outline-variant/20">
            {lang}
          </span>
        ))}
      </div>

      <div className="mt-auto space-y-3">
        <div className="flex justify-between items-center text-sm font-medium">
           <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-tertiary font-bold text-xs uppercase tracking-wider bg-tertiary-container/20 px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span> Available
              </span>
           </div>
           <span className="font-bold">Rs. {vet.details.consultation_fee.toLocaleString()}</span>
        </div>
        
        <Link href={`/veterinary/profile/${vet.id}`} className="block text-center w-full py-3 bg-surface-container text-primary font-bold rounded-xl text-sm hover:bg-primary hover:text-white transition-colors">
          Book Consultation
        </Link>
      </div>
    </div>
  );
}
