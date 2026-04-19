import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function MyPetsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) {
    return <div>Authentication required</div>;
  }

  const { data } = await supabase
    .from('pets')
    .select('*')
    .eq('owner_id', user.id as any)
    .order('created_at', { ascending: false });

  const myPets = data as any[] || [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
           <h1 className="text-3xl font-headline font-bold text-on-surface mb-2">My Pets</h1>
           <p className="text-on-surface-variant font-medium">Manage clinical profiles and smart tags.</p>
        </div>
        <Link href="/dashboard/pets/new" className="bg-primary text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group">
           <span className="material-symbols-outlined transition-transform group-hover:rotate-90">add</span> Add Pet
        </Link>
      </div>

      {myPets.length === 0 ? (
        <div className="bg-surface-container-low border border-outline-variant/20 rounded-3xl p-12 text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4">pets</span>
          <h3 className="text-xl font-bold text-on-surface mb-2">No Pets Found</h3>
          <p className="text-on-surface-variant mb-6">Create a clinical profile for your pet to track health records.</p>
          <Link href="/dashboard/pets/new" className="inline-block bg-primary text-white px-6 py-3 rounded-full font-bold">
            Add Your First Pet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPets.map((myPet) => (
            <Link key={myPet.id} href={`/dashboard/pets/${myPet.id}`} className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 hover:shadow-lg transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full blur-2xl -z-0"></div>
              
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={myPet.image_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop"}
                  alt={myPet.name}
                  className="w-20 h-20 rounded-2xl object-cover shadow-sm border border-outline-variant/20 group-hover:scale-105 transition-transform"
                />
                <div>
                  <h3 className="text-xl font-headline font-bold text-on-surface">{myPet.name}</h3>
                  <p className="text-sm text-on-surface-variant">{myPet.breed || 'Mixed'} • {myPet.species}</p>
                </div>
              </div>

              <div className="flex gap-2">
                 <span className="bg-surface-container-low text-on-surface text-xs font-bold px-3 py-1.5 rounded-lg border border-outline-variant/20">{myPet.age || 'Age Unknown'}</span>
                 <span className="bg-surface-container-low text-on-surface text-xs font-bold px-3 py-1.5 rounded-lg border border-outline-variant/20">{myPet.sex || 'Unknown Sex'}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
