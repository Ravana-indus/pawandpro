import React from "react";
import Link from "next/link";

interface CheckoutFailurePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CheckoutFailurePage({
  searchParams
}: CheckoutFailurePageProps) {
  const resolvedSearchParams = await searchParams;
  const errorType = resolvedSearchParams.error_type as string;
  const errorMessage = resolvedSearchParams.error_message as string;
  return (
    <div className="min-h-screen pt-24 pb-32 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-error/10 rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-50"></div>
      
      <div className="bg-surface-container-lowest border border-error/20 rounded-[2.5rem] p-8 md:p-16 w-full max-w-2xl shadow-2xl relative">
         <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-error text-white rounded-full flex items-center justify-center border-8 border-error/20 shadow-lg shadow-error/30">
               <span className="material-symbols-outlined text-5xl">warning</span>
            </div>
         </div>

         <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tighter mb-4">Payment Failed</h1>
            <p className="text-lg text-on-surface-variant max-w-md mx-auto">We couldn't process your payment. No charges were made to your account. Please review your details and try again.</p>
         </div>

          <div className="bg-error/5 border border-error/20 rounded-2xl p-6 mb-10">
             <h3 className="font-bold text-error mb-2 text-sm uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">info</span> Error Details
             </h3>
             <p className="text-sm font-medium text-error flex justify-between items-center bg-white/50 px-4 py-3 rounded-xl border border-error/10">
                <span>{errorMessage || "Transaction declined by issuer."}</span>
                <span className="font-mono text-xs opacity-70">{errorType || "ERR_DECL_04"}</span>
             </p>
             {errorType === "MERCHANT_ERROR" && (
               <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-xl">
                 <p className="text-sm text-error font-medium">
                   <span className="material-symbols-outlined text-[16px] mr-1">business</span>
                   This appears to be a merchant configuration issue. Please contact the store administrator or PayHere support.
                 </p>
               </div>
             )}
          </div>

         <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/checkout" className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98] text-center flex items-center justify-center gap-2">
               <span className="material-symbols-outlined">refresh</span> Try Again
            </Link>
         </div>
         
         <div className="mt-8 text-center border-t border-outline-variant/20 pt-6">
            <p className="text-sm text-on-surface-variant font-medium">
               Need help? <Link href="/contact" className="text-primary hover:underline font-bold">Contact Support</Link>
            </p>
         </div>
      </div>
    </div>
  );
}
