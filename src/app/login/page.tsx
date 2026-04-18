'use client'

import React, { use } from "react";
import Link from "next/link";
import { signIn } from "@/lib/actions/auth";

export default function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = use(searchParams);
  const error = params.error;

  return (
    <div className="min-h-screen pt-24 pb-32 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Ambient backgrounds */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3"></div>

      <div className="flex flex-col md:flex-row bg-surface-container-lowest/80 backdrop-blur-3xl border border-outline-variant/30 rounded-[2.5rem] p-4 w-full max-w-5xl shadow-2xl relative overflow-hidden">
         {/* Left Side: Brand Visual */}
         <div className="hidden md:flex md:w-1/2 bg-surface-container relative rounded-[2rem] overflow-hidden p-12 flex-col justify-between">
            <img 
               src="https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=2574&auto=format&fit=crop" 
               className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-50"
               alt="Dog and owner"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151C27]/90 via-[#151C27]/40 to-transparent"></div>
            
            <div className="relative z-10 flex items-center gap-2">
               <span className="material-symbols-outlined text-white text-[24px]">pets</span>
               <span className="text-white font-bold tracking-tight">Paws&Pro</span>
            </div>
            
            <div className="relative z-10">
               <div className="flex gap-1 mb-4 text-[#FDE170]">
                  {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
               </div>
               <h2 className="text-3xl font-headline font-bold text-white leading-tight mb-4 tracking-tighter">"The only platform I trust for my dog's clinical nutrition and records."</h2>
               <p className="text-white/70 font-medium">— Sarah W., Colombo 05</p>
            </div>
         </div>

         {/* Right Side: Login Form */}
         <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Welcome Back</h1>
            <p className="text-on-surface-variant mb-8 text-lg font-medium">Access your pet's clinical records and subscriptions.</p>

            {error && (
              <div className="bg-error-container text-error px-4 py-3 rounded-xl mb-6 text-sm font-bold border border-error/20">
                {error}
              </div>
            )}

            <button className="w-full bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-on-surface font-bold py-3.5 rounded-xl transition-all flex justify-center items-center gap-3 mb-6 shadow-sm">
               <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
               Continue with Google
            </button>

            <div className="flex items-center gap-4 mb-6">
               <div className="flex-1 h-px bg-outline-variant/20"></div>
               <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">or login with email</span>
               <div className="flex-1 h-px bg-outline-variant/20"></div>
            </div>

            <form action={signIn} className="space-y-5">
               <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Email Address</label>
                  <input 
                     name="email"
                     type="email" 
                     required
                     placeholder="name@example.com" 
                     className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                  />
               </div>
               <div>
                  <div className="flex justify-between items-end mb-2">
                     <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">Password</label>
                     <Link href="/login/reset" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
                  </div>
                  <input 
                     name="password"
                     type="password" 
                     required
                     placeholder="••••••••" 
                     className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                  />
               </div>

               <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 text-lg">
                 Secure Login <span className="material-symbols-outlined">lock_open</span>
               </button>
            </form>

            <p className="text-center mt-8 text-on-surface-variant font-medium">
               Don't have an account? <Link href="/onboarding" className="font-bold text-primary hover:underline">Create Account</Link>
            </p>
         </div>
      </div>
    </div>
  );
}
