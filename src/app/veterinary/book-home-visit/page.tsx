import React from "react";
import Link from "next/link";
import { getVets, getUserPets } from "@/lib/queries";
import BookingForm from "./BookingForm";

export default async function BookHomeVisitPage() {
  const vets = await getVets();
  const pets = await getUserPets();

  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-on-surface-variant">
        <Link href="/veterinary" className="hover:text-primary transition-colors">Veterinary</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-bold text-on-surface">Book Home Visit</span>
      </div>

      <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Book a Home Visit</h1>
      <p className="text-on-surface-variant text-lg mb-10">A certified vet comes to you. Zero commute, zero stress.</p>

      <BookingForm initialPets={pets} initialVets={vets} />
    </div>
  );
}
