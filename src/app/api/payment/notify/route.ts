import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());

    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      custom_1,
      custom_2
    } = body as any;

    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET!;
    const secretHash = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();

    // 1. Verify Hash
    const localHash = crypto
      .createHash('md5')
      .update(
        merchant_id + 
        order_id + 
        payhere_amount + 
        payhere_currency + 
        status_code + 
        secretHash
      )
      .digest('hex')
      .toUpperCase();

    if (localHash !== md5sig) {
      console.error('PayHere Hash Mismatch!', { localHash, md5sig });
      return NextResponse.json({ error: 'Auth failed' }, { status: 401 });
    }

    // 2. Process Successful Payment (status_code 2 = Success)
    if (status_code === '2') {
      // Use service role to bypass RLS for administrative updates
      const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          cookies: {
            get(name: string) { return undefined },
            set() {},
            remove() {}
          }
        }
      );

      // Update Order Status
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .update({ status: 'Delivered' }) // Success
        .eq('id', order_id)
        .select('*, order_items(*)')
        .single();

      if (orderError) throw orderError;

      // Handle inventory for each item
      for (const item of order.order_items) {
        if (item.product_id) {
          // Decrement product stock
          await supabase.rpc('decrement_product_stock', { 
            prod_id: item.product_id, 
            qty: item.quantity 
          });
        }
        if (item.pet_listing_id) {
          // Mark pet as Sold
          await supabase
            .from('pet_listings')
            .update({ status: 'Sold' })
            .eq('id', item.pet_listing_id);
        }
      }
    }

    return new Response('OK', { status: 200 });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
