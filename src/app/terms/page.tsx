import React from "react";

export default function TermsPage() {
  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-4xl mx-auto">
       <div className="text-center border-b border-outline-variant/10 pb-8 mb-12">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4 p-4 bg-surface-container-high rounded-full">gavel</span>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold mb-4 text-on-surface tracking-tight">Terms of Service</h1>
          <p className="text-on-surface-variant font-medium">Effective Date: November 1, 2024</p>
       </div>
       
       <div className="bg-surface-container-lowest p-8 md:p-12 rounded-3xl border border-outline-variant/20 shadow-sm text-left">
          <p className="text-on-surface-variant leading-relaxed mb-8 font-medium text-lg">
            Welcome to PetZen.lk. By accessing our platform, participating in the marketplace, or utilizing teleconsultation services, you agree to comply with the following clinical and commercial terms.
          </p>
          
          <div className="space-y-8">
             <div>
                <h3 className="text-2xl font-bold font-headline text-on-surface mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-sm">1</span> 
                  Veterinary Teleconsultation Disclaimer
                </h3>
                <p className="text-on-surface-variant leading-relaxed pl-10">
                  Teleconsultations provided via PetZen are not a replacement for emergency physical care. If your pet is experiencing a severe medical emergency (e.g., loss of consciousness, severe bleeding), immediately visit a 24/7 clinic. SLVC certified doctors on our platform operate independently.
                </p>
             </div>
             
             <div>
                <h3 className="text-2xl font-bold font-headline text-on-surface mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-sm">2</span> 
                  Ethical Breeder Policy
                </h3>
                <p className="text-on-surface-variant leading-relaxed pl-10">
                  All breeders listed on the PetZen marketplace must pass our strict Ethical Certification process. PetZen holds zero tolerance for puppy mills or non-compliant breeding practices. Escrow payments for reservations are refundable if genetic anomalies are discovered within 14 days.
                </p>
             </div>
             
             <div>
                <h3 className="text-2xl font-bold font-headline text-on-surface mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-sm">3</span> 
                  Prescription Fulfillment
                </h3>
                <p className="text-on-surface-variant leading-relaxed pl-10">
                  Clinical medications can only be dispatched upon manual verification of a valid prescription signed by an SLVC registered veterinarian. Fraudulent prescription uploads may result in account termination.
                </p>
             </div>
          </div>
       </div>
    </div>
  );
}
