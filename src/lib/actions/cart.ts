'use server';

import { cookies } from 'next/headers';
import { getProductById } from '../queries';
import { CartItem } from '@/types/models';

const CART_COOKIE_NAME = 'pawsandpro_cart';

export async function getCartContent() {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get(CART_COOKIE_NAME);
  
  if (!cartCookie) return [];
  
  try {
    const cart: CartItem[] = JSON.parse(decodeURIComponent(cartCookie.value));
    
    // Hydrate with product data
    const hydratedCart = await Promise.all(
      cart.map(async (item) => {
        const product = await getProductById(item.productId);
        return { ...item, product };
      })
    );
    
    return hydratedCart.filter(item => item.product !== null);
  } catch (e) {
    return [];
  }
}
