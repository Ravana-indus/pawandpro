import React from "react";
import Link from "next/link";

export default function OnboardingConfirmPage() {
  return (
    <div className="min-h-screen py-24 flex items-center justify-center p-6 bg-surface-container-lowest relative overflow-hidden">
       <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
       
       <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8 mx-auto">
             <span className="material-symbols-outlined text-4xl text-primary">mail</span>
          </div>
          <h1 className="text-4xl font-headline font-extrabold mb-4 tracking-tight text-on-surface">Verify Your Email</h1>
          <p className="text-on-surface-variant text-lg font-medium mb-10 leading-relaxed">
            We've sent a confirmation link to your email. Please verify your account to unlock full clinical core features.
          </p>
          
          <div className="space-y-4">
            <Link href="/login" className="block w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-primary/20 transition-all">
              Proceed to Login
            </Link>
            <Link href="/" className="block w-full py-4 text-on-surface-variant font-bold hover:text-primary transition-colors">
              Back to Home
            </Link>
          </div>
       </div>
    </div>
  );
}
