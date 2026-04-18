import React from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { PetListingCard } from "@/components/PetListingCard";
import { searchAll } from "@/lib/queries";

export default async function SearchResultsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q: query } = await searchParams;
  
  if (!query) {
    return (
      <div className="pt-32 text-center">
        <h1 className="text-2xl font-bold">No search query provided.</h1>
        <Link href="/" className="text-primary hover:underline mt-4 inline-block">Go back home</Link>
      </div>
    );
  }

  const { products, pets, vets } = await searchAll(query);

  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
      <div className="mb-10 text-center max-w-2xl mx-auto">
         <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-outline-variant/10">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant">search</span>
         </div>
         <h1 className="text-4xl md:text-5xl font-headline font-extrabold mb-4 text-on-surface tracking-tight">Search Results</h1>
         <p className="text-xl text-on-surface-variant font-medium">Found multiple matches across PetZen for <span className="font-bold text-primary">"{query}"</span></p>
      </div>

      <div className="space-y-16">
        {pets.length > 0 && (
           <section>
              <div className="flex items-center justify-between mb-8 border-b border-outline-variant/20 pb-4">
                 <h2 className="text-3xl font-headline font-bold text-on-surface flex items-center gap-3">
                   <span className="material-symbols-outlined text-primary text-[32px]">pets</span> 
                   Live Breeders Marketplace
                 </h2>
                 <Link href="/breeders" className="text-primary font-bold text-sm tracking-widest uppercase hover:underline">View All</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {pets.map(pet => (
                    <PetListingCard key={pet.id} pet={pet as any} />
                 ))}
              </div>
           </section>
        )}

        {products.length > 0 && (
           <section>
              <div className="flex items-center justify-between mb-8 border-b border-outline-variant/20 pb-4">
                 <h2 className="text-3xl font-headline font-bold text-on-surface flex items-center gap-3">
                   <span className="material-symbols-outlined text-secondary text-[32px]">shopping_bag</span> 
                   Clinical Marketplace
                 </h2>
                 <Link href="/marketplace" className="text-secondary font-bold text-sm tracking-widest uppercase hover:underline">Browse Catalog</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                 ))}
              </div>
           </section>
        )}

        {vets.length > 0 && (
           <section>
              <div className="flex items-center justify-between mb-8 border-b border-outline-variant/20 pb-4">
                 <h2 className="text-3xl font-headline font-bold text-on-surface flex items-center gap-3">
                   <span className="material-symbols-outlined text-tertiary text-[32px]">medical_services</span> 
                   Veterinary Specialists
                 </h2>
                 <Link href="/veterinary" className="text-tertiary font-bold text-sm tracking-widest uppercase hover:underline">View All Vets</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {vets.map(vet => (
                    <Link key={vet.id} href={`/veterinary/profile/${vet.id}`} className="bg-surface-container-low p-6 rounded-2xl hover:bg-surface-container transition-colors border border-outline-variant/10">
                       <div className="flex items-center gap-4">
                          <img src={vet.avatar_url || ''} className="w-16 h-16 rounded-full object-cover" alt={vet.full_name || ''} />
                          <div>
                             <h4 className="font-bold">{vet.full_name}</h4>
                             <p className="text-xs text-on-surface-variant">{(vet as any).details?.specialization}</p>
                          </div>
                       </div>
                    </Link>
                 ))}
              </div>
           </section>
        )}

        {pets.length === 0 && products.length === 0 && vets.length === 0 && (
          <div className="text-center py-20 bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant">
            <p className="text-on-surface-variant font-medium text-lg">No results found for your search.</p>
          </div>
        )}
      </div>
      
      {/* Search refinement prompt */}
      <div className="mt-16 bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-10 text-center shadow-sm max-w-3xl mx-auto">
         <h3 className="font-bold text-xl mb-4 font-headline">Didn't find what you were looking for?</h3>
         <div className="flex justify-center flex-wrap gap-3">
            <button className="bg-surface-container-high px-5 py-2.5 rounded-full font-bold text-sm hover:bg-surface-dim transition-colors text-on-surface">Try "Puppy Kibble"</button>
            <button className="bg-surface-container-high px-5 py-2.5 rounded-full font-bold text-sm hover:bg-surface-dim transition-colors text-on-surface">Try "Joint Supplements"</button>
            <button className="bg-surface-container-high px-5 py-2.5 rounded-full font-bold text-sm hover:bg-surface-dim transition-colors text-on-surface">Browse All Categories</button>
         </div>
      </div>
    </div>
  );
}
