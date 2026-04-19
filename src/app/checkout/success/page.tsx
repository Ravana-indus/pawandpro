import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function CheckoutSuccessPage(props: { searchParams: Promise<{ order_id: string }> }) {
  const { order_id } = await props.searchParams;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        quantity,
        price_at_purchase,
        product:products ( name, details ),
        pet_listing:pet_listings ( name, image_url )
      )
    `)
    .eq('id', order_id)
    .single();

  if (error || !data) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p>Order not found. Please contact support.</p>
      </div>
    );
  }

  const order = data as any;
  const firstItem = order.order_items?.[0] || {};
  const displayImage = firstItem?.product?.details?.image || firstItem?.pet_listing?.image_url;
  const displayName = firstItem?.product?.name || firstItem?.pet_listing?.name;

  return (
    <div className="bg-surface-container-lowest min-h-screen pt-20 pb-24">
      <div className="max-w-xl mx-auto px-6 text-center">
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-xl shadow-primary/20">
           <span className="material-symbols-outlined text-[48px] font-light">check_circle</span>
        </div>

        <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-4">Payment Successful</h1>
        <p className="text-lg text-on-surface-variant font-medium mb-12 leading-relaxed">
          Your order <span className="font-mono bg-surface-container px-2 py-0.5 rounded text-sm">{order.id.slice(0, 8).toUpperCase()}</span> has been processed securely.
        </p>

        {displayImage && (
          <div className="bg-surface-container-low rounded-3xl p-4 border border-outline-variant/20 flex items-center gap-4 mb-12 text-left">
            <img src={displayImage} alt="Order item" className="w-20 h-20 rounded-2xl object-cover" />
            <div>
              <p className="font-bold text-on-surface">{displayName} {order.order_items?.length > 1 ? `+ ${order.order_items.length - 1} more` : ''}</p>
              <p className="text-sm text-on-surface-variant mt-1">Total: Rs. {order.total_amount.toLocaleString()}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Link href="/dashboard/orders" className="bg-primary text-white py-4 px-8 rounded-2xl font-bold shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
            Track Order
          </Link>
          <Link href="/" className="bg-surface-container-high text-on-surface py-4 px-8 rounded-2xl font-bold hover:bg-surface-dim transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
