import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function AppointmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) {
    return <div>Authentication required</div>;
  }

  const { data } = await supabase
    .from('appointments')
    .select(`
      *,
      vet:profiles!vet_id (*),
      pet:pets!pet_id (*)
    `)
    .eq('parent_id', user.id as any)
    .order('scheduled_at', { ascending: true });

  const appointments = data as any[] || [];

  const upcomingAppointments = appointments.filter(a => new Date(a.scheduled_at) >= new Date() && a.status !== 'Cancelled');
  const pastAppointments = appointments.filter(a => new Date(a.scheduled_at) < new Date() || a.status === 'Cancelled');

  return (
    <div>
      <h1 className="text-3xl font-headline font-bold text-on-surface mb-2">My Appointments</h1>
      <p className="text-on-surface-variant mb-8">Manage your vet consultations and checkups.</p>

      {upcomingAppointments.length === 0 ? (
        <div className="bg-surface-container-low border border-outline-variant/20 rounded-3xl p-12 text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4">event_busy</span>
          <h3 className="text-xl font-bold text-on-surface mb-2">No Upcoming Appointments</h3>
          <p className="text-on-surface-variant mb-6">Book a consultation with our certified veterinarians.</p>
          <Link href="/veterinary" className="inline-block bg-primary text-white px-6 py-3 rounded-full font-bold">
            Find a Vet
          </Link>
        </div>
      ) : (
        <div className="space-y-4 mb-12">
          {upcomingAppointments.map((apt) => (
            <div key={apt.id} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
               <div className="flex items-center gap-6">
                  <div className="bg-primary/10 text-primary w-20 h-20 rounded-2xl flex flex-col items-center justify-center border border-primary/20 shrink-0">
                     <span className="text-xs font-bold uppercase tracking-wider">{new Date(apt.scheduled_at).toLocaleDateString('en-US', { month: 'short' })}</span>
                     <span className="text-2xl font-headline font-black leading-none mt-1">{new Date(apt.scheduled_at).getDate()}</span>
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-on-surface mb-1">Consultation with Dr. {apt.vet?.full_name}</h3>
                     <p className="text-on-surface-variant text-sm font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">pets</span>
                        For {apt.pet?.name || 'My Pet'}
                     </p>
                     <p className="text-on-surface-variant text-sm font-medium flex items-center gap-2 mt-1">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        {new Date(apt.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </p>
                  </div>
               </div>

               <div className="flex items-center gap-4 w-full md:w-auto border-t border-outline-variant/10 md:border-t-0 pt-4 md:pt-0">
                  <Link href={`/dashboard/appointments/${apt.id}`} className="bg-surface-container-high text-on-surface px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-surface-variant transition-colors w-full md:w-auto text-center">
                    Details
                  </Link>
               </div>
            </div>
          ))}
        </div>
      )}

      {pastAppointments.length > 0 && (
        <>
          <h2 className="text-xl font-headline font-bold text-on-surface mb-6">Past & Cancelled</h2>
          <div className="space-y-4 opacity-75">
             {pastAppointments.map((apt) => (
               <div key={apt.id} className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                     <div className="bg-surface-container-high text-on-surface-variant w-16 h-16 rounded-xl flex flex-col items-center justify-center shrink-0">
                        <span className="text-xs font-bold uppercase">{new Date(apt.scheduled_at).toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span className="text-xl font-headline font-black leading-none">{new Date(apt.scheduled_at).getDate()}</span>
                     </div>
                     <div>
                        <h3 className="font-bold text-on-surface">Dr. {apt.vet?.full_name}</h3>
                        <p className="text-sm text-on-surface-variant">For {apt.pet?.name}</p>
                     </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${apt.status === 'Cancelled' ? 'bg-error/10 text-error' : 'bg-surface-variant text-on-surface-variant'}`}>
                    {apt.status}
                  </span>
               </div>
             ))}
          </div>
        </>
      )}
    </div>
  );
}
