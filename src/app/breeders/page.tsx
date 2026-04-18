import React from "react";
import Link from "next/link";
import { PetListingCard } from "@/components/PetListingCard";
import { createClient } from "@/lib/supabase/server";

import { getPetListings } from "@/lib/queries";

export default async function BreedersPage() {
  const listings = await getPetListings();


  return (
    <div className="pt-12 pb-20 px-6 max-w-screen-2xl mx-auto">
      {/* Hero Section */}
      <header className="mb-16 mt-8 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-3xl rounded-full -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-[18px]">workspace_premium</span>
              <span className="font-label text-sm uppercase tracking-widest text-primary font-bold block">Verified Matchmaking</span>
            </div>
            <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-on-surface leading-tight tracking-tighter">
              Find your perfect <br className="hidden md:block" />companion.
            </h1>
          </div>
          <div className="md:col-span-4 pb-2">
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-sm">
              Connecting ethical breeders, verified pet owners, and shelters in a clinical, secure digital gallery with escrow protection.
            </p>
          </div>
        </div>
      </header>

      {/* Filters Section */}
      <section className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
           {['All Pets', 'Dogs & Puppies', 'Cats & Kittens', 'Birds', 'Small Pets'].map((filter, i) => (
             <button key={filter} className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${i === 0 ? 'bg-primary text-white hover:bg-primary/90' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'}`}>
               {filter}
             </button>
           ))}
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="bg-surface-container-low px-4 py-2.5 rounded-full border border-outline-variant/30 flex items-center gap-2 shrink-0">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            <select className="bg-transparent text-sm font-bold text-on-surface focus:outline-none cursor-pointer">
              <option>All Locations</option>
              <option>Colombo</option>
              <option>Kandy</option>
              <option>Galle</option>
            </select>
          </div>
          <div className="bg-surface-container-low px-4 py-2.5 rounded-full border border-outline-variant/30 flex items-center gap-2 cursor-pointer hover:bg-surface-container shrink-0 transition-colors">
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span className="text-sm font-bold">More Filters</span>
          </div>
        </div>
      </section>

      <section className="mb-8">
         <div className="flex bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/20 w-fit">
            <button className="px-6 py-2 bg-surface text-on-surface font-bold text-sm rounded-lg shadow-sm">All Forms</button>
            <button className="px-6 py-2 text-on-surface-variant font-medium text-sm hover:text-on-surface transition-colors">Buy from Breeder</button>
            <button className="px-6 py-2 text-on-surface-variant font-medium text-sm hover:text-on-surface transition-colors flex items-center gap-1">Adopt <span className="w-2 h-2 rounded-full bg-tertiary"></span></button>
         </div>
      </section>

      {/* Marketplace Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-24">
        {listings.map((pet) => (
           <PetListingCard key={pet.id} pet={pet as any} />
        ))}
        {listings.length === 0 && (
          <div className="col-span-full py-12 text-center text-on-surface-variant">
            No pet listings available at the moment.
          </div>
        )}
      </div>

      {/* Featured Section: Breeder of the Month */}
      <section className="mb-16 rounded-3xl overflow-hidden bg-surface-container relative h-[500px] flex items-center shadow-xl border border-outline-variant/10 group">
        <div className="absolute inset-0 w-full h-full">
          <img
            alt="Breeder Facility"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoEGHMNAfo7z65AsDLWgQ9kKEP3LSB3mPVHNSd9u3psMyWW59A1ud6uD_5EkioFKc22o0vbAOtjH7QesxOgiMSK46ACoaxjomYx55YUaGRkpqJVBXpEwGs-H5fDqnrnKBPBz4ILAgQI5BjnVsu_2aYk5CFJ75LTGbkItist0DzGgx7P8nbkSNqsYtFFaGJH4zNdybihjNBTH-ETvg81ILMzWtWxVABMUCrBNwtCE7jipwv_ekWpS6_N9l-1Pkoi9VDRgAL-q6lhW4"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
        </div>
        <div className="relative z-10 px-8 md:px-16 max-w-2xl text-white">
          <span className="bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-fixed px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-6 inline-block shadow-sm">Elite Partner Spotlight</span>
          <h2 className="font-headline text-5xl font-extrabold mb-4 tracking-tighter">Royal Crest Kennels</h2>
          <div className="flex items-center gap-2 mb-6 text-sm font-medium text-slate-300">
             <span className="material-symbols-outlined text-[16px]">location_on</span> Nuwara Eliya, Central Province
          </div>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed">
            Celebrating 15 years of ethical breeding. Specializing in high-performance companions with full clinical health tracking, SLVC verification, and lineage certification.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/breeders/profile" className="block text-center flex-1 md:flex-none bg-primary text-white border-2 border-primary px-8 py-3.5 rounded-xl font-bold transition-all hover:bg-primary/90 shadow-md">
               View Facility &amp; Litters
            </Link>
            <button className="bg-white/10 backdrop-blur-md text-white border-2 border-white/20 px-8 py-3.5 rounded-xl font-bold transition-all hover:bg-white/20">
               Read Their Story
            </button>
          </div>
        </div>
      </section>
      
      {/* SCAM Warning */}
      <section className="bg-tertiary-container/30 border border-tertiary/20 p-8 rounded-3xl flex flex-col md:flex-row gap-8 items-center max-w-4xl mx-auto">
         <div className="w-16 h-16 bg-tertiary text-white rounded-full flex items-center justify-center shrink-0 shadow-lg">
           <span className="material-symbols-outlined text-3xl">gpp_good</span>
         </div>
         <div>
            <h3 className="font-bold font-headline text-xl text-on-surface mb-2">PetZen Anti-Scam Protection</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-4">Never transfer money outside of the PetZen platform. All payments made through PetZen are held in a secure Escrow until you physically meet the pet and confirm their health status.</p>
            <Link href="/terms" className="text-tertiary font-bold text-sm hover:underline">Read our Buyer Protection Guarantee</Link>
         </div>
      </section>
    </div>
  );
}
