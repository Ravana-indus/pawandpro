import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { DeletePetButton } from '@/components/DeletePetButton';

export default async function PetDetailsPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) {
    return redirect('/login');
  }

  const { data } = await supabase
    .from('pets')
    .select('*')
    .eq('id', id)
    .single();

  const pet = data as any;

  if (!pet) {
    notFound();
  }

  // Ensure owner access (or vet access if we implement that check)
  if (pet.owner_id !== user.id) {
    // Check if user is a vet with an active appointment
    const { data: appointment } = await supabase
      .from('appointments')
      .select('id')
      .eq('pet_id', pet.id)
      .eq('vet_id', user.id as any)
      .single();

    if (!appointment) {
      notFound();
    }
  }

  const isOwner = pet.owner_id === user.id;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
         <Link href="/dashboard/pets" className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center">
            <span className="material-symbols-outlined mr-1">arrow_back</span>
            Back to Pets
         </Link>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl overflow-hidden shadow-sm">
         <div className="h-48 bg-primary/10 relative">
            {/* Header background graphic could go here */}
            <div className="absolute -bottom-16 left-8 flex items-end gap-6">
               <div className="w-32 h-32 rounded-full border-4 border-surface-container-lowest overflow-hidden bg-surface-container shadow-lg">
                  <img src={pet.image_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=400&fit=crop"} alt={pet.name} className="w-full h-full object-cover" />
               </div>
            </div>
         </div>

         <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
               <div>
                  <h1 className="text-4xl font-headline font-bold text-on-surface mb-1 tracking-tight">{pet.name}</h1>
                  <p className="text-lg text-on-surface-variant font-medium flex items-center gap-2">
                     {pet.species} • {pet.breed || 'Mixed'}
                  </p>
               </div>
               {isOwner && (
                  <div className="flex items-center gap-3">
                     <Link href={`/dashboard/pets/${pet.id}/edit`} className="bg-surface-container-high text-on-surface px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-surface-variant transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">edit</span> Edit Profile
                     </Link>
                     <DeletePetButton petId={pet.id} />
                  </div>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
               <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-5">
                  <span className="material-symbols-outlined text-primary mb-2">pets</span>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-0.5">Species</p>
                  <p className="font-bold text-on-surface">{pet.species}</p>
               </div>
               <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-5">
                  <span className="material-symbols-outlined text-secondary mb-2">category</span>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-0.5">Breed</p>
                  <p className="font-bold text-on-surface">{pet.breed || 'Not specified'}</p>
               </div>
               <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-5">
                  <span className="material-symbols-outlined text-tertiary mb-2">cake</span>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-0.5">Age</p>
                  <p className="font-bold text-on-surface">{pet.age || 'Not specified'}</p>
               </div>
               <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-5">
                  <span className="material-symbols-outlined text-on-surface-variant mb-2">transgender</span>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-0.5">Sex</p>
                  <p className="font-bold text-on-surface">{pet.sex || 'Not specified'}</p>
               </div>
            </div>

            {/* Medical History Placeholder */}
            <div>
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-headline font-bold text-on-surface flex items-center gap-2">
                     <span className="material-symbols-outlined text-primary">medical_information</span>
                     Medical Records
                  </h2>
                  {isOwner && (
                     <button className="text-primary text-sm font-bold hover:underline">Request Records</button>
                  )}
               </div>
               <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-3xl p-12 text-center">
                  <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4">folder_open</span>
                  <h3 className="text-xl font-bold text-on-surface mb-2">No Records Yet</h3>
                  <p className="text-on-surface-variant">Medical records will appear here after vet consultations.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
