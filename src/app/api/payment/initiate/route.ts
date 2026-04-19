import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServerClient } from '@supabase/ssr';
import { getCartContent } from '@/lib/actions/cart';
import crypto from 'crypto';
import { Database } from '@/types/supabase';

export async function POST(req: Request) {
  try {
    // Use the session-aware anon client ONLY to identify the user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required. Please log in to complete your purchase.' }, { status: 401 });
    }

    const buyer_id = user.id;

    const { 
      first_name, 
      last_name, 
      email, 
      phone, 
      address, 
      city,
      pet_listing_id // optional, if buying a pet
    } = await req.json();

    // Use service role client for all DB writes (trusted server-side route)
    const adminSupabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: { get() { return undefined; }, set() {}, remove() {} }
      }
    );

    let totalAmount = 0;
    const orderItems: any[] = [];
    let itemsDescription = "";

    if (pet_listing_id) {
      // Pet Purchase Flow
      const { data, error: petError } = await adminSupabase
        .from('pet_listings')
        .select('*')
        .eq('id', pet_listing_id)
        .single();
      
      const pet = data as any;
      if (petError || !pet) return NextResponse.json({ error: 'Pet not found' }, { status: 404 });
      
      totalAmount = Number(pet.price);
      orderItems.push({
        pet_listing_id: pet.id,
        quantity: 1,
        price_at_purchase: pet.price
      });
      itemsDescription = `Pet Reservation: ${pet.name} (${pet.breed})`;
    } else {
      // Standard Cart Flow
      const cart = await getCartContent();
      if (cart.length === 0) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });

      totalAmount = cart.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
      cart.forEach(item => {
        orderItems.push({
          product_id: item.productId,
          quantity: item.quantity,
          price_at_purchase: item.product?.price || 0
        });
      });
      itemsDescription = cart.map(item => `${item.product?.name} x${item.quantity}`).join(', ');
    }

    // 2. Create Order in DB (Status: Processing) — using service role to bypass RLS on trusted server route
    const { data: orderData, error: orderError } = await adminSupabase
      .from('orders')
      .insert({
        buyer_id,
        total_amount: totalAmount,
        status: 'Processing' as any
      } as any)
      .select()
      .single();

    if (orderError) throw orderError;
    const order = orderData as any;

    // 3. Create Order Items
    const { error: itemsError } = await adminSupabase
      .from('order_items')
      .insert(orderItems.map(item => ({ ...item, order_id: order.id })) as any);

    if (itemsError) throw itemsError;

    // 4. Generate PayHere Hash
    const merchant_id = process.env.PAYHERE_MERCHANT_ID || '';
    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET || '';
    const currency = 'LKR';
    const amount_formatted = totalAmount.toFixed(2);
    
    let hash = '';
    if (merchant_secret && merchant_id) {
        hash = crypto
          .createHash('md5')
          .update(
            merchant_id +
            order.id +
            amount_formatted +
            currency +
            crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase()
          )
          .digest('hex')
          .toUpperCase();
    }

    // 5. Build PayHere Params
    const payhereParams = {
      merchant_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order_id=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/notify`,
      order_id: order.id,
      items: itemsDescription,
      currency,
      amount: amount_formatted,
      first_name,
      last_name,
      email,
      phone,
      address,
      city,
      country: 'Sri Lanka',
      hash
    };

    return NextResponse.json(payhereParams);

  } catch (error: any) {
    console.error('Payment initiation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
