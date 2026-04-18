'use client';

import React, { useState } from 'react';
import { addToCart } from '@/lib/cart';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  isSubscription?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'quick-add';
  label?: string;
}

export function AddToCartButton({
  productId,
  quantity = 1,
  isSubscription = false,
  className,
  variant = 'primary',
  label
}: AddToCartButtonProps) {
  const [status, setStatus] = useState<'idle' | 'adding' | 'added'>('idle');

  const handleAdd = () => {
    setStatus('adding');
    
    // Simulate slight delay for premium feel
    setTimeout(() => {
      addToCart(productId, quantity, isSubscription);
      setStatus('added');
      
      // Auto-revert back to idle after 2 seconds
      setTimeout(() => setStatus('idle'), 2000);
    }, 400);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'quick-add':
        return "w-full bg-white text-primary py-2.5 rounded-lg font-bold text-sm hover:bg-surface-container-low transition-all flex items-center justify-center gap-2 shadow-sm border border-outline-variant/50";
      case 'outline':
        return "flex-1 border-2 border-primary text-primary py-4 rounded-2xl font-black text-sm hover:bg-primary/5 transition-all text-center";
      case 'secondary':
        return "flex-1 bg-surface-container-high text-on-surface py-4 rounded-2xl font-black text-sm hover:bg-surface-container-highest transition-all text-center";
      default:
        return "flex-[2] bg-primary text-white py-4 rounded-2xl font-black text-sm hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0 shadow-md transition-all text-center";
    }
  };

  return (
    <button
      onClick={handleAdd}
      disabled={status === 'adding'}
      className={cn(getVariantStyles(), className, status === 'added' && "bg-success text-white border-success")}
    >
      {status === 'idle' && (
        <>
          <span className="material-symbols-outlined text-[18px]">
            {variant === 'quick-add' ? 'add_shopping_cart' : 'shopping_bag'}
          </span>
          {label || (variant === 'quick-add' ? 'Quick Add' : 'Add to Cart')}
        </>
      )}
      {status === 'adding' && (
        <span className="material-symbols-outlined animate-spin">sync</span>
      )}
      {status === 'added' && (
        <>
          <span className="material-symbols-outlined">check_circle</span>
          Added!
        </>
      )}
    </button>
  );
}
