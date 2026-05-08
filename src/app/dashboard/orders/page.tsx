import React from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function OrderHistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        product:products (*),
        pet_listing:pet_listings (*)
      )
    `)
    .eq('buyer_id', user?.id)
    .order('created_at', { ascending: false });

  const mappedOrders = orders?.map(order => ({
    id: order.id.slice(0, 8).toUpperCase(),
    status: order.status,
    date: new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    total: order.total_amount,
    items: order.order_items.map((item: any) => {
       if (item.pet_listing) {
          return {
             product: {
               name: `Pet Reservation: ${item.pet_listing.name}`,
               brand: item.pet_listing.breed,
               image: item.pet_listing.image_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&h=400&fit=crop",
               subscribeDiscountPercent: 0
             },
             quantity: 1,
             productId: item.pet_listing_id
          }
       }
       return {
          product: {
            name: item.product?.name || "Unknown Product",
            brand: item.product?.brand || "Brand",
            image: item.product?.details?.image || "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=400&fit=crop",
            subscribeDiscountPercent: 0
          },
          quantity: item.quantity,
          productId: item.product_id
       }
    })
  })) || [];

  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
      <DashboardSidebar />

      <main className="flex-1">
        <div className="mb-8">
           <span className="font-label text-sm uppercase tracking-widest text-primary font-bold mb-1 block">Purchase Records</span>
           <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface">Order History</h1>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
           {['All Orders', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((filter, i) => (
             <button key={filter} className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap shrink-0 ${i === 0 ? 'bg-surface-container-highest text-on-surface border border-outline-variant/50 shadow-sm' : 'bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface-variant'}`}>
               {filter}
             </button>
           ))}
        </div>
        
        <div className="space-y-6">
          {mappedOrders.length === 0 ? (
            <div className="text-center py-24 bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant/30 flex flex-col items-center">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">receipt_long</span>
              <h3 className="font-headline font-bold text-xl text-on-surface mb-2">No orders yet</h3>
              <p className="text-on-surface-variant mb-6">Your purchase history will appear here.</p>
              <Link href="/marketplace" className="bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-md">
                Browse Marketplace
              </Link>
            </div>
          ) : (
          mappedOrders.map(order => (
             <div key={order.id} className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow group">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-outline-variant/10">
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                      order.status === 'Delivered' ? 'bg-tertiary-container/30 text-tertiary border border-tertiary/20' :
                      order.status === 'Processing' ? 'bg-primary/10 text-primary border border-primary/20' :
                      order.status === 'In Transit' ? 'bg-secondary/10 text-secondary border border-secondary/20' :
                      'bg-surface-container-highest text-on-surface-variant'
                    }`}>
                      {order.status === 'Processing' && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>}
                      {order.status}
                    </span>
                    <span className="text-on-surface-variant text-sm font-bold tracking-wider">{order.id} • {order.date}</span>
                  </div>
                  <span className="font-black font-headline text-2xl text-on-surface">Rs. {order.total.toLocaleString()}</span>
               </div>
               
               <div className="space-y-6">
                  {order.items.map((item, idx) => (
                     <div key={idx} className="flex gap-6 items-center">
                       <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-outline-variant/20 shadow-sm p-1 relative">
                          {item.product.subscribeDiscountPercent > 0 && (
                             <span className="absolute top-0 right-0 bg-primary w-3 h-3 rounded-bl-lg"></span>
                          )}
                          <img src={item.product.image} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                       </div>
                       <div className="flex-1">
                         <h4 className="font-bold text-lg text-on-surface line-clamp-1">{item.product.name}</h4>
                         <p className="text-sm text-on-surface-variant pt-1 font-medium">Qty: {item.quantity} • {item.product.brand}</p>
                       </div>
                     </div>
                  ))}
               </div>
               
               <div className="mt-8 pt-6 border-t border-outline-variant/10 flex flex-col sm:flex-row items-center gap-4 lg:justify-end">
                   {order.status === 'Delivered' ? (
                      <Link href={`/marketplace/product/${order.items[0]?.productId || ''}`} className="w-full sm:w-auto text-center bg-surface-container-highest px-8 py-3 rounded-xl font-bold text-sm hover:bg-surface-dim transition-colors text-on-surface flex items-center justify-center gap-2 border border-outline-variant/20">
                         <span className="material-symbols-outlined text-[18px]">shopping_bag</span> Order Again
                      </Link>
                   ) : (
                      <Link href="/dashboard/orders/track" className="w-full sm:w-auto text-center bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center gap-2">
                         <span className="material-symbols-outlined text-[18px]">location_on</span> Track Shipment
                      </Link>
                   )}
                   <button className="w-full sm:w-auto text-center px-8 py-3 rounded-xl font-bold text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors">
                     View Invoice
                   </button>
               </div>
             </div>
          ))
          )}
        </div>
      </main>
    </div>
  );
}
