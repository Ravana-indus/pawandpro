import React from "react"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { EntityHeader } from "@/components/admin/EntityHeader"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { CancelBookingButton } from "@/components/admin/CancelBookingButton"

interface BookingDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: booking } = await supabase
    .from('service_bookings')
    .select(`
      *,
      provider:profiles!service_bookings_provider_id_fkey(full_name),
      customer:profiles!service_bookings_customer_id_fkey(full_name),
      pet:pets(name)
    `)
    .eq('id', id)
    .single()

  if (!booking) {
    return (
      <div className="space-y-6">
        <EntityHeader title="Booking Not Found" backHref="/admin/services/bookings" />
        <p className="text-on-surface-variant">The booking you are looking for does not exist.</p>
        <Link href="/admin/services/bookings" className="text-primary hover:underline">Return to Bookings</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <EntityHeader
        title={`Booking ${id.slice(0, 8)}...`}
        subtitle={`${booking.service_type} - ${new Date(booking.scheduled_at).toLocaleDateString()}`}
        backHref="/admin/services/bookings"
        actions={booking.status !== 'Cancelled' && <CancelBookingButton bookingId={booking.id} />}
      />

      <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-on-surface-variant mb-1">Service Type</h3>
            <p className="text-on-surface font-medium">{booking.service_type}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-on-surface-variant mb-1">Status</h3>
            <StatusBadge status={booking.status ?? ''} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-on-surface-variant mb-1">Provider</h3>
            <p className="text-on-surface">{booking.provider?.full_name || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-on-surface-variant mb-1">Customer</h3>
            <p className="text-on-surface">{booking.customer?.full_name || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-on-surface-variant mb-1">Pet</h3>
            <p className="text-on-surface">{booking.pet?.name || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-on-surface-variant mb-1">Fee</h3>
            <p className="text-on-surface">{booking.fee ? `$${Number(booking.fee).toFixed(2)}` : 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-on-surface-variant mb-1">Scheduled At</h3>
            <p className="text-on-surface">{new Date(booking.scheduled_at).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-on-surface-variant mb-1">Created At</h3>
            <p className="text-on-surface">{new Date(booking.created_at).toLocaleString()}</p>
          </div>
        </div>

        {booking.notes && (
          <div>
            <h3 className="text-sm font-medium text-on-surface-variant mb-1">Notes</h3>
            <p className="text-on-surface">{booking.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}