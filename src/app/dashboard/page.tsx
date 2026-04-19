import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) {
    return <div>Authentication required</div>;
  }

  // Fetch profile, pets, and recent orders
  const [profileRes, petsRes, ordersRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id as any).single(),
    supabase.from('pets').select('*').eq('owner_id', user.id as any),
    supabase.from('orders')
      .select('*, order_items(product:products(name))')
      .eq('buyer_id', user.id as any)
      .order('created_at', { ascending: false })
      .limit(3)
  ]);

  const profile = profileRes.data as any;
  const pets = (petsRes.data as any[]) || [];
  const recentOrders = (ordersRes.data as any[]) || [];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/20 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
             <div className="w-20 h-20 rounded-full border-4 border-surface-container shadow-md overflow-hidden bg-surface-container shrink-0">
                 <img
                   alt="User avatar"
                   className="w-full h-full object-cover"
                   src={profile?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"}
                 />
             </div>
             <div>
                <h1 className="text-3xl md:text-4xl font-headline font-bold text-on-surface tracking-tight mb-1">
                  Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!
                </h1>
                <p className="text-on-surface-variant font-medium flex items-center gap-2">
                   <span className="material-symbols-outlined text-[18px]">verified_user</span>
                   Verified {profile?.role || 'PARENT'} Account
                </p>
             </div>
            </div>

            <Link href="/dashboard/settings" className="bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-on-surface px-5 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-sm">
               <span className="material-symbols-outlined text-[18px]">edit</span> Edit Profile
            </Link>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Quick Actions / Pets Summary */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-headline font-bold text-on-surface">My Pets</h2>
             <Link href="/dashboard/pets" className="text-primary text-sm font-bold hover:underline">View All</Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
             {pets.slice(0, 3).map(pet => (
               <Link href={`/dashboard/pets/${pet.id}`} key={pet.id} className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all group">
                  <img src={pet.image_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop"} className="w-12 h-12 rounded-xl object-cover" alt="" />
                  <div>
                     <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{pet.name}</p>
                     <p className="text-xs text-on-surface-variant">{pet.species}</p>
                  </div>
               </Link>
             ))}
             <Link href="/dashboard/pets/new" className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low transition-colors text-on-surface-variant group h-full min-h-[88px]">
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">add_circle</span>
                <span className="text-xs font-bold">Add Pet</span>
             </Link>
          </div>
        </div>

        {/* Recent Activity / Orders */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-headline font-bold text-on-surface">Recent Orders</h2>
             <Link href="/dashboard/orders" className="text-primary text-sm font-bold hover:underline">Track Orders</Link>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden shadow-sm">
             {recentOrders.length === 0 ? (
               <div className="p-8 text-center">
                  <span className="material-symbols-outlined text-outline-variant text-[40px] mb-2">inventory_2</span>
                  <p className="text-on-surface-variant text-sm">No recent orders found.</p>
               </div>
             ) : (
               <div className="divide-y divide-outline-variant/10">
                  {recentOrders.map(order => {
                     const firstItem = order.order_items?.[0];
                     return (
                       <Link href={`/dashboard/orders/${order.id}`} key={order.id} className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                          <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                               order.status === 'Delivered' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                             }`}>
                                <span className="material-symbols-outlined text-[20px]">
                                   {order.status === 'Delivered' ? 'check_circle' : 'local_shipping'}
                                </span>
                             </div>
                             <div>
                                <p className="font-bold text-on-surface text-sm">Order #{order.id.slice(0,6).toUpperCase()}</p>
                                <p className="text-xs text-on-surface-variant truncate max-w-[150px]">
                                   {firstItem?.product?.name || 'Pet Reservation'}
                                </p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="font-bold text-on-surface text-sm">Rs. {order.total_amount}</p>
                             <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">{order.status}</p>
                          </div>
                       </Link>
                     );
                  })}
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-outline-variant/20">
         <Link href="/dashboard/appointments" className="bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 p-5 rounded-2xl flex items-center gap-4 transition-colors group">
            <div className="bg-white text-primary w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
               <span className="material-symbols-outlined">calendar_month</span>
            </div>
            <div>
               <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">Appointments</h4>
               <p className="text-xs text-on-surface-variant mt-0.5">Manage vet visits</p>
            </div>
         </Link>
         <Link href="/dashboard/records" className="bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 p-5 rounded-2xl flex items-center gap-4 transition-colors group">
            <div className="bg-white text-tertiary w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
               <span className="material-symbols-outlined">folder_shared</span>
            </div>
            <div>
               <h4 className="font-bold text-on-surface group-hover:text-tertiary transition-colors">Medical Records</h4>
               <p className="text-xs text-on-surface-variant mt-0.5">Access history</p>
            </div>
         </Link>
         <Link href="/dashboard/subscriptions" className="bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 p-5 rounded-2xl flex items-center gap-4 transition-colors group">
            <div className="bg-white text-secondary w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
               <span className="material-symbols-outlined">autorenew</span>
            </div>
            <div>
               <h4 className="font-bold text-on-surface group-hover:text-secondary transition-colors">Subscriptions</h4>
               <p className="text-xs text-on-surface-variant mt-0.5">Food & meds auto-ship</p>
            </div>
         </Link>
      </div>
    </div>
  );
}
