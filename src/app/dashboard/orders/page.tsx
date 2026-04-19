import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) {
    return <div>Authentication required</div>;
  }

  const { data } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        quantity,
        price_at_purchase,
        product:products ( name, details ),
        pet_listing:pet_listings ( name, image_url, breed )
      )
    `)
    .eq('buyer_id', user.id as any)
    .order('created_at', { ascending: false });

  const orders = data as any[] || [];

  const mappedOrders = orders.map(order => ({
    id: order.id,
    date: new Date(order.created_at).toLocaleDateString(),
    status: order.status,
    total: order.total_amount,
    items: order.order_items.map((item: any) => {
      if (item.product) {
        return {
          name: item.product.name,
          image: item.product.details?.image,
          quantity: item.quantity,
          type: 'product'
        }
      } else if (item.pet_listing) {
        return {
          name: `${item.pet_listing.name} (${item.pet_listing.breed})`,
          image: item.pet_listing.image_url,
          quantity: item.quantity,
          type: 'pet'
        }
      }
      return null;
    }).filter(Boolean)
  }));

  return (
    <div>
      <h1 className="text-3xl font-headline font-bold text-on-surface mb-2">Order History</h1>
      <p className="text-on-surface-variant mb-8">Track your clinical supplies and pet reservations.</p>

      {mappedOrders.length === 0 ? (
        <div className="bg-surface-container-low border border-outline-variant/20 rounded-3xl p-12 text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4">shopping_bag</span>
          <h3 className="text-xl font-bold text-on-surface mb-2">No Orders Yet</h3>
          <p className="text-on-surface-variant mb-6">Explore our marketplace for clinical-grade supplies.</p>
          <Link href="/marketplace" className="inline-block bg-primary text-white px-6 py-3 rounded-full font-bold">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {mappedOrders.map((order) => (
            <div key={order.id} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
              {/* Order Header */}
              <div className="bg-surface-container-low border-b border-outline-variant/20 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                   <div>
                      <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">Order Placed</p>
                      <p className="font-medium text-on-surface text-sm">{order.date}</p>
                   </div>
                   <div>
                      <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">Total</p>
                      <p className="font-bold text-on-surface text-sm">Rs. {order.total.toLocaleString()}</p>
                   </div>
                   <div className="hidden md:block">
                      <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">Order #</p>
                      <p className="font-mono text-sm text-on-surface">{order.id.slice(0, 8).toUpperCase()}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    order.status === 'Delivered' ? 'bg-primary/10 text-primary' :
                    order.status === 'Processing' ? 'bg-secondary/10 text-secondary' :
                    order.status === 'Cancelled' ? 'bg-error/10 text-error' :
                    'bg-tertiary/10 text-tertiary'
                  }`}>
                    {order.status}
                  </span>
                  <Link href={`/dashboard/orders/${order.id}`} className="text-primary font-bold text-sm hover:underline">
                     View Details
                  </Link>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="flex flex-col gap-4">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop"}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover border border-outline-variant/20"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-on-surface">{item.name}</h4>
                        <p className="text-sm text-on-surface-variant mt-0.5">
                          {item.type === 'product' ? `Qty: ${item.quantity}` : 'Reservation'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
