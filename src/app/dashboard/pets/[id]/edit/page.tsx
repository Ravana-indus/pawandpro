import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';

export default async function EditPetPage(props: { params: Promise<{ id: string }> }) {
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

  if (!pet || pet.owner_id !== user?.id) {
    notFound();
  }

  async function updatePet(formData: FormData) {
    'use server';
    const sbp = await createClient();

    const name = formData.get('name') as string;
    const species = formData.get('species') as string;
    const breed = formData.get('breed') as string;
    const sex = formData.get('sex') as string;
    const age = formData.get('age') as string;
    const image_url = formData.get('image_url') as string;

    await sbp.from('pets').update({
      name,
      species,
      breed,
      sex,
      age,
      image_url: image_url || pet.image_url
    } as never).eq('id', pet.id);

    redirect(`/dashboard/pets/${pet.id}`);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-headline font-bold text-on-surface mb-2">Edit {pet.name}</h1>
      <p className="text-on-surface-variant mb-8">Update your pet's profile information.</p>

      <form action={updatePet} className="space-y-6 bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-8">
        <div className="flex gap-6">
           <div className="w-1/2">
              <label className="block text-sm font-bold text-on-surface mb-2">Pet Name</label>
              <input type="text" name="name" defaultValue={pet.name} required className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface" />
           </div>
           <div className="w-1/2">
              <label className="block text-sm font-bold text-on-surface mb-2">Species</label>
              <select name="species" defaultValue={pet.species} required className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface">
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Fish">Fish</option>
                <option value="Small Pet">Small Pet</option>
                <option value="Reptile">Reptile</option>
              </select>
           </div>
        </div>

        <div className="flex gap-6">
           <div className="w-1/2">
              <label className="block text-sm font-bold text-on-surface mb-2">Breed <span className="text-on-surface-variant font-normal">(Optional)</span></label>
              <input type="text" name="breed" defaultValue={pet.breed || ''} className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface" />
           </div>
           <div className="w-1/2">
              <label className="block text-sm font-bold text-on-surface mb-2">Sex</label>
              <select name="sex" defaultValue={pet.sex || ''} className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface">
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
           </div>
        </div>

        <div>
           <label className="block text-sm font-bold text-on-surface mb-2">Age / Date of Birth</label>
           <input type="text" name="age" defaultValue={pet.age || ''} placeholder="e.g. 2 years old, or DD/MM/YYYY" className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface" />
        </div>

        <div>
           <label className="block text-sm font-bold text-on-surface mb-2">Image URL <span className="text-on-surface-variant font-normal">(Optional)</span></label>
           <input type="url" name="image_url" defaultValue={pet.image_url || ''} placeholder="https://..." className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface" />
        </div>

        <div className="pt-6 flex gap-4">
          <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-md flex-1">
             Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
