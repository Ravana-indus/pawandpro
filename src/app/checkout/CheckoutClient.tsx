'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PayHereCheckoutForm } from '@/components/PayHereCheckoutForm';


interface CheckoutClientProps {
  initialData: {
    items: any[];
    subtotal: number;
    listing_id?: string;
  };
}

export function CheckoutClient({ initialData }: CheckoutClientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payhereParams, setPayhereParams] = useState<any>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@pawsandpro.lk',
    phone: '+94 77 123 4567',
    address: '142 Havelock Rd, Apt 4B',
    city: 'Colombo 05'
  });

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setError(null);
    try {
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          pet_listing_id: initialData.listing_id
        })
      });

      if (response.status === 401) {
        router.push('/login?redirect=/checkout');
        return;
      }

      const params = await response.json();
      if (params.error) {
        // Check for PayHere merchant errors
        if (params.error.includes('merchant') || params.error.includes('business')) {
          router.push(`/checkout/failure?error_type=MERCHANT_ERROR&error_message=${encodeURIComponent(params.error)}`);
          return;
        }
        throw new Error(params.error);
      }

      setPayhereParams(params);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* PayHere Form (Hidden, auto-submits when params are set) */}
      {payhereParams && <PayHereCheckoutForm params={payhereParams} />}

      {error && (
        <div className="lg:col-span-3 bg-error/10 border border-error/30 text-error font-bold px-6 py-4 rounded-2xl flex items-center gap-3">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      <div className="lg:col-span-2 space-y-8">
        <section className="bg-surface-container-lowest p-8 md:p-10 rounded-3xl border border-outline-variant/20 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
          <h2 className="text-2xl font-bold mb-6 font-headline flex items-center gap-3 text-on-surface">
            <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">1</span> Delivery Details
          </h2>
          <div className="space-y-4 max-w-xl pl-0 md:pl-12">
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="First Name" 
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-on-surface" 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Last Name" 
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-on-surface" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-on-surface" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Street Address" 
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-on-surface" 
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="City" 
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-on-surface" 
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
              <input 
                type="tel" 
                placeholder="Mobile Number" 
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-on-surface" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest p-8 md:p-10 rounded-3xl border border-outline-variant/20 shadow-sm relative overflow-hidden group">
          <h2 className="text-2xl font-bold mb-6 font-headline flex items-center gap-3 text-on-surface">
            <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">2</span> Payment Method
          </h2>
          <div className="pl-0 md:pl-12">
             <div className="space-y-4 mb-6">
               <label className="flex items-center gap-4 p-5 border-2 border-primary bg-primary/5 rounded-2xl cursor-pointer shadow-sm relative overflow-hidden active:scale-[0.99] transition-transform">
                 <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full pointer-events-none"></div>
                 <input type="radio" name="payment" className="text-primary focus:ring-primary w-5 h-5 accent-primary" defaultChecked />
                 <span className="font-bold text-on-surface text-lg">PayHere Online Payment</span>
                 <div className="ml-auto flex gap-2">
                    <img src="https://www.payhere.lk/downloads/images/payhere_long_banner.png" alt="PayHere" className="h-6 object-contain" />
                 </div>
               </label>
             </div>
             <p className="text-sm text-on-surface-variant flex items-center gap-2">
               <span className="material-symbols-outlined text-[18px] text-primary">security</span>
               You will be redirected to PayHere securely to complete your payment.
             </p>
          </div>
        </section>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 shadow-sm sticky top-28">
          <h2 className="text-2xl font-bold mb-6 font-headline bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent w-fit">Order Summary</h2>
          
          <div className="space-y-4 mb-6 max-h-60 overflow-y-auto scrollbar-hide pr-2">
             {initialData.items.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                   <div className="w-16 h-16 bg-white rounded-xl border border-outline-variant/20 p-1 shrink-0 overflow-hidden shadow-sm relative">
                      {item.isSubscription && <div className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-bl-lg"></div>}
                      <img src={item.product?.details?.image || item.product?.image} className="w-full h-full object-contain" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-on-surface truncate">{item.product?.name}</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">Qty {item.quantity} {item.isSubscription ? "• Subscription" : ""}</p>
                      <p className="font-bold text-sm mt-1">Rs. {(item.product?.price || 0).toLocaleString()}</p>
                   </div>
                </div>
             ))}
          </div>
          
          <div className="border-t border-outline-variant/10 pt-6 space-y-3 mb-6 flex flex-col">
            <div className="flex justify-between text-sm text-on-surface-variant font-medium">
              <span>Subtotal</span>
              <span className="text-on-surface">Rs. {initialData.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-on-surface-variant font-medium">
              <span>Delivery</span>
              <span className="text-primary font-bold">Free</span>
            </div>
          </div>
          
          <div className="bg-surface-container p-4 border border-outline-variant/20 rounded-2xl mb-6 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
             <div className="flex justify-between items-end mb-1">
               <span className="font-bold text-lg text-on-surface">Total</span>
               <span className="font-black text-3xl font-headline text-primary tracking-tight">Rs. {initialData.subtotal.toLocaleString()}</span>
             </div>
          </div>
          
          <button 
            onClick={handlePay}
            disabled={loading}
            className="block w-full bg-primary text-white font-bold py-4 rounded-xl text-center shadow-lg hover:shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 active:scale-95 transition-all text-lg mb-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin whitespace-nowrap">sync</span>
            ) : (
              <span className="material-symbols-outlined text-[18px]">lock</span>
            )}
            {loading ? 'Processing...' : 'Pay Securely'}
          </button>
          
          <div className="flex justify-center gap-4 text-on-surface-variant opacity-60">
             <span className="material-symbols-outlined text-3xl">credit_card</span>
             <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
          </div>
        </div>
      </div>
    </div>
  );
}
