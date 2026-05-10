import React from "react"
import Link from "next/link"
import { EntityHeader } from "@/components/admin/EntityHeader"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { AuditTimeline } from "@/components/admin/AuditTimeline"
import { DetailSection } from "@/components/admin/DetailSection"
import { cancelAdminBooking } from "@/lib/admin/mutations/services"
import { getAdminBookingDetail } from "@/lib/admin/queries/services"

interface BookingDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { id } = await params
  const { data: booking } = await getAdminBookingDetail(id)

  if (!booking) {
    return (
      <div className="space-y-6">
        <EntityHeader title="Booking Not Found" backHref="/admin/services/bookings" />
        <p className="text-on-surface-variant">The booking you are looking for does not exist.</p>
        <Link href="/admin/services/bookings" className="text-primary hover:underline">Return to Bookings</Link>
      </div>
    )
  }

  async function cancelBookingAction(formData: FormData) {
    "use server"
    const reason = String(formData.get("reason") || "")
    await cancelAdminBooking(id, reason)
  }

  return (
    <div className="space-y-6">
      <EntityHeader
        title={`Booking ${id.slice(0, 8)}...`}
        subtitle={`${booking.service_type} - ${new Date(booking.scheduled_at).toLocaleDateString()}`}
        backHref="/admin/services/bookings"
      />

      <DetailSection title="Booking Details" description="Operational snapshot for this service booking.">
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
            <p className="text-on-surface">{new Date(booking.scheduled_at!).toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-on-surface-variant mb-1">Created At</h3>
            <p className="text-on-surface">{new Date(booking.created_at!).toLocaleString()}</p>
          </div>
        </div>

        {booking.notes && (
          <div>
            <h3 className="text-sm font-medium text-on-surface-variant mb-1">Notes</h3>
            <p className="text-on-surface">{booking.notes}</p>
          </div>
        )}
      </DetailSection>

      {booking.status !== "Cancelled" ? (
        <DetailSection title="Cancel Booking" description="Cancellation requires an audit reason.">
          <form action={cancelBookingAction} className="space-y-3">
            <label htmlFor="cancel-reason" className="block text-sm font-medium text-on-surface">
              Reason
            </label>
            <textarea
              id="cancel-reason"
              name="reason"
              required
              minLength={3}
              maxLength={500}
              placeholder="Describe why this booking is being cancelled"
              className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-high px-3 py-2 text-sm text-on-surface"
              rows={4}
            />
            <button
              type="submit"
              className="rounded-xl bg-error px-4 py-2 text-sm font-medium text-on-error hover:opacity-90"
            >
              Cancel Booking
            </button>
          </form>
        </DetailSection>
      ) : null}

      <DetailSection title="Audit Timeline" description="Recent administrative actions for this booking.">
        <AuditTimeline targetType="service_bookings" targetId={booking.id} />
      </DetailSection>
    </div>
  )
}
