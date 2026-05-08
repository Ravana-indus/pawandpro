import React from "react";
import Link from "next/link";
import { getProducts } from "@/lib/queries";

export default async function SubscribeBoxPage() {
  const products = await getProducts({ limit: 6 });
  const baseProduct = products.find(p => p.category === 'Food') || products[0];
  const supplementProduct = products.find(p => p.category === 'Supplements') || products[1];
  
  // Guard against no products
  if (!baseProduct || !supplementProduct) {
     return (
        <div className="pt-24 pb-32 px-6 text-center">
           <h1 className="text-3xl font-bold mb-4">Subscription Service</h1>
           <p className="mb-8">We are currently updating our curated boxes. Please check back later.</p>
           <Link href="/marketplace" className="bg-primary text-white px-8 py-3 rounded-xl font-bold">Browse Marketplace</Link>
        </div>
     );
  }

  // Calculation (simplified)
  const monthlyTotal = baseProduct.price + supplementProduct.price;
  const discountedTotal = monthlyTotal * 0.85; // 15% discount

  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
         <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">Curated Subscription Box</span>
         <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter mb-6 text-on-surface">Build Your Box</h1>
         <p className="text-xl text-on-surface-variant max-w-2xl mx-auto">Design the perfect monthly wellness box for your pet, saving up to 15% on premium clinical essentials and getting free island-wide delivery.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-8 space-y-8">
           <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 lg:p-8 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
             <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-primary shadow-lg text-white rounded-full flex items-center justify-center font-bold font-headline text-lg z-10 shrink-0">1</div>
                <h2 className="text-3xl font-bold font-headline text-on-surface">Select Base Nutrition</h2>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="border-2 border-primary bg-primary/5 rounded-2xl p-4 cursor-pointer flex gap-4 items-center group transition-colors relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-bl-lg z-10">Selected</div>
                  <input type="radio" name="base" className="w-5 h-5 text-primary focus:ring-primary shrink-0" defaultChecked />
                  <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 shadow-sm p-1">
                     <img src={baseProduct.image_url || "/placeholder.png"} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface line-clamp-1">{baseProduct.name}</h4>
                    <p className="text-xs text-on-surface-variant mb-1">{baseProduct.specs?.weight || "12kg"} • {baseProduct.brand || "Clinical Core"}</p>
                    <p className="text-sm text-primary font-black">Rs. {baseProduct.price.toLocaleString()} / mo</p>
                  </div>
                </label>
                
                <label className="border border-outline-variant/30 bg-surface-container-lowest rounded-2xl p-4 cursor-pointer flex gap-4 items-center hover:bg-surface-container-low transition-colors group">
                  <input type="radio" name="base" className="w-5 h-5 text-primary focus:ring-primary shrink-0" />
                  <div className="w-16 h-16 bg-white border border-outline-variant/10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-slate-300">
                     <span className="material-symbols-outlined text-3xl">pets</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface line-clamp-1">Hypoallergenic Chicken</h4>
                    <p className="text-xs text-on-surface-variant mb-1">12kg • Clinical Core</p>
                    <p className="text-sm text-on-surface-variant font-black">Rs. 23,500 / mo</p>
                  </div>
                </label>
             </div>
           </section>

           <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 lg:p-8 shadow-sm">
             <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-surface-container-highest text-on-surface rounded-full flex items-center justify-center font-bold font-headline text-lg shrink-0">2</div>
                <h2 className="text-3xl font-bold font-headline text-on-surface">Add Supplements</h2>
             </div>
             <p className="text-on-surface-variant mb-8 ml-14">Enhance your box with vet-recommended supplements. Box subscribers get an extra 5% off add-ons.</p>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-0 lg:ml-14">
                <label className="border-2 border-primary bg-primary/5 rounded-2xl p-4 cursor-pointer flex gap-4 items-center group">
                  <div className="absolute top-0 right-0 bg-primary/20 text-primary text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-bl-lg rounded-tr-lg z-10">+ 1 Selected</div>
                  <input type="checkbox" className="w-5 h-5 text-primary focus:ring-primary rounded shrink-0" defaultChecked />
                  <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 shadow-sm p-1">
                     <img src={supplementProduct.image_url || "/placeholder.png"} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface line-clamp-1">{supplementProduct.name}</h4>
                    <p className="text-sm text-primary font-black">+ Rs. {supplementProduct.price.toLocaleString()} / mo</p>
                  </div>
                </label>
                
                <label className="border border-outline-variant/30 bg-surface-container-lowest rounded-2xl p-4 cursor-pointer flex gap-4 items-center hover:bg-surface-container-low transition-colors group">
                   <input type="checkbox" className="w-5 h-5 text-primary focus:ring-primary rounded shrink-0" />
                   <div className="w-16 h-16 bg-white border border-outline-variant/10 rounded-xl overflow-hidden shrink-0 shadow-sm p-1 flex items-center justify-center">
                      <span className="material-symbols-outlined text-outline-variant">inventory_2</span>
                   </div>
                   <div>
                     <h4 className="font-bold text-on-surface line-clamp-1">ZenFlow Filters (3pk)</h4>
                     <p className="text-sm text-on-surface-variant font-black">+ Rs. 6,500 / mo</p>
                   </div>
                 </label>
             </div>
           </section>
           
           <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 lg:p-8 shadow-sm">
             <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-surface-container-highest text-on-surface rounded-full flex items-center justify-center font-bold font-headline text-lg shrink-0">3</div>
                <h2 className="text-3xl font-bold font-headline text-on-surface">Delivery Frequency</h2>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ml-0 lg:ml-14 mt-8">
                {['2 Weeks', '4 Weeks', '6 Weeks', '8 Weeks'].map((freq, i) => (
                  <label key={freq} className={`border border-outline-variant/30 rounded-2xl p-4 cursor-pointer flex flex-col items-center justify-center text-center transition-colors ${i === 1 ? 'border-primary bg-primary/5 text-primary' : 'bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant'} h-24`}>
                     <input type="radio" name="freq" className="sr-only" defaultChecked={i===1} />
                     <span className={`font-bold ${i===1 ? 'text-primary' : 'text-on-surface'}`}>{freq}</span>
                     {i === 1 && <span className="text-[10px] uppercase font-bold tracking-wider mt-1">Recommended</span>}
                  </label>
                ))}
             </div>
           </section>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-surface-container-lowest p-6 lg:p-8 rounded-3xl border border-outline-variant/20 shadow-xl sticky top-28">
            <h2 className="text-2xl font-bold mb-6 font-headline text-on-surface border-b border-outline-variant/20 pb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">inventory_2</span> Your Box
            </h2>
            
            <div className="space-y-5 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-on-surface line-clamp-1">{baseProduct.name}</h4>
                  <p className="text-xs text-on-surface-variant">Base Nutrition</p>
                </div>
                <span className="font-bold text-on-surface ml-4">Rs. {baseProduct.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-on-surface line-clamp-1">{supplementProduct.name}</h4>
                  <p className="text-xs text-on-surface-variant">Supplement Add-on</p>
                </div>
                <span className="font-bold text-on-surface ml-4">Rs. {supplementProduct.price.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="bg-surface-container-low p-4 rounded-xl mb-6 space-y-2 text-sm">
               <div className="flex justify-between text-on-surface-variant">
                 <span>Subtotal</span>
                 <span>Rs. {monthlyTotal.toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-primary font-bold">
                 <span>Box Discount (15%)</span>
                 <span>- Rs. {(monthlyTotal - discountedTotal).toLocaleString()}</span>
               </div>
               <div className="flex justify-between text-tertiary font-bold">
                 <span>Island-wide Delivery</span>
                 <span>Free</span>
               </div>
            </div>
            
            <div className="flex justify-between items-end mb-8 border-t border-outline-variant/20 pt-6">
              <div>
                <span className="block text-sm font-bold text-on-surface-variant mb-1">Monthly Total</span>
                <span className="text-xs text-outline font-medium">Billed every 4 weeks</span>
              </div>
              <span className="font-black text-3xl text-primary font-headline">Rs. {discountedTotal.toLocaleString()}</span>
            </div>
            
            <Link href="/checkout" className="block w-full bg-primary text-white font-bold py-4 rounded-xl text-center shadow-lg hover:bg-primary/90 hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-all text-lg flex items-center justify-center gap-2">
              Review Collection <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            
            <div className="flex items-start gap-3 mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
               <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
               <p className="text-xs text-on-surface-variant font-medium leading-relaxed">Cancel, pause, or modify your subscription at any time without penalties. Covered by PetZen Guarantee.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
