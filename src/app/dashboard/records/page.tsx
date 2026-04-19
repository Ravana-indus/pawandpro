import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function RecordsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) {
    return <div>Authentication required</div>;
  }

  const { data: pets } = await supabase
    .from('pets')
    .select('*')
    .eq('owner_id', user.id);

  const userPets = (pets as any[]) || [];

  return (
    <div>
      <h1 className="text-3xl font-headline font-bold text-on-surface mb-2">Medical Records</h1>
      <p className="text-on-surface-variant mb-8">Access clinical history and vaccination records for your pets.</p>

      {userPets.length === 0 ? (
        <div className="bg-surface-container-low border border-outline-variant/20 rounded-3xl p-12 text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4">folder_off</span>
          <h3 className="text-xl font-bold text-on-surface mb-2">No Pets Found</h3>
          <p className="text-on-surface-variant mb-6">Add a pet to start generating their digital health passport.</p>
          <Link href="/dashboard/pets/new" className="inline-block bg-primary text-white px-6 py-3 rounded-full font-bold">
            Add Pet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {userPets.map((pet) => (
            <div key={pet.id} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 hover:shadow-sm transition-shadow">
               <div className="flex items-center gap-4 mb-6">
                  <img src={pet.image_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop"} className="w-16 h-16 rounded-xl object-cover border border-outline-variant/20" alt={pet.name} />
                  <div className="flex-1">
                     <h3 className="text-xl font-bold text-on-surface">{pet.name}'s File</h3>
                     <p className="text-sm text-on-surface-variant">{pet.species} • ID: {pet.id.split('-')[0].toUpperCase()}</p>
                  </div>
                  <button disabled className="bg-surface-container hover:bg-surface-dim text-on-surface px-4 py-2 rounded-lg font-bold text-sm transition-colors opacity-50 cursor-not-allowed">
                     Download PDF
                  </button>
               </div>

               <div className="bg-surface-container-low rounded-xl p-8 text-center border border-dashed border-outline-variant/30">
                  <span className="material-symbols-outlined text-outline-variant text-[32px] mb-2">history</span>
                  <p className="font-bold text-on-surface text-sm mb-1">No Consultations Yet</p>
                  <p className="text-xs text-on-surface-variant max-w-sm mx-auto">Once {pet.name} visits a SLVC certified vet on our platform, their clinical notes and prescriptions will automatically sync here in real-time.</p>
                  <Link href="/veterinary" className="inline-block mt-4 text-primary font-bold text-sm hover:underline">Book an Appointment</Link>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
