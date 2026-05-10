'use client'

import React, { useState } from 'react'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { cancelBooking } from '@/lib/actions/admin'

interface CancelBookingButtonProps {
  bookingId: string
}

export function CancelBookingButton({ bookingId }: CancelBookingButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      const result = await cancelBooking(bookingId)
      if (result?.error) {
        console.error('Failed to cancel booking:', result.error)
      }
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-xl bg-error text-on-error font-medium hover:opacity-90"
      >
        Cancel Booking
      </button>
      <ConfirmDialog
        open={isOpen}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmLabel={isLoading ? 'Cancelling...' : 'Cancel Booking'}
        cancelLabel="Keep Booking"
        variant="danger"
        onConfirm={handleConfirm}
        onCancel={() => setIsOpen(false)}
      />
    </>
  )
}