import React from "react";
import Link from "next/link";
import { getProductById } from "@/lib/queries";

export default async function FeedingGuidePage({ params }: { params: Promise<{ id: string }> }) {
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
        <span className="font-bold text-on-surface">Feeding Guide</span>
      </div>
      
      <div className="flex justify-between items-end mb-8">
         <h1 className="text-4xl font-headline font-extrabold text-on-surface">Feeding Guide</h1>
         <Link href={`/marketplace/product/${product.id}`} className="bg-surface-container-low border border-outline-variant/40 px-4 py-2 rounded-lg font-bold text-sm hover:bg-surface-container transition-colors hidden md:block">
           Back to Product
         </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
           <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">scale</span>
                <h2 className="text-2xl font-bold font-headline">Daily Recommendations</h2>
              </div>
              <p className="text-on-surface-variant mb-6 leading-relaxed text-lg">These are establishing guidelines. Your dog's needs may vary based on age, breed, environment, and activity level. Always consult your vet to determine the ideal weight.</p>
              
              <div className="overflow-x-auto rounded-xl border border-outline-variant/20">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-surface-container-low">
                      <tr>
                        <th className="py-4 px-6 font-bold text-on-surface border-b border-outline-variant/20">Adult Weight</th>
                        <th className="py-4 px-6 font-bold text-on-surface border-b border-outline-variant/20">Cups per Day*</th>
                        <th className="py-4 px-6 font-bold text-on-surface border-b border-outline-variant/20">Grams per Day</th>
                      </tr>
                    </thead>
                    <tbody className="text-on-surface-variant">
                      <tr className="border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors">
                        <td className="py-4 px-6 font-medium">Under 5 kg</td>
                        <td className="py-4 px-6">½ - 1</td>
                        <td className="py-4 px-6">50 - 100g</td>
                      </tr>
                      <tr className="border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors bg-surface-container-low/30">
                        <td className="py-4 px-6 font-medium">5 - 10 kg</td>
                        <td className="py-4 px-6">1 - 1½</td>
                        <td className="py-4 px-6">100 - 150g</td>
                      </tr>
                      <tr className="border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors">
                        <td className="py-4 px-6 font-medium">10 - 25 kg</td>
                        <td className="py-4 px-6">1½ - 2¾</td>
                        <td className="py-4 px-6">150 - 275g</td>
                      </tr>
                      <tr className="border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors bg-primary/5">
                        <td className="py-4 px-6 font-bold text-primary flex items-center gap-2">25 - 35 kg <span className="material-symbols-outlined text-[16px] text-primary">auto_awesome</span></td>
                        <td className="py-4 px-6 font-bold text-primary">2¾ - 3½</td>
                        <td className="py-4 px-6 font-bold text-primary">275 - 350g</td>
                      </tr>
                      <tr className="hover:bg-surface-container-lowest transition-colors">
                        <td className="py-4 px-6 font-medium">Over 35 kg</td>
                        <td className="py-4 px-6">3½ + ½ cup per 5kg</td>
                        <td className="py-4 px-6">Add 50g per 5kg</td>
                      </tr>
                    </tbody>
                 </table>
              </div>
              <p className="text-xs text-outline mt-4">*Standard 8oz measuring cup = approx 100g.</p>
           </div>

           <div className="bg-tertiary-container/20 rounded-3xl p-8 border border-tertiary/20 flex gap-6 items-start">
             <div className="w-12 h-12 bg-tertiary text-white rounded-full flex items-center justify-center shrink-0">
               <span className="material-symbols-outlined">water_drop</span>
             </div>
             <div>
               <h3 className="font-bold text-xl font-headline text-on-surface mb-2">Hydration is Key</h3>
               <p className="text-on-surface-variant leading-relaxed">Always provide plenty of fresh water when feeding dry kibble. Proper hydration is essential for kidney function and digestion.</p>
             </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm">
             <h3 className="font-bold text-lg font-headline mb-4 flex items-center gap-2">
               <span className="material-symbols-outlined text-primary">sync</span> Switch &amp; Transition
             </h3>
             <p className="text-sm text-on-surface-variant mb-4">Gradually transition your dog to Clinical Core over 7-10 days to prevent digestive upset.</p>
             <div className="space-y-3">
               <div className="flex justify-between items-center text-sm">
                 <span className="font-medium text-on-surface">Days 1-3</span>
                 <div className="flex gap-1 w-32 h-2 rounded-full overflow-hidden">
                   <div className="bg-primary/30 w-1/4"></div>
                   <div className="bg-outline-variant/30 w-3/4"></div>
                 </div>
                 <span className="font-bold">25%</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="font-medium text-on-surface">Days 4-6</span>
                 <div className="flex gap-1 w-32 h-2 rounded-full overflow-hidden">
                   <div className="bg-primary/60 w-2/4"></div>
                   <div className="bg-outline-variant/30 w-2/4"></div>
                 </div>
                 <span className="font-bold">50%</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="font-medium text-on-surface">Days 7-9</span>
                 <div className="flex gap-1 w-32 h-2 rounded-full overflow-hidden">
                   <div className="bg-primary hover:w-3/4 w-3/4"></div>
                   <div className="bg-outline-variant/30 w-1/4"></div>
                 </div>
                 <span className="font-bold">75%</span>
               </div>
               <div className="flex justify-between items-center text-sm text-primary">
                 <span className="font-black">Day 10+</span>
                 <div className="flex w-32 h-2 rounded-full overflow-hidden">
                   <div className="bg-primary w-full shadow-[0_0_10px_rgba(0,100,124,0.5)]"></div>
                 </div>
                 <span className="font-black text-primary">100%</span>
               </div>
             </div>
           </div>
           
           <div className="bg-surface-container-low p-6 rounded-3xl border border-primary/10">
             <h3 className="font-bold text-lg font-headline mb-4">Expert Advice</h3>
             <p className="text-sm text-on-surface-variant mb-6">Need help determining the perfect portion for your pet's specific requirements?</p>
             <Link href="/veterinary/directory" className="block text-center w-full bg-surface-container-highest text-primary font-bold py-3 rounded-xl hover:bg-primary hover:text-white transition-colors">
               Consult a Vet
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
