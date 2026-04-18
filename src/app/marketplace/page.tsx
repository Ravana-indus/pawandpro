import React from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/queries";

export default async function MarketplacePage() {
  const products = await getProducts();


  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary-container p-12 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-fit mb-6">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              <span className="text-xs font-bold uppercase tracking-widest">Picked for Luna (Golden Retriever)</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight mb-4">
              Precision Nutrition for Clinical Health
            </h1>
            <p className="text-lg text-primary-fixed-dim font-medium mb-8">
              Based on Luna's recent vet checkup, we've curated medical-grade supplements and hypoallergenic kibble to support joint health.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-primary px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-surface transition-all">
                View Personal Shop
              </button>
              <button className="bg-primary-container/40 border border-white/30 backdrop-blur-md px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all">
                Refresh AI Picks
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 h-full w-1/2 opacity-20 pointer-events-none hidden md:block">
            <img
              className="object-cover h-full w-full"
              alt="Golden Retriever"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuApOCi17-QfCUd0590n72F7MQw74F2R3gMXndQhkQhuGB219c_7RDqj_DLuVQcNpgx-oblLQ1ITtKAhSnPge1h6D_TEg3DpZCcOgipw3v6bhnku2l4-oFBgbrRuwsVYjwh-hb2rv79uSXE0Le7bRluehmXx7Wnlh4qReUbT6t6h16uwEwJdKcn7Zfpt_d5TeAopwZEsnHBHaQ2SGsU2AXlaPU3KFWP9-n6hOx5seLxpsnaqTC8U4ODKw2tl9TWMIZvZhl3S_Lt3pdI"
            />
          </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0 space-y-8">
          <div>
             <h3 className="font-bold font-headline text-lg mb-4 text-on-surface">Species</h3>
             <div className="space-y-2">
                {["Dogs", "Cats", "Birds", "Fish", "Small Pets", "Reptiles"].map((species) => (
                  <Link key={species} href={`/marketplace/category/${species.toLowerCase().replace(' ', '-')}`} className="flex items-center justify-between text-sm text-on-surface-variant hover:text-primary group">
                    <span className="font-medium">{species}</span>
                    <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                  </Link>
                ))}
             </div>
          </div>
          
          <hr className="border-outline-variant/20" />

          <div>
             <h3 className="font-bold font-headline text-lg mb-4 text-on-surface">Categories</h3>
             <div className="space-y-3">
                {["Food & Treats", "Supplements", "Toys & Enrichment", "Grooming", "Accessories"].map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary" />
                    <span className="text-sm font-medium text-on-surface-variant">{cat}</span>
                  </label>
                ))}
             </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Product Grid */}
          <section>
            <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-headline font-extrabold text-on-surface">Clinical Catalog</h2>
                <p className="text-on-surface-variant text-sm mt-1">Showing {products.length} products</p>
              </div>
              <div className="flex gap-2">
                <select className="bg-surface-container-low border border-outline-variant/40 rounded-lg px-4 py-2 text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                  <option>Sort by: Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {products.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-on-surface-variant font-medium">No products found. Please try again later.</p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
