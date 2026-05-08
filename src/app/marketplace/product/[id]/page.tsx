import React from "react";
import Link from "next/link";
import { getProductById, getProducts } from "@/lib/queries";
import { AddToCartButton } from "@/components/AddToCartButton";

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return <div className="pt-32 text-center text-4xl">Product not found</div>;
  }

  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center gap-2 text-sm text-on-surface-variant">
        <Link href="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-bold text-on-surface line-clamp-1">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-surface-container-lowest rounded-3xl border border-outline-variant/20 overflow-hidden relative flex items-center justify-center p-8 shadow-sm">
            <span className="absolute top-6 left-6 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm border border-tertiary/10 backdrop-blur-md">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              OFFICIAL AGENT ONLY
            </span>
            <img
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply transition-transform hover:scale-105 duration-500"
              src={product.details.image}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">{product.category} Formulation</span>
            <button className="text-on-surface hover:text-error hover:bg-error-container p-2 rounded-full transition-colors">
               <span className="material-symbols-outlined">favorite</span>
            </button>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight mb-2 text-on-surface">{product.name}</h1>
          <p className="text-lg text-on-surface-variant font-medium mb-6">By {product.brand}</p>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-end gap-2">
              <div className="text-4xl font-black text-primary">Rs. {product.price.toLocaleString()}</div>
              {product.details.originalPrice && (
                <div className="text-xl text-outline line-through mb-1">Rs. {product.details.originalPrice.toLocaleString()}</div>
              )}
            </div>
            <div className="hidden sm:block w-px h-10 bg-outline-variant/30"></div>
            <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-full text-sm font-bold text-on-surface">
              <span className="material-symbols-outlined text-amber-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              {product.details.rating.toFixed(1)} <span className="text-on-surface-variant font-medium">({product.details.reviewsCount} Reviews)</span>
            </div>
          </div>
          
          <p className="text-on-surface-variant text-base mb-8 leading-relaxed">
            {product.details.description} Scientifically formulated for optimal clinical health. Contains high-grade hypoallergenic proteins and added joint support.
          </p>

          <div className="mt-auto space-y-6">
            <AddToCartButton productId={product.id} variant="add-to-cart" price={product.price} />
            
            {product.details.subscribeDiscountPercent && product.details.subscribeDiscountPercent > 0 && (
              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">sync</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">Subscribe & Save {product.details.subscribeDiscountPercent}%</p>
                    <p className="text-xs text-on-surface-variant">Cancel or skip anytime. Free delivery always.</p>
                  </div>
                </div>
                <AddToCartButton productId={product.id} variant="add-to-cart" price={product.price * (1 - product.details.subscribeDiscountPercent/100)} isSubscription={true} />
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 text-sm text-on-surface-variant bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
              <span className="font-medium">Free Delivery Options</span>
            </div>
            {product.expiryDate && (
              <div className="flex items-center gap-2">
                 <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                 <span className="font-medium">Exp: {product.expiryDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Detail Tabs */}
      <section className="mt-24">
        <div className="flex border-b border-outline-variant/20 mb-8 gap-8 overflow-x-auto hide-scrollbar">
          <button className="font-bold text-primary border-b-2 border-primary pb-4 whitespace-nowrap">Ingredients &amp; Analysis</button>
          <Link href={`/marketplace/product/${product.id}/feeding-guide`} className="font-semibold text-on-surface-variant hover:text-on-surface transition-colors pb-4 whitespace-nowrap">Feeding Guide</Link>
          <Link href={`/marketplace/product/${product.id}/reviews`} className="font-semibold text-on-surface-variant hover:text-on-surface transition-colors pb-4 whitespace-nowrap">Verified Reviews</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/20 shadow-sm">
            <h3 className="text-2xl font-black mb-6 font-headline text-on-surface">Nutritional Breakdown</h3>
            <ul className="space-y-4 text-on-surface-variant">
              <li className="flex justify-between border-b border-outline-variant/10 pb-3">
                 <span className="font-medium">Crude Protein (Min)</span> 
                 <span className="font-bold text-on-surface">26.0%</span>
              </li>
              <li className="flex justify-between border-b border-outline-variant/10 pb-3">
                 <span className="font-medium">Crude Fat (Min)</span> 
                 <span className="font-bold text-on-surface">14.0%</span>
              </li>
              <li className="flex justify-between border-b border-outline-variant/10 pb-3">
                 <span className="font-medium">Crude Fiber (Max)</span> 
                 <span className="font-bold text-on-surface">4.0%</span>
              </li>
              <li className="flex justify-between pb-1">
                 <span className="font-medium">Moisture (Max)</span> 
                 <span className="font-bold text-on-surface">10.0%</span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-surface-container to-surface-container-high p-8 rounded-2xl relative overflow-hidden flex flex-col justify-center">
             <div className="relative z-10">
               <h3 className="text-xl font-bold mb-3 font-headline flex items-center gap-2 text-on-surface">
                 <span className="material-symbols-outlined text-primary text-[24px]">document_scanner</span>
                 Ingredient Verification Scanner
               </h3>
               <p className="text-on-surface-variant mb-8 max-w-sm">Scan the barcode on any official PetZen product to verify authenticity and view deep clinical composition.</p>
               <Link href={`/marketplace/product/${product.id}/scanner`} className="inline-flex items-center justify-center bg-white text-primary font-bold px-6 py-3 rounded-xl hover:bg-surface-container-lowest transition-colors shadow-sm">
                 <span className="material-symbols-outlined mr-2">barcode_reader</span> Launch Scanner
               </Link>
             </div>
             <span className="material-symbols-outlined text-9xl absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 text-primary/5 pointer-events-none">qr_code_scanner</span>
          </div>
        </div>
      </section>

      {/* Cross-Sell Carousel */}
      <section className="mt-24">
         <h2 className="text-3xl font-headline font-extrabold text-on-surface mb-8">Clinical Pairs Well With</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(await getProducts({ limit: 4 })).map(p => (
              <Link href={`/marketplace/product/${p.id}`} key={p.id} className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20 hover:shadow-lg transition-shadow group block">
                 <div className="aspect-square bg-surface-container-low rounded-lg mb-4 overflow-hidden">
                    <img src={p.details.image} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" alt={p.name} />
                 </div>
                 <h4 className="font-bold text-on-surface line-clamp-1">{p.name}</h4>
                 <div className="flex justify-between items-center mt-2">
                    <span className="font-black text-primary">Rs. {p.price.toLocaleString()}</span>
                    <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">add_circle</span>
                 </div>
              </Link>
            ))}
         </div>
      </section>
    </div>
  );
}
