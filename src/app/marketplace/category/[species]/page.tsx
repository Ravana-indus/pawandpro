import React from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/queries";

export default async function CategoryPage({ params }: { params: Promise<{ species: string }> }) {
  const { species: speciesSlug } = await params;
  const speciesName = speciesSlug === 'dogs' ? 'Dogs' : 
                      speciesSlug === 'cats' ? 'Cats' : 
                      speciesSlug === 'birds' ? 'Birds' : 
                      speciesSlug === 'fish' ? 'Fish' : 
                      speciesSlug === 'small-pets' ? 'Small Pets' : 
                      speciesSlug === 'reptiles' ? 'Reptiles' : speciesSlug;

  // Map plural slug to singular for DB query
  const dbSpecies = speciesSlug === 'dogs' ? 'Dog' : 
                   speciesSlug === 'cats' ? 'Cat' :
                   speciesSlug.replace(/s$/, '');

  const productsToDisplay = await getProducts({ species: dbSpecies });

  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Category Hero */}
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-12 mb-12 relative overflow-hidden flex items-center justify-between shadow-sm">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-primary font-bold text-sm mb-4">
             <Link href="/marketplace" className="hover:underline">Marketplace</Link>
             <span className="material-symbols-outlined text-[16px]">chevron_right</span>
             <span className="capitalize">{speciesName}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold mb-4 text-on-surface capitalize">
            Shop for {speciesName}
          </h1>
          <p className="text-on-surface-variant max-w-xl text-lg">
            Clinical products specifically formulated for the unique physiological needs of {speciesName.toLowerCase()}.
          </p>
        </div>
        <div className="hidden md:flex w-32 h-32 bg-primary/10 rounded-full items-center justify-center relative z-10 shrink-0">
           <span className="material-symbols-outlined text-6xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
             {speciesSlug === 'dogs' || speciesSlug === 'cats' || speciesSlug === 'small-pets' ? 'pets' : 
              speciesSlug === 'birds' ? 'flutter_dash' : 
              speciesSlug === 'fish' ? 'phishing' : 'grass'}
           </span>
        </div>
        {/* Background decorative element */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0 space-y-8">
          <div>
             <h3 className="font-bold font-headline text-lg mb-4 text-on-surface">Sub-Categories</h3>
             <div className="space-y-3">
                {["Food & Diet", "Treats & Chews", "Health & Wellness", "Toys", "Bowls & Feeders", "Beds & Furniture"].map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" />
                    <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">{cat}</span>
                  </label>
                ))}
             </div>
          </div>
          
          <hr className="border-outline-variant/20" />

          <div>
             <h3 className="font-bold font-headline text-lg mb-4 text-on-surface">Lifestage</h3>
             <div className="space-y-3">
                {["Puppy/Kitten", "Adult", "Senior"].map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" />
                    <span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">{cat}</span>
                  </label>
                ))}
             </div>
          </div>
        </aside>

        {/* Main Product Grid */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm font-bold text-on-surface-variant">{productsToDisplay.length} Products Found</p>
            <select className="bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-4 py-2 text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm">
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {productsToDisplay.map(product => (
               <ProductCard key={product.id} product={product} />
             ))}
          </div>
        </main>
      </div>
    </div>
  );
}
