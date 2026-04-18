'use client'

import React, { use } from "react";
import Link from "next/link";
import { signUp } from "@/lib/actions/auth";

export default function SignupPage({ searchParams }: { searchParams: Promise<{ role?: string, error?: string }> }) {
  const params = use(searchParams);
  const role = params.role || 'PARENT';
  const error = params.error;

  return (
    <div className="min-h-screen pt-24 pb-32 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Ambient backgrounds */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[120px] -z-10 -translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 translate-x-1/3 translate-y-1/3"></div>

      <div className="flex flex-col md:flex-row-reverse bg-surface-container-lowest/80 backdrop-blur-3xl border border-outline-variant/30 rounded-[2.5rem] p-4 w-full max-w-5xl shadow-2xl relative overflow-hidden">
         {/* Right Side: Brand Visual */}
         <div className="hidden md:flex md:w-1/2 bg-surface-container relative rounded-[2rem] overflow-hidden p-12 flex-col justify-between">
            <img 
               src="https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?q=80&w=2574&auto=format&fit=crop" 
               className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-50"
               alt="Veterinarian with pet"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151C27]/90 via-[#151C27]/40 to-transparent"></div>
            
            <div className="relative z-10 flex items-center justify-end gap-2 text-white">
               <span className="font-bold tracking-tight">Paws&Pro</span>
               <span className="material-symbols-outlined text-[24px]">pets</span>
            </div>
            
            <div className="relative z-10">
               <span className="bg-white/20 text-white border border-white/30 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest inline-flex items-center gap-1 mb-4 backdrop-blur-md">
                 <span className="material-symbols-outlined text-[14px]">shield</span> SLVC Certified
               </span>
               <h2 className="text-3xl font-headline font-bold text-white leading-tight mb-4 tracking-tighter">Enter a transparent, verified ecosystem for pet care.</h2>
            </div>
         </div>

         {/* Left Side: Signup Form */}
         <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Create Account</h1>
            <p className="text-on-surface-variant mb-8 text-lg font-medium">Join PetZen as a <span className="text-primary font-bold">{role}</span> to manage health, shop safely, and connect.</p>

            {error && (
              <div className="bg-error-container text-error px-4 py-3 rounded-xl mb-6 text-sm font-bold border border-error/20">
                {error}
              </div>
            )}

            <button className="w-full bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-on-surface font-bold py-3.5 rounded-xl transition-all flex justify-center items-center gap-3 mb-6 shadow-sm">
               <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
               Sign up with Google
            </button>

            <div className="flex items-center gap-4 mb-6">
               <div className="flex-1 h-px bg-outline-variant/20"></div>
               <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">or sign up with email</span>
               <div className="flex-1 h-px bg-outline-variant/20"></div>
            </div>

            <form action={signUp} className="space-y-5">
               <input type="hidden" name="role" value={role} />
               <div className="grid grid-cols-1 gap-4">
                  <div>
                     <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Full Name</label>
                     <input 
                        name="full_name"
                        type="text" 
                        required
                        placeholder="John Doe" 
                        className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                     />
                  </div>
               </div>
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
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Password</label>
                  <input 
                     name="password"
                     type="password" 
                     required
                     placeholder="Create a strong password" 
                     className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                  />
               </div>

               <p className="text-xs text-on-surface-variant mt-2 font-medium">By creating an account, you agree to our <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.</p>

               <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2 text-lg">
                 Create Secure Account <span className="material-symbols-outlined">person_add</span>
               </button>
            </form>

            <p className="text-center mt-8 text-on-surface-variant font-medium">
               Already have an account? <Link href="/login" className="font-bold text-primary hover:underline">Log in</Link>
            </p>
         </div>
      </div>
    </div>
  );
}
