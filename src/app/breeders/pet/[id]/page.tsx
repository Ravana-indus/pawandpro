import { notFound, redirect } from 'next/navigation';
import { getPetListingById } from '@/lib/queries';
import Link from 'next/link';
import { reservePet } from '@/lib/actions/escrow';

export default async function PetListingPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const petRaw = await getPetListingById(id);

  if (!petRaw) {
    notFound();
  }

  const pet = petRaw as any;
  const breederName = pet.seller?.full_name || 'Verified Breeder';

  return (
    <div className="bg-surface-container-lowest min-h-screen pb-24">
      {/* Breadcrumbs */}
      <div className="bg-surface-container-low border-b border-outline-variant/20 pt-6 pb-4 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto flex items-center gap-2 text-sm text-on-surface-variant font-medium">
          <Link href="/breeders" className="hover:text-primary transition-colors">Marketplace &amp; Peers</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <Link href="#" className="hover:text-primary transition-colors">{breederName}</Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-on-surface truncate">{pet.name} ({pet.breed})</span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column - Images */}
        <div className="lg:col-span-7 space-y-6">
          <div className="aspect-[4/3] bg-surface-container rounded-3xl overflow-hidden border border-outline-variant/20 relative group">
            <img
              src={pet.image_url || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&h=800&fit=crop"}
              alt={pet.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {pet.status !== 'Available' && (
              <div className="absolute inset-0 bg-surface/50 backdrop-blur-sm flex items-center justify-center">
                <span className="bg-error text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg tracking-wider uppercase">
                  {pet.status}
                </span>
              </div>
            )}
            <div className="absolute top-6 left-6 flex gap-2">
               {pet.certification_tier && (
                  <span className="bg-white/90 backdrop-blur-md text-primary px-4 py-1.5 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider flex items-center gap-1.5 border border-primary/10">
                     <span className="material-symbols-outlined text-[14px]">workspace_premium</span> {pet.certification_tier} Level
                  </span>
               )}
               <span className="bg-white/90 backdrop-blur-md text-on-surface px-4 py-1.5 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider flex items-center gap-1.5 border border-outline-variant/20">
                  {pet.type}
               </span>
            </div>
          </div>
          
          <div className="bg-surface-container-low rounded-3xl p-8 border border-outline-variant/20">
             <h3 className="text-xl font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">verified_user</span> Lineage &amp; Health Guarantee
             </h3>
             <ul className="space-y-4">
                <li className="flex items-start gap-3">
                   <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
                   <div>
                      <p className="font-bold text-on-surface text-sm">SLVC Breeder Verification</p>
                      <p className="text-on-surface-variant text-sm mt-1">Breeder premises and practices have been audited.</p>
                   </div>
                </li>
                <li className="flex items-start gap-3">
                   <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
                   <div>
                      <p className="font-bold text-on-surface text-sm">Genetic Screening Cleared</p>
                      <p className="text-on-surface-variant text-sm mt-1">Parents tested clear for breed-specific hereditary conditions.</p>
                   </div>
                </li>
                <li className="flex items-start gap-3">
                   <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
                   <div>
                      <p className="font-bold text-on-surface text-sm">Initial Vaccinations</p>
                      <p className="text-on-surface-variant text-sm mt-1">Core vaccines administered by certified veterinarian.</p>
                   </div>
                </li>
             </ul>
          </div>
        </div>

        {/* Right Column - Details & Action */}
        <div className="lg:col-span-5">
          <div className="sticky top-28">
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
              {pet.name}
            </h1>
            <p className="text-lg text-on-surface-variant font-medium mb-6">
              {pet.breed || 'Mixed'} • {pet.species} • {pet.sex} • {pet.age}
            </p>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-headline font-black text-on-surface tracking-tight">
                 Rs. {pet.price.toLocaleString()}
              </span>
              <span className="text-on-surface-variant text-sm font-medium">via Secure Escrow</span>
            </div>

            <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/20 mb-8 flex items-center gap-4">
               <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop" alt="Breeder" className="w-16 h-16 rounded-full object-cover border-2 border-primary/20" />
               <div>
                  <div className="flex items-center gap-1">
                     <span className="font-bold text-on-surface text-lg">{breederName}</span>
                     <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                  </div>
                  <p className="text-sm text-on-surface-variant font-medium mt-0.5">Member since 2023 • 14 Successful Placements</p>
               </div>
            </div>

            <form action={reservePet}>
              <input type="hidden" name="listing_id" value={pet.id} />
              <button
                type="submit"
                disabled={pet.status !== 'Available'}
                className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg shadow-[0_8px_30px_rgba(var(--primary-rgb),0.3)] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(var(--primary-rgb),0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:pointer-events-none mb-4"
              >
                <span className="material-symbols-outlined font-light text-[24px]">lock</span>
                {pet.status === 'Available' ? 'Reserve via Escrow' : 'Currently Unavailable'}
              </button>
            </form>
            <p className="text-center text-xs text-on-surface-variant font-medium flex items-center justify-center gap-1.5">
               <span className="material-symbols-outlined text-[14px]">info</span>
               Funds are held securely until physical handover is verified.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
