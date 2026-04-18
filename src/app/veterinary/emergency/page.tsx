import React from "react";
import Link from "next/link";

export default function EmergencyPage() {
  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-4xl mx-auto text-center h-[calc(100vh-80px)] flex flex-col justify-center">
       <div className="w-32 h-32 bg-error-container/30 border-4 border-error/50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <div className="absolute inset-0 rounded-full border-2 border-error animate-ping opacity-50"></div>
          <div className="absolute inset-[-20px] rounded-full border border-error/30 animate-ping opacity-30" style={{ animationDelay: '0.5s' }}></div>
          <span className="material-symbols-outlined text-[60px] text-error" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
       </div>
       
       <h1 className="text-5xl md:text-6xl font-headline font-extrabold mb-6 text-on-surface tracking-tight">Emergency Locator Active</h1>
       <p className="text-xl text-on-surface-variant mb-12 max-w-2xl mx-auto leading-relaxed">Connecting to your device's location to find the nearest 24/7 veterinary clinical facility and calculating fastest routes...</p>
       
       <div className="bg-surface-container-lowest p-8 md:p-12 rounded-3xl border border-outline-variant/20 shadow-xl max-w-2xl mx-auto w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-error/20 overflow-hidden">
             <div className="h-full bg-error w-1/3 animate-[scan_2s_ease-in-out_infinite]"></div>
          </div>
          <p className="text-on-surface-variant mb-8 text-lg">If your pet is experiencing difficulty breathing, severe bleeding, or loss of consciousness, proceed to the nearest clinic immediately or call <span className="font-bold text-error text-xl">119</span>.</p>
          <Link href="/veterinary/directory" className="inline-block bg-surface-container-highest text-on-surface font-bold px-8 py-4 rounded-xl hover:bg-surface-dim transition-colors shadow-sm">
            Cancel Search
          </Link>
       </div>
       
       <style dangerouslySetInnerHTML={{__html: `
         @keyframes scan {
           0% { transform: translateX(-100%); }
           100% { transform: translateX(300%); }
         }
       `}} />
    </div>
  );
}
