import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#F9F9FF] dark:bg-[#151C27] w-full py-12 border-t border-[#151C27]/10 dark:border-[#F9F9FF]/10">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 space-y-4 md:space-y-0 w-full max-w-screen-2xl mx-auto font-['Inter'] text-sm uppercase tracking-widest">
        <span className="text-[#151C27]/40 dark:text-[#F9F9FF]/40 text-center md:text-left">
          © 2026 PetZen.lk. The Clinical Concierge for Pets.
        </span>
        <div className="flex flex-wrap justify-center gap-8">
          <Link href="/privacy" className="text-[#151C27]/40 dark:text-[#F9F9FF]/40 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-[#151C27]/40 dark:text-[#F9F9FF]/40 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors">
            Terms of Service
          </Link>
          <Link href="/contact" className="text-[#151C27]/40 dark:text-[#F9F9FF]/40 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors">
            Contact Support
          </Link>
          <Link href="/vet-portal" className="text-[#151C27]/40 dark:text-[#F9F9FF]/40 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors">
            Vet Portal
          </Link>
          <Link href="/careers" className="text-[#151C27]/40 dark:text-[#F9F9FF]/40 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors">
            Careers
          </Link>
        </div>
      </div>
    </footer>
  );
}
