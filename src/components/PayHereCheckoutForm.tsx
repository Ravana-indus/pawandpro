'use client';

import React, { useEffect, useRef } from 'react';

interface PayHereCheckoutFormProps {
  params: {
    merchant_id: string;
    return_url: string;
    cancel_url: string;
    notify_url: string;
    order_id: string;
    items: string;
    currency: string;
    amount: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    hash: string;
  };
  autoSubmit?: boolean;
}

export function PayHereCheckoutForm({ params, autoSubmit = true }: PayHereCheckoutFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const isSandbox = process.env.NEXT_PUBLIC_PAYHERE_SANDBOX === 'true'; // Fallback to window env if needed
  
  // Use sandbox URL if specified, otherwise production
  const actionUrl = isSandbox 
    ? "https://sandbox.payhere.lk/pay/checkout" 
    : "https://www.payhere.lk/pay/checkout";

  useEffect(() => {
    if (autoSubmit && formRef.current) {
      formRef.current.submit();
    }
  }, [autoSubmit]);

  return (
    <form ref={formRef} method="post" action={actionUrl} className="hidden">
      {Object.entries(params).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      <button type="submit">Redirecting to PayHere...</button>
    </form>
  );
}
