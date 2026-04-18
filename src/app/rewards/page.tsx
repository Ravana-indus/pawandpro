import React from "react";

export default function RewardsPage() {
  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto">
       <div className="bg-gradient-to-br from-primary-fixed-dim/90 to-[#1A1A1A] rounded-[40px] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden mb-16 border border-primary/20">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-tertiary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
             <div>
               <div className="flex items-center gap-2 mb-3">
                 <span className="material-symbols-outlined text-amber-400 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                 <span className="text-xs font-black uppercase tracking-widest text-amber-400 border border-amber-400/30 px-3 py-1 rounded-full bg-amber-400/10">Platinum Tier</span>
               </div>
               <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tight mb-4 text-white">PetZen Rewards</h1>
               <p className="text-white/80 text-lg md:text-xl font-medium max-w-lg">Your clinical loyalty, highly rewarded. Earn PZ Coins on every purchase and consultation.</p>
             </div>
             <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center min-w-[280px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <p className="text-xs font-black uppercase tracking-widest text-white/70 mb-3">Current Balance</p>
                <p className="text-6xl md:text-7xl font-black font-headline text-white drop-shadow-md">1,240 <span className="text-2xl font-bold text-white/50">pz</span></p>
                <div className="mt-4 pt-4 border-t border-white/10 text-sm font-medium text-white/80">
                  <span className="text-amber-400 font-bold">260 pz</span> away from Diamond Tier
                </div>
             </div>
          </div>
       </div>

       <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-headline font-extrabold text-on-surface">Redeem Offers</h2>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-8 shadow-sm flex flex-col h-full hover:shadow-lg transition-shadow group">
             <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform shadow-inner border border-primary/10">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
             </div>
             <h3 className="text-2xl font-bold mb-3 font-headline text-on-surface">Free Express delivery</h3>
             <p className="text-on-surface-variant font-medium mb-8 flex-1 leading-relaxed">Valid on any order over Rs. 15,000 in the clinical marketplace. Applies to Colombo 1-15.</p>
             <button className="w-full bg-surface-container-lowest border-2 border-primary text-primary font-bold py-3.5 rounded-xl hover:bg-primary hover:text-white transition-colors shadow-sm focus:ring-4 focus:ring-primary/20">
               Redeem for 500 pz
             </button>
          </div>
          
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-8 shadow-sm flex flex-col h-full hover:shadow-lg transition-shadow group">
             <div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center text-tertiary mb-6 group-hover:scale-110 transition-transform shadow-inner border border-tertiary/10">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>vaccines</span>
             </div>
             <h3 className="text-2xl font-bold mb-3 font-headline text-on-surface">15% Off Teleconsult</h3>
             <p className="text-on-surface-variant font-medium mb-8 flex-1 leading-relaxed">Direct discount applied automatically to any active teleconsultation session with an SLVC specialist.</p>
             <button className="w-full bg-surface-container-lowest border-2 border-tertiary text-tertiary font-bold py-3.5 rounded-xl hover:bg-tertiary hover:text-white transition-colors shadow-sm focus:ring-4 focus:ring-tertiary/20">
               Redeem for 800 pz
             </button>
          </div>
          
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-8 shadow-sm flex flex-col h-full hover:shadow-lg transition-shadow group">
             <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform shadow-inner border border-secondary/10">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>redeem</span>
             </div>
             <h3 className="text-2xl font-bold mb-3 font-headline text-on-surface">Rs. 3000 Store Credit</h3>
             <p className="text-on-surface-variant font-medium mb-8 flex-1 leading-relaxed">Direct currency discount applied cleanly at checkout on the Clinical Marketplace.</p>
             <button className="w-full bg-surface-container-lowest border-2 border-secondary text-secondary font-bold py-3.5 rounded-xl hover:bg-secondary hover:text-white transition-colors shadow-sm focus:ring-4 focus:ring-secondary/20">
               Redeem for 1000 pz
             </button>
          </div>
       </div>
    </div>
  );
}
