'use client';

import { CartItem } from '@/types/models';

const CART_COOKIE_NAME = 'pawsandpro_cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  
  const cookies = document.cookie.split(';');
  const cartCookie = cookies.find(c => c.trim().startsWith(`${CART_COOKIE_NAME}=`));
  
  if (!cartCookie) return [];
  
  try {
    const value = decodeURIComponent(cartCookie.split('=')[1]);
    return JSON.parse(value);
  } catch (e) {
    console.error('Failed to parse cart cookie', e);
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  
  const value = encodeURIComponent(JSON.stringify(items));
  const expires = new Date();
  expires.setDate(expires.getDate() + 30); // 30 days
  
  document.cookie = `${CART_COOKIE_NAME}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

export function addToCart(productId: string, quantity: number = 1, isSubscription: boolean = false) {
  const cart = getCart();
  const existing = cart.find(item => item.productId === productId && item.isSubscription === isSubscription);
  
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity, isSubscription });
  }
  
  saveCart(cart);
}

export function removeFromCart(productId: string, isSubscription?: boolean) {
  let cart = getCart();
  cart = cart.filter(item => !(item.productId === productId && (isSubscription === undefined || item.isSubscription === isSubscription)));
  saveCart(cart);
}

export function updateQuantity(productId: string, quantity: number, isSubscription?: boolean) {
  const cart = getCart();
  const item = cart.find(item => item.productId === productId && (isSubscription === undefined || item.isSubscription === isSubscription));
  
  if (item) {
    item.quantity = quantity;
    if (item.quantity <= 0) {
      removeFromCart(productId, isSubscription);
    } else {
      saveCart(cart);
    }
  }
}

export function clearCart() {
  saveCart([]);
}
