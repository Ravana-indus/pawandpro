import React from "react";
import { createClient } from "@/lib/supabase/server";
import { getCartContent } from "@/lib/actions/cart";
import { getPetListingById } from "@/lib/queries";
import { CheckoutClient } from "./CheckoutClient";

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const resolvedSearchParams = await searchParams;
  const listing_id = resolvedSearchParams.listing_id as string;

  let items: any[] = [];
  let subtotal = 0;

  if (listing_id) {
    // Pet Listing Checkout
    const listingData = await getPetListingById(listing_id);
    if (listingData) {
      items = [{
        product: {
          name: `Pet Reservation: ${listingData.name}`,
          price: listingData.price,
          image: listingData.image_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&h=400&fit=crop",
          details: { description: `${listingData.breed} • ${listingData.age}` }
        },
        quantity: 1,
        isSubscription: false
      }];
      subtotal = Number(listingData.price);
    }
  } else {
    // Cart Checkout
    items = await getCartContent();
    subtotal = items.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  }

  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-6xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-headline font-extrabold mb-8 text-on-surface tracking-tight">
        Secure Checkout
      </h1>
      
      <CheckoutClient initialData={{ items, subtotal, listing_id }} />
    </div>
  );
}
