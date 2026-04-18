import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function CheckoutSuccessPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const resolvedSearchParams = await searchParams;
  const order_id_raw = resolvedSearchParams.order_id;
  const order_id = Array.isArray(order_id_raw) ? order_id_raw[0] : order_id_raw;

  if (!order_id) {
    return (
      <div className="pt-32 text-center">
        <h1 className="text-2xl font-bold">Order ID missing</h1>
        <Link href="/marketplace" className="text-primary hover:underline">Return to Marketplace</Link>
      </div>
    );
  }
  
  const supabase = await createClient();
  
  // Fetch real order data
  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*, product:products(*), pet_listing:pet_listings(*))')
    .eq('id', order_id)
    .single();

  if (!order) {
    return (
      <div className="pt-32 text-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <Link href="/marketplace" className="text-primary hover:underline">Return to Marketplace</Link>
      </div>
    );
  }

  const firstItem = order.order_items[0];
  const displayImage = firstItem.product?.details?.image || firstItem.pet_listing?.image_url;
  const displayName = firstItem.product?.name || firstItem.pet_listing?.name;

  return (
    <div className="pt-24 pb-32 px-6 max-w-4xl mx-auto overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-70"></div>
      
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[2.5rem] p-8 md:p-16 shadow-2xl relative">
         <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center border-8 border-primary/20 shadow-lg shadow-primary/30 relative">
               <span className="material-symbols-outlined text-5xl">check</span>
               <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-[ping_2s_ease-out_infinite]"></div>
            </div>
         </div>

         <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tighter mb-4">Payment Successful!</h1>
            <p className="text-lg text-on-surface-variant max-w-lg mx-auto">
              Your clinical order <span className="font-bold text-on-surface">#{order.id.slice(0,8).toUpperCase()}</span> has been confirmed.
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
               <h3 className="font-bold font-headline text-lg mb-4 flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary">local_shipping</span> Delivery Details
               </h3>
               <p className="text-sm text-on-surface-variant font-medium mb-1">Estimated Delivery</p>
               <p className="font-bold text-on-surface mb-4 lg:text-lg">Within 24-48 Hours</p>
               
               <p className="text-sm text-on-surface-variant font-medium mb-1">Order Status</p>
               <div className="flex items-center gap-2">
                 <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                 <p className="font-bold text-success text-sm uppercase tracking-wider">{order.status}</p>
               </div>
            </div>
            
            <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
               <h3 className="font-bold font-headline text-lg mb-4 flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary">receipt_long</span> Order Summary
               </h3>
               <div className="space-y-4 mb-4 max-h-40 overflow-y-auto">
                 {order.order_items.map((item: any, idx: number) => (
                   <div key={idx} className="flex items-center gap-4 border-b border-outline-variant/10 pb-2">
                      <img src={item.product?.details?.image || item.pet_listing?.image_url} className="w-10 h-10 rounded object-contain mix-blend-multiply bg-white" />
                      <div className="flex-1">
                         <p className="text-sm font-bold text-on-surface line-clamp-1">{item.product?.name || item.pet_listing?.name}</p>
                         <p className="text-xs text-on-surface-variant">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-sm text-on-surface">Rs. {Number(item.price_at_purchase).toLocaleString()}</span>
                   </div>
                 ))}
               </div>
               
               <div className="space-y-2 text-sm pt-2">
                 <div className="flex justify-between font-bold text-on-surface pt-2 border-t border-outline-variant/10 text-base">
                    <span>Total Paid</span>
                    <span>Rs. {Number(order.total_amount).toLocaleString()}</span>
                 </div>
               </div>
            </div>
         </div>

         <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/orders" className="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-transform active:scale-[0.98] text-center flex items-center justify-center gap-2">
               <span className="material-symbols-outlined">analytics</span> View Orders
            </Link>
            <Link href="/marketplace" className="bg-surface-container-low hover:bg-surface-container text-on-surface font-bold py-4 px-8 rounded-xl border border-outline-variant/30 transition-colors text-center">
               Continue Shopping
            </Link>
         </div>
      </div>
    </div>
  );
}
