import React from "react";
import { getCartContent } from "@/lib/actions/cart";
import { CartClient } from "./CartClient";

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  const cartItems = await getCartContent();

  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
         <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
           <span className="material-symbols-outlined">shopping_cart</span>
         </div>
         <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">Your Cart</h1>
      </div>

      <CartClient initialItems={cartItems} />
    </div>
  );
}
