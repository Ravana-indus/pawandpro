'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCart, removeFromCart, updateQuantity } from '@/lib/cart';
import { useRouter } from 'next/navigation';

interface CartClientProps {
  initialItems: any[];
}

export function CartClient({ initialItems }: CartClientProps) {
  const [items, setItems] = useState(initialItems);
  const router = useRouter();

  const handleUpdateQuantity = (productId: string, quantity: number, isSubscription?: boolean) => {
    updateQuantity(productId, quantity, isSubscription);
    // Locally update for instant feedback
    setItems(prev => prev.map(item => 
      (item.productId === productId && item.isSubscription === isSubscription) 
        ? { ...item, quantity } 
        : item
    ).filter(item => item.quantity > 0));
    router.refresh();
  };

  const handleRemove = (productId: string, isSubscription?: boolean) => {
    removeFromCart(productId, isSubscription);
    setItems(prev => prev.filter(item => !(item.productId === productId && item.isSubscription === isSubscription)));
    router.refresh();
  };

  const subtotal = items.reduce((total, item) => {
    const price = item.isSubscription && item.product?.details?.subscribeDiscountPercent 
      ? item.product.price * (1 - item.product.details.subscribeDiscountPercent / 100) 
      : (item.product?.price || 0);
    return total + (price * item.quantity);
  }, 0);

  const totalSavings = items.reduce((total, item) => {
    if (item.isSubscription && item.product?.details?.subscribeDiscountPercent) {
      return total + (item.product.price * (item.product.details.subscribeDiscountPercent / 100) * item.quantity);
    }
    return total;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-16 shadow-sm text-center max-w-2xl mx-auto flex flex-col items-center">
        <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-6xl text-primary/30">add_shopping_cart</span>
        </div>
        <h2 className="text-3xl font-headline font-bold mb-4 text-on-surface">Your cart is empty</h2>
        <p className="text-xl text-on-surface-variant mb-8 max-w-md">Discover premium clinical nutrition and authenticated supplies for your pet.</p>
        <Link href="/marketplace" className="inline-flex bg-primary text-white font-bold py-4 px-10 rounded-xl hover:bg-primary/90 transition-colors shadow-md items-center gap-2 text-lg">
          Browse Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-6">
        {items.map((item, idx) => (
          <div key={`${item.productId}-${item.isSubscription}`} className="bg-surface-container-lowest border border-outline-variant/20 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row gap-6 relative overflow-hidden group">
            {item.isSubscription && item.product?.details?.subscribeDiscountPercent && (
              <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-sm z-10 flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px]">edit_calendar</span> 
                Subscribe & Save {item.product.details.subscribeDiscountPercent}%
              </div>
            )}
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-2xl overflow-hidden shrink-0 border border-outline-variant/20 p-2 shadow-inner">
              <img src={item.product?.details?.image || item.product?.image} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start gap-4 mb-2">
                <div>
                  <h3 className="font-bold text-lg text-on-surface leading-tight">{item.product?.name}</h3>
                  <p className="text-sm text-on-surface-variant font-medium mt-1">{item.product?.brand}</p>
                </div>
                <p className="font-black font-headline text-xl whitespace-nowrap text-on-surface">
                  Rs. {((item.isSubscription && item.product?.details?.subscribeDiscountPercent 
                    ? item.product.price * (1 - item.product.details.subscribeDiscountPercent / 100) 
                    : (item.product?.price || 0))).toLocaleString()}
                </p>
              </div>
              
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-4 bg-surface-container-highest rounded-full px-2 py-1 shadow-inner border border-outline-variant/20">
                  <button 
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1, item.isSubscription)}
                    className="w-8 h-8 rounded-full hover:bg-surface-container-low transition-colors flex items-center justify-center text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-[18px]">remove</span>
                  </button>
                  <span className="font-bold font-headline w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1, item.isSubscription)}
                    className="w-8 h-8 rounded-full hover:bg-surface-container-low transition-colors flex items-center justify-center text-on-surface-variant"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>
                <button 
                  onClick={() => handleRemove(item.productId, item.isSubscription)}
                  className="text-on-surface-variant hover:text-error transition-colors p-2 rounded-full hover:bg-error/10"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="lg:col-span-1">
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-8 sticky top-28 shadow-sm">
          <h2 className="text-2xl font-bold font-headline mb-6 text-on-surface">Order Summary</h2>
          <div className="space-y-4 text-on-surface-variant mb-6 font-medium">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-on-surface">Rs. {(subtotal + totalSavings).toLocaleString()}</span>
            </div>
            {totalSavings > 0 && (
              <div className="flex justify-between text-tertiary">
                <span>Savings</span>
                <span className="font-bold">- Rs. {totalSavings.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Delivery</span>
              <span className="font-bold text-on-surface">Free</span>
            </div>
          </div>
          
          <div className="border-t border-outline-variant/20 pt-6 mb-8">
            <div className="flex justify-between items-end mb-1">
              <span className="text-lg font-bold text-on-surface">Total</span>
              <span className="text-3xl font-black font-headline text-primary tracking-tight">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-right text-on-surface-variant">Inclusive of all local taxes</p>
          </div>
          
          <Link href="/checkout" className="block w-full bg-primary text-white text-center font-bold py-4 rounded-xl shadow-lg hover:shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 active:scale-95 transition-all text-lg flex justify-center items-center gap-2">
            Proceed to Checkout <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </Link>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-xs text-on-surface-variant bg-surface-container p-3 rounded-lg">
              <span className="material-symbols-outlined text-tertiary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              All items verified by Paws&Pro Quality Assurance
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
