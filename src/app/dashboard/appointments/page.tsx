import React from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function AppointmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      *,
      vet:profiles!vet_id (*),
      pet:pets!pet_id (*)
    `)
    .eq('parent_id', user?.id)
    .order('scheduled_at', { ascending: true });

  const upcomingAppointments = appointments?.filter(a => new Date(a.scheduled_at) >= new Date() && a.status !== 'Cancelled') || [];
  const pastAppointments = appointments?.filter(a => new Date(a.scheduled_at) < new Date() || a.status === 'Cancelled') || [];

  return (
    <div className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
      <DashboardSidebar />
      <main className="flex-1 space-y-8">
        <header className="mb-8">
          <h1 className="text-4xl font-headline font-extrabold text-on-surface mb-2">Appointments</h1>
          <p className="text-on-surface-variant text-lg">Manage your veterinary clinic and home visit bookings.</p>
        </header>

        {/* Upcoming Appointments */}
        <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm mb-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full pointer-events-none -z-10"></div>
           <div className="flex justify-between items-center border-b border-outline-variant/10 pb-4 mb-6">
             <h2 className="text-2xl font-bold font-headline text-on-surface flex items-center gap-2">
               <span className="material-symbols-outlined text-primary">event_upcoming</span> Upcoming
             </h2>
             <Link href="/veterinary" className="bg-primary/10 text-primary font-bold px-4 py-2 rounded-xl text-sm hover:bg-primary hover:text-white transition-colors">
               Book New
             </Link>
           </div>
           
           <div className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <div className="text-on-surface-variant text-sm p-4 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30 text-center">No upcoming appointments.</div>
              ) : upcomingAppointments.map(appt => {
                 const dateObj = new Date(appt.scheduled_at);
                 return (
                  <div key={appt.id} className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center hover:bg-surface-container transition-colors">
                     <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-primary text-white rounded-2xl flex flex-col items-center justify-center font-bold shadow-sm shrink-0">
                           <span className="text-sm">{dateObj.toLocaleDateString('en-US', { month: 'short' })}</span>
                           <span className="text-xl">{dateObj.getDate()}</span>
                        </div>
                        <div>
                           <h3 className="font-bold text-lg text-on-surface mb-1 flex items-center gap-2">
                             Consultation <span className="bg-tertiary-container text-on-tertiary-container text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-widest">{appt.status}</span>
                           </h3>
                           <p className="text-sm text-on-surface-variant flex items-center gap-1.5 font-medium">
                             <span className="material-symbols-outlined text-[16px]">schedule</span> {dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                             <span className="text-outline-variant mx-1">&bull;</span>
                             <span className="material-symbols-outlined text-[16px]">pets</span> {appt.pet?.name || 'Pet'}
                             <span className="text-outline-variant mx-1">&bull;</span>
                             <span className="material-symbols-outlined text-[16px]">person</span> Dr. {appt.vet?.full_name?.split(' ')[0] || 'Vet'}
                           </p>
                        </div>
                     </div>
                     <div className="flex gap-2 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none border border-outline-variant/30 bg-surface text-on-surface px-4 py-2 rounded-xl text-sm font-bold hover:bg-surface-dim transition-colors">Reschedule</button>
                        <button className="flex-1 sm:flex-none bg-surface-container-highest text-error px-4 py-2 rounded-xl text-sm font-bold hover:bg-error/10 transition-colors">Cancel</button>
                     </div>
                  </div>
                 )
              })}
           </div>
        </section>

        {/* Past Appointments */}
        <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm">
           <h2 className="text-2xl font-bold font-headline text-on-surface border-b border-outline-variant/10 pb-4 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-outline-variant">history</span> Past Records
           </h2>
           <div className="space-y-4">
              {pastAppointments.length === 0 ? (
                <div className="text-on-surface-variant text-sm p-4 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30 text-center">No past records found.</div>
              ) : pastAppointments.map(appt => {
                 const dateObj = new Date(appt.scheduled_at);
                 return (
                  <div key={appt.id} className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/10 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                     <div className="flex gap-4 items-center opacity-70">
                        <div className="w-14 h-14 bg-surface-container-highest text-on-surface-variant rounded-2xl flex flex-col items-center justify-center font-bold shrink-0">
                           <span className="text-xs">{dateObj.toLocaleDateString('en-US', { month: 'short' })}</span>
                           <span className="text-lg">{dateObj.getDate()}</span>
                        </div>
                        <div>
                           <h3 className="font-bold text-on-surface flex items-center gap-2">
                             Consultation <span className="bg-surface-container-highest text-on-surface-variant text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-widest">{appt.status}</span>
                           </h3>
                           <p className="text-sm text-on-surface-variant flex items-center gap-1.5">
                             <span className="material-symbols-outlined text-[16px]">person</span> Dr. {appt.vet?.full_name || 'Vet'}
                           </p>
                        </div>
                     </div>
                     <Link href={`/dashboard/records`} className="text-tertiary font-bold text-sm hover:underline flex items-center gap-1">
                        View Notes <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                     </Link>
                  </div>
                 )
              })}
           </div>
        </section>
      </main>
    </div>
  );
}
