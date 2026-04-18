import React from "react";
import Link from "next/link";

export default function PasswordResetPage() {
  return (
    <div className="min-h-screen pt-24 pb-32 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Ambient background matching login */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-70"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-tertiary/10 rounded-full blur-[80px] -z-10 mix-blend-multiply opacity-50"></div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 md:p-12 w-full max-w-md shadow-2xl relative">
        <div className="flex justify-center mb-8">
           <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center border border-primary/20">
             <span className="material-symbols-outlined text-3xl">lock_reset</span>
           </div>
        </div>

        <h1 className="text-3xl font-headline font-extrabold text-on-surface text-center mb-2 tracking-tight">Reset Password</h1>
        <p className="text-on-surface-variant text-center mb-8 text-sm">Enter your email address and we'll send you a link to reset your password securely.</p>

        <form className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              className="w-full bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
               defaultValue="john@example.com"
            />
          </div>

          <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-4 flex justify-center items-center gap-2">
            Send Reset Link <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-outline-variant/20 text-center">
           <Link href="/login" className="text-sm font-bold text-on-surface hover:text-primary transition-colors flex items-center justify-center gap-1">
             <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Login
           </Link>
        </div>

        {/* Security badge */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container text-outline rounded-full text-[10px] uppercase font-bold tracking-widest border border-outline-variant/20">
            <span className="material-symbols-outlined text-[14px]">lock</span> 256-bit Encryption
          </div>
        </div>
      </div>
    </div>
  );
}
