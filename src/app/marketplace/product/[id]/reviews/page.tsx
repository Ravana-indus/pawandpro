import React from "react";
import Link from "next/link";
import { getProductById } from "@/lib/queries";

export default async function ReviewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="pt-24 pb-32 px-6 text-center">
        <h1 className="text-2xl font-bold">Product not found.</h1>
        <Link href="/marketplace" className="text-primary hover:underline mt-4 inline-block">Back to Marketplace</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center gap-2 text-sm text-on-surface-variant">
        <Link href="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <Link href={`/marketplace/product/${product.id}`} className="hover:text-primary transition-colors line-clamp-1 max-w-[200px]">{product.name}</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="font-bold text-on-surface">Verified Reviews</span>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
         <h1 className="text-4xl font-headline font-extrabold text-on-surface">Verified Reviews</h1>
         <Link href={`/marketplace/product/${product.id}`} className="bg-surface-container-low border border-outline-variant/40 px-4 py-2 rounded-lg font-bold text-sm hover:bg-surface-container transition-colors">
           Back to Product
         </Link>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-8 shadow-sm space-y-8">
         <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16">
            <div className="flex items-center gap-4">
               <div className="text-6xl font-black text-primary">{(product.details?.rating ?? 0).toFixed(1)}</div>
               <div>
                 <div className="flex text-amber-500 mb-1">
                   {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: i <= Math.floor(product.details?.rating ?? 0) ? "'FILL' 1" : "'FILL' 0" }}>star</span>)}
                 </div>
                 <p className="text-sm text-on-surface-variant font-bold">Based on {product.details?.reviewsCount ?? 0} verified purchases</p>
               </div>
            </div>
            
            <div className="flex-1 w-full space-y-2">
               {[
                 { stars: 5, pct: 85 },
                 { stars: 4, pct: 10 },
                 { stars: 3, pct: 3 },
                 { stars: 2, pct: 2 },
                 { stars: 1, pct: 0 },
               ].map(row => (
                 <div key={row.stars} className="flex items-center gap-3 text-sm">
                    <span className="w-4 font-bold text-on-surface-variant">{row.stars}</span>
                    <span className="material-symbols-outlined text-amber-500 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                       <div className="h-full bg-amber-500 rounded-full" style={{ width: `${row.pct}%` }}></div>
                    </div>
                    <span className="w-8 text-right text-on-surface-variant font-medium">{row.pct}%</span>
                 </div>
               ))}
            </div>
         </div>
         
         <div className="border-t border-outline-variant/20 pt-8 space-y-6">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-lg font-headline">Latest Reviews</h3>
               <select className="bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-1.5 text-sm font-bold text-on-surface focus:outline-none cursor-pointer">
                 <option>Most Helpful</option>
                 <option>Recent</option>
                 <option>Highest Rated</option>
                 <option>Lowest Rated</option>
               </select>
            </div>

            {/* Review Card 1 */}
            <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-primary/20 text-primary font-bold rounded-full flex items-center justify-center text-lg">JD</div>
                   <div>
                     <p className="font-bold text-base text-on-surface">John Doe</p>
                     <div className="flex items-center gap-2 mt-0.5">
                       <span className="bg-tertiary-container/30 text-tertiary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                         <span className="material-symbols-outlined text-[12px]">verified</span> Verified Buyer
                       </span>
                       <span className="text-xs text-on-surface-variant">• 2 days ago</span>
                     </div>
                   </div>
                 </div>
                 <div className="flex text-amber-500">
                   {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
                 </div>
               </div>
               <h4 className="font-bold text-on-surface mb-2 tracking-tight">Incredible difference in joint mobility</h4>
               <p className="text-on-surface-variant text-base leading-relaxed mb-4">"Excellent kibble! My senior retriever's coat is much shinier and she has more energy. The subscription delivery to Kandy is super convenient and always on time."</p>
               <div className="flex items-center gap-4">
                 <button className="flex items-center gap-1 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors">
                   <span className="material-symbols-outlined text-[16px]">thumb_up</span> Helpful (12)
                 </button>
               </div>
            </div>

            {/* Review Card 2 */}
            <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-secondary/20 text-secondary font-bold rounded-full flex items-center justify-center text-lg">AS</div>
                   <div>
                     <p className="font-bold text-base text-on-surface">Amara S.</p>
                     <div className="flex items-center gap-2 mt-0.5">
                       <span className="bg-tertiary-container/30 text-tertiary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                         <span className="material-symbols-outlined text-[12px]">verified</span> Verified Buyer
                       </span>
                       <span className="text-xs text-on-surface-variant">• 1 week ago</span>
                     </div>
                   </div>
                 </div>
                 <div className="flex text-amber-500">
                   {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: i < 5 ? "'FILL' 1" : "'FILL' 0" }}>star</span>)}
                 </div>
               </div>
               <h4 className="font-bold text-on-surface mb-2 tracking-tight">Great quality, puppy loves it</h4>
               <p className="text-on-surface-variant text-base leading-relaxed mb-4">"Switched to this brand based on our vet's recommendation. No more stomach issues. Only giving 4 stars because the bag zip was slightly damaged during delivery to Colombo."</p>
            </div>
         </div>
      </div>
    </div>
  );
}
