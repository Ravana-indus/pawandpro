import React from "react";

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-4xl mx-auto">
       <div className="text-center border-b border-outline-variant/10 pb-8 mb-12">
          <span className="material-symbols-outlined text-4xl text-primary mb-4 p-4 bg-primary/10 rounded-full">security</span>
          <h1 className="text-4xl md:text-5xl font-headline font-extrabold mb-4 text-on-surface tracking-tight">Privacy Policy</h1>
          <p className="text-on-surface-variant font-medium">Last Updated: October 2024</p>
       </div>
       
       <div className="bg-surface-container-lowest p-8 md:p-12 rounded-3xl border border-outline-variant/20 shadow-sm text-left prose prose-slate max-w-none">
          <p className="text-on-surface-variant leading-relaxed mb-6 font-medium text-lg">
            At PetZen.lk, we take your privacy and the security of your pet's clinical data very seriously. This policy outlines our practices regarding data collection, encryption, and medical confidentiality.
          </p>
          <h3 className="text-2xl font-bold font-headline text-on-surface mt-8 mb-4">1. Medical Data Security</h3>
          <p className="text-on-surface-variant leading-relaxed mb-6">
            All clinical records, teleconsultation notes, and prescription details are End-to-End Encrypted (E2EE) and stored securely within the SLVC-compliant integration layer. We do not sell or share medical data with third-party advertisers.
          </p>

          <h3 className="text-2xl font-bold font-headline text-on-surface mt-8 mb-4">2. Financial Information</h3>
          <p className="text-on-surface-variant leading-relaxed mb-6">
            PetZen utilizes bank-grade 256-bit SSL encryption for all marketplace transactions. We do not store full credit card details on our servers; payments are tokenized and processed via certified PCI-DSS payment gateways.
          </p>
          
          <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl mt-8">
             <h4 className="font-bold text-primary flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[18px]">contact_support</span> Questions about your data?
             </h4>
             <p className="text-sm font-medium text-on-surface">Contact our Data Protection Officer at <a href="mailto:privacy@petzen.lk" className="text-primary hover:underline">privacy@petzen.lk</a></p>
          </div>
       </div>
    </div>
  );
}
