import React from "react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-4xl mx-auto flex flex-col justify-center">
       <div className="text-center mb-16">
          <span className="font-label text-sm uppercase tracking-widest text-primary font-bold mb-2 block">We're Here to Help</span>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold mb-4 text-on-surface tracking-tight">Contact Support</h1>
          <p className="text-xl text-on-surface-variant font-medium">Our clinical concierge team is available 24/7 for urgent inquiries.</p>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm text-center">
             <span className="material-symbols-outlined text-primary text-3xl mb-2">call</span>
             <h3 className="font-bold mb-1">Emergency Hotline</h3>
             <p className="text-sm text-on-surface-variant font-medium">011 200 4000</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm text-center">
             <span className="material-symbols-outlined text-secondary text-3xl mb-2">mail</span>
             <h3 className="font-bold mb-1">General Support</h3>
             <p className="text-sm text-on-surface-variant font-medium">support@petzen.lk</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm text-center">
             <span className="material-symbols-outlined text-tertiary text-3xl mb-2">location_on</span>
             <h3 className="font-bold mb-1">HQ Office</h3>
             <p className="text-sm text-on-surface-variant font-medium">Colombo 05, Sri Lanka</p>
          </div>
       </div>
       
       <div className="bg-surface-container-lowest p-8 md:p-12 rounded-3xl border border-outline-variant/20 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none -z-10"></div>
          <h2 className="text-2xl font-bold font-headline mb-6 text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">chat</span> Drop us a message
          </h2>
          <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Your Name</label>
                 <input type="text" className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3.5 focus:border-primary outline-none transition-all" placeholder="John Doe" />
               </div>
               <div>
                 <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Email Address</label>
                 <input type="email" className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3.5 focus:border-primary outline-none transition-all" placeholder="john@example.com" />
               </div>
             </div>
             <div>
               <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Category</label>
               <select className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3.5 focus:border-primary outline-none transition-all appearance-none font-medium">
                 <option>Marketplace Inquiry</option>
                 <option>Veterinary Teleconsultation Issue</option>
                 <option>Breeder Verification Process</option>
                 <option>Other / Tech Support</option>
               </select>
             </div>
             <div>
               <label className="block text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Message</label>
               <textarea className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-4 h-32 resize-none focus:border-primary outline-none transition-all" placeholder="Explain how we can help..."></textarea>
             </div>
             <button className="w-full bg-primary text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-primary/90 hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2">
               <span className="material-symbols-outlined text-[20px]">send</span> Send Message
             </button>
          </div>
       </div>
    </div>
  );
}
