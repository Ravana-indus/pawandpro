import React from "react";
import Link from "next/link";
import { getProductById } from "@/lib/queries";

export default async function ScannerPage({ params }: { params: Promise<{ id: string }> }) {
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
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-4xl mx-auto text-center flex flex-col h-[calc(100vh-100px)]">
       <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>document_scanner</span>
       </div>
       <h1 className="text-5xl font-headline font-extrabold mb-4 text-on-surface">Ingredient Scanner</h1>
       <p className="text-xl text-on-surface-variant mb-12 max-w-xl mx-auto">Point your camera at a PetZen verified product barcode to instantly view its clinical breakdown and SLVC authenticity.</p>
       
       <div className="flex-1 bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 shadow-sm relative overflow-hidden flex flex-col items-center justify-center group cursor-pointer max-h-[500px]">
          <div className="absolute inset-0 bg-slate-900/5 transition-colors group-hover:bg-slate-900/10 z-0"></div>
          
          <div className="border-4 border-dashed border-primary/50 w-72 h-48 rounded-2xl flex items-center justify-center relative z-10 overflow-hidden shadow-[0_0_50px_rgba(0,100,124,0.1)]">
             <div className="absolute top-0 w-full h-1 bg-primary shadow-[0_0_20px_rgba(0,100,124,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
             <p className="text-on-surface font-bold bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full">Tap to enable camera</p>
          </div>
          
          <p className="mt-8 text-sm font-medium text-on-surface-variant z-10 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">qr_code</span> Supports EAN and UPC formats
          </p>
       </div>
       
       <div className="mt-8">
         <Link href={`/marketplace/product/${product.id}`} className="inline-block bg-surface-container-high text-on-surface font-bold px-8 py-4 rounded-xl hover:bg-surface-dim transition-colors shadow-sm">
           Cancel Scanning
         </Link>
       </div>
       
       <style dangerouslySetInnerHTML={{__html: `
         @keyframes scan {
           0% { top: 0; }
           50% { top: calc(100% - 4px); shadow-[0_0_20px_rgba(0,100,124,1)]; }
           100% { top: 0; }
         }
       `}} />
    </div>
  );
}
