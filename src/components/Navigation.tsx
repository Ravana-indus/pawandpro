import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

import { SearchBar } from "./SearchBar";

export async function Navigation() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#F9F9FF]/80 dark:bg-[#151C27]/80 backdrop-blur-xl shadow-sm shadow-cyan-900/5 tonal-transition-surface-container-low">
      <div className="flex justify-between items-center px-8 h-20 w-full max-w-screen-2xl mx-auto font-['Plus_Jakarta_Sans'] tracking-tight">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-[#151C27] dark:text-[#F9F9FF]">
            Paws&amp;Pro
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/marketplace" className="text-[#151C27]/60 dark:text-[#F9F9FF]/60 hover:text-cyan-700 transition-all">
              Marketplace
            </Link>
            <Link href="/veterinary" className="text-[#151C27]/60 dark:text-[#F9F9FF]/60 hover:text-cyan-700 transition-all">
              Veterinary
            </Link>
            <Link href="/breeders" className="text-[#151C27]/60 dark:text-[#F9F9FF]/60 hover:text-cyan-700 transition-all">
              Breeding
            </Link>
            <Link href="/community" className="text-[#151C27]/60 dark:text-[#F9F9FF]/60 hover:text-cyan-700 transition-all">
              Community
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <SearchBar />
          <Link href="/cart" className="material-symbols-outlined text-on-surface-variant hover:bg-cyan-50/50 p-2 rounded-full transition-all">
            shopping_cart
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="material-symbols-outlined text-on-surface-variant hover:bg-cyan-50/50 p-2 rounded-full transition-all">
                dashboard
              </Link>
              <Link href="/dashboard/settings" className="h-10 w-10 rounded-full bg-surface-container overflow-hidden block border border-outline-variant/20">
                <img
                  alt="User avatar"
                  src={profile?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"}
                  className="w-full h-full object-cover"
                />
              </Link>
            </>
          ) : (
            <Link href="/onboarding" className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-primary/90 transition-all shadow-md">
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
