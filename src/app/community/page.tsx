import React from "react";
import Link from "next/link";

export default function CommunityPage() {
  return (
    <div className="pt-24 pb-32 px-6 max-w-screen-2xl mx-auto overflow-hidden relative">
       {/* Background */}
       <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
       <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3"></div>

       <div className="text-center max-w-4xl mx-auto mb-24 relative z-10">
         <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">Coming Soon</span>
         <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-on-surface leading-tight tracking-tighter mb-6">
           The Social Hub for Pet Parents
         </h1>
         <p className="text-on-surface-variant text-xl leading-relaxed max-w-2xl mx-auto mb-10">
           Connect with local owners, join breed-specific groups, and access exclusive clinical workshops. A trusted community is the foundation of digital pet care.
         </p>
         
         <div className="bg-surface-container-lowest border border-outline-variant/20 p-2 pl-6 rounded-full max-w-lg mx-auto flex items-center shadow-lg group focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <span className="material-symbols-outlined text-outline">mail</span>
            <input type="email" placeholder="Enter your email to join the waitlist..." className="flex-1 bg-transparent border-none focus:outline-none px-4 text-on-surface" />
            <button className="bg-primary text-white font-bold px-6 py-3 rounded-full hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap">
               Notify Me
            </button>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {/* Feature 1 */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-8 shadow-sm group hover:shadow-lg transition-all duration-500 overflow-hidden relative">
             <div className="absolute -right-8 -top-8 text-primary/5 group-hover:text-primary/10 transition-colors">
                <span className="material-symbols-outlined text-[150px]">forum</span>
             </div>
             <div className="w-16 h-16 bg-surface-container-low text-primary rounded-2xl flex items-center justify-center mb-6 border border-outline-variant/10 group-hover:scale-110 transition-transform">
               <span className="material-symbols-outlined text-3xl">forum</span>
             </div>
             <h3 className="text-2xl font-bold font-headline text-on-surface mb-3 tracking-tight">Clinical Forums</h3>
             <p className="text-on-surface-variant leading-relaxed mb-6">Discuss nutrition, behavior, and wellness with verified owners and SLVC certified veterinarians.</p>
             <div className="flex -space-x-4">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoEGHMNAfo7z65AsDLWgQ9kKEP3LSB3mPVHNSd9u3psMyWW59A1ud6uD_5EkioFKc22o0vbAOtjH7QesxOgiMSK46ACoaxjomYx55YUaGRkpqJVBXpEwGs-H5fDqnrnKBPBz4ILAgQI5BjnVsu_2aYk5CFJ75LTGbkItist0DzGgx7P8nbkSNqsYtFFaGJH4zNdybihjNBTH-ETvg81ILMzWtWxVABMUCrBNwtCE7jipwv_ekWpS6_N9l-1Pkoi9VDRgAL-q6lhW4" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                <div className="w-10 h-10 rounded-full border-2 border-white bg-secondary/20 flex items-center justify-center text-secondary font-bold text-xs">Dr. M</div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-container-highest flex items-center justify-center text-on-surface-variant text-xs font-bold">+12k</div>
             </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-8 shadow-sm group hover:shadow-lg transition-all duration-500 overflow-hidden relative lg:-translate-y-8">
             <div className="absolute -right-8 -top-8 text-secondary/5 group-hover:text-secondary/10 transition-colors">
                <span className="material-symbols-outlined text-[150px]">groups</span>
             </div>
             <div className="w-16 h-16 bg-surface-container-low text-secondary rounded-2xl flex items-center justify-center mb-6 border border-outline-variant/10 group-hover:scale-110 transition-transform">
               <span className="material-symbols-outlined text-3xl">pets</span>
             </div>
             <h3 className="text-2xl font-bold font-headline text-on-surface mb-3 tracking-tight">Breed Clubs</h3>
             <p className="text-on-surface-variant leading-relaxed mb-6">Join specific collectives based on your pet's breed. Share milestones, organize meetups, and swap advice.</p>
             <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/10">
                <div className="flex items-center justify-between">
                   <span className="font-bold text-on-surface text-sm">Golden Retriever Club (SL)</span>
                   <span className="text-xs text-primary font-bold">2.4k Members</span>
                </div>
             </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-8 shadow-sm group hover:shadow-lg transition-all duration-500 overflow-hidden relative">
             <div className="absolute -right-8 -top-8 text-error/5 group-hover:text-error/10 transition-colors">
                <span className="material-symbols-outlined text-[150px]">campaign</span>
             </div>
             <div className="w-16 h-16 bg-surface-container-low text-error rounded-2xl flex items-center justify-center mb-6 border border-outline-variant/10 group-hover:scale-110 transition-transform">
               <span className="material-symbols-outlined text-3xl">location_searching</span>
             </div>
             <h3 className="text-2xl font-bold font-headline text-on-surface mb-3 tracking-tight">Lost & Found</h3>
             <p className="text-on-surface-variant leading-relaxed mb-6">An island-wide broadcast system linked to microchip datasets to help reunite lost pets with their families instantly.</p>
             <div className="flex items-center gap-2 text-xs font-bold text-error uppercase tracking-widest mt-auto bg-error/10 w-max px-3 py-1.5 rounded-full">
                <span className="material-symbols-outlined text-[14px]">notifications_active</span> Live Alerts
             </div>
          </div>
       </div>
    </div>
  );
}
