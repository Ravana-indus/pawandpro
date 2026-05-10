'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateProviderStatus } from '@/lib/actions/admin'

interface VerifyToggleButtonProps {
  providerId: string
  isVerified: boolean
}

export function VerifyToggleButton({ providerId, isVerified }: VerifyToggleButtonProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleToggle = () => {
    startTransition(async () => {
      await updateProviderStatus(providerId, !isVerified)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        isVerified
          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
          : 'bg-green-100 text-green-800 hover:bg-green-200'
      } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
    >
      {isPending ? 'Updating...' : isVerified ? 'Unverify' : 'Verify'}
    </button>
  )
}