'use client'

import React, { useState } from 'react'
import { useFormStatus } from 'react-dom'

function SubmitButton({ label = 'Save' }: { label?: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2 rounded-xl bg-primary text-on-primary font-medium hover:opacity-90 disabled:opacity-50"
    >
      {pending ? 'Saving...' : label}
    </button>
  )
}

interface EntityFormProps {
  action: (formData: FormData) => Promise<{ success?: boolean; error?: Record<string, string[]> | string; data?: unknown }>
  children: React.ReactNode
  onSuccess?: () => void
  submitLabel?: string
}

export function EntityForm({ action, children, onSuccess, submitLabel }: EntityFormProps) {
  const [error, setError] = useState<string | null>(null)

  async function handleAction(formData: FormData) {
    setError(null)
    const result = await action(formData)
    if (result.error) {
      if (typeof result.error === 'string') {
        setError(result.error)
      } else {
        setError('Please fix the form errors below')
      }
    } else if (result.success) {
      onSuccess?.()
    }
  }

  return (
    <form action={handleAction} className="space-y-4">
      {error && (
        <div className="p-4 rounded-xl bg-error/10 text-error text-sm">
          {error}
        </div>
      )}
      {children}
      <div className="flex gap-3 pt-4">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  )
}
