import React from 'react';
import Link from 'next/link';
import { getProducts } from '@/lib/queries';

export default async function SubscribePage() {
  const products = await getProducts({ limit: 4, category: 'Food' });

  return (
    <div className="bg-surface-container-lowest min-h-screen pt-20 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-8">

        <header className="text-center mb-12">
          <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm inline-flex items-center gap-1.5 mb-6">
             <span className="material-symbols-outlined text-[14px]">autorenew</span> Auto-Ship Program
          </span>
          <h1 className="text-4xl md:text-6xl font-headline font-extrabold text-on-surface tracking-tight mb-4">Never run out of essentials.</h1>
          <p className="text-lg text-on-surface-variant font-medium max-w-2xl mx-auto">
            Subscribe to clinical-grade nutrition and repeat prescriptions. Save 10% on every order and get it delivered right to your door.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="bg-surface-container-low rounded-3xl p-6 text-center border border-outline-variant/20 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-primary">
                 <span className="material-symbols-outlined">discount</span>
              </div>
              <h3 className="font-bold text-on-surface mb-2">Save 10%</h3>
              <p className="text-sm text-on-surface-variant">On every subscribed item, forever.</p>
           </div>
           <div className="bg-surface-container-low rounded-3xl p-6 text-center border border-outline-variant/20 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-secondary">
                 <span className="material-symbols-outlined">calendar_month</span>
              </div>
              <h3 className="font-bold text-on-surface mb-2">Flexible Schedule</h3>
              <p className="text-sm text-on-surface-variant">Pause, skip, or cancel anytime.</p>
           </div>
           <div className="bg-surface-container-low rounded-3xl p-6 text-center border border-outline-variant/20 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-tertiary">
                 <span className="material-symbols-outlined">local_shipping</span>
              </div>
              <h3 className="font-bold text-on-surface mb-2">Free Delivery</h3>
              <p className="text-sm text-on-surface-variant">On all subscription orders over Rs. 5000.</p>
           </div>
        </div>

        <section className="bg-surface-container-low border border-outline-variant/20 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

          <h2 className="text-2xl font-headline font-bold text-on-surface mb-6 relative z-10">Step 1: Choose Base Nutrition</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 relative z-10">
            {products.slice(0,2).map(baseProduct => (
              <label key={baseProduct.id} className="cursor-pointer group">
                <div className="bg-surface-container-lowest border-2 border-transparent group-hover:border-primary/50 group-has-[:checked]:border-primary rounded-2xl p-4 flex gap-4 transition-all">
                   <input type="radio" name="base" className="w-5 h-5 text-primary focus:ring-primary mt-1" />
                   <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 shadow-sm border border-outline-variant/20">
                      <img src={baseProduct.details?.image || "/placeholder.png"} className="w-full h-full object-contain" alt="" />
                   </div>
                   <div>
                     <h4 className="font-bold text-on-surface line-clamp-1">{baseProduct.name}</h4>
                     <p className="text-primary font-bold text-sm mt-1">Rs. {(baseProduct.price * 0.9).toLocaleString()} <span className="text-on-surface-variant line-through text-xs font-normal">Rs. {baseProduct.price}</span></p>
                   </div>
                </div>
              </label>
            ))}
          </div>

          <h2 className="text-2xl font-headline font-bold text-on-surface mb-6 relative z-10">Step 2: Add Clinical Supplements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 relative z-10">
            {products.slice(2,4).map(suppProduct => (
              <label key={suppProduct.id} className="cursor-pointer group">
                <div className="bg-surface-container-lowest border-2 border-transparent group-hover:border-secondary/50 group-has-[:checked]:border-secondary rounded-2xl p-4 flex gap-4 transition-all">
                   <input type="checkbox" name="supplements" value={suppProduct.id} className="w-5 h-5 text-secondary focus:ring-secondary mt-1 rounded text-primary" />
                   <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 shadow-sm border border-outline-variant/20">
                      <img src={suppProduct.details?.image || "/placeholder.png"} className="w-full h-full object-contain" alt="" />
                   </div>
                   <div>
                     <h4 className="font-bold text-on-surface line-clamp-1">{suppProduct.name}</h4>
                     <p className="text-secondary font-bold text-sm mt-1">+ Rs. {(suppProduct.price * 0.9).toLocaleString()} <span className="text-xs font-normal opacity-70">/mo</span></p>
                   </div>
                </div>
              </label>
            ))}
          </div>

          <h2 className="text-2xl font-headline font-bold text-on-surface mb-6 relative z-10">Step 3: Delivery Frequency</h2>
          <div className="flex gap-4 mb-10 relative z-10">
             <label className="flex-1 cursor-pointer group">
                <div className="bg-surface-container-lowest border-2 border-transparent group-has-[:checked]:border-primary rounded-2xl p-4 text-center transition-all group-hover:bg-surface-container-highest">
                   <input type="radio" name="freq" defaultChecked className="hidden" />
                   <span className="block font-bold text-on-surface mb-1">Every 2 Weeks</span>
                   <span className="text-xs text-on-surface-variant">Most popular</span>
                </div>
             </label>
             <label className="flex-1 cursor-pointer group">
                <div className="bg-surface-container-lowest border-2 border-transparent group-has-[:checked]:border-primary rounded-2xl p-4 text-center transition-all group-hover:bg-surface-container-highest">
                   <input type="radio" name="freq" className="hidden" />
                   <span className="block font-bold text-on-surface mb-1">Monthly</span>
                   <span className="text-xs text-on-surface-variant">Standard</span>
                </div>
             </label>
          </div>

          <div className="pt-6 border-t border-outline-variant/20 flex items-center justify-between relative z-10">
             <div>
                <p className="text-sm text-on-surface-variant font-bold uppercase tracking-wider mb-1">Estimated Total</p>
                <p className="text-3xl font-headline font-black text-on-surface">Rs. 18,500 <span className="text-sm font-medium text-on-surface-variant">/ delivery</span></p>
             </div>
             <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-95 transition-all text-lg">
                Activate Subscription
             </button>
          </div>
        </section>

      </div>
    </div>
  );
}
