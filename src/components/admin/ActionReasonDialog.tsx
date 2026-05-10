'use client'

import React, { useState, useTransition } from 'react'

interface ActionReasonDialogProps {
  triggerLabel: string
  title: string
  description: string
  confirmLabel: string
  confirmVariant?: 'default' | 'destructive'
  onConfirm: (reason: string) => Promise<{ success?: boolean; error?: string } | void>
}

export function ActionReasonDialog({
  triggerLabel,
  title,
  description,
  confirmLabel,
  confirmVariant = 'default',
  onConfirm,
}: ActionReasonDialogProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const confirmClassName = confirmVariant === 'destructive'
    ? 'bg-error text-on-error'
    : 'bg-primary text-on-primary'

  const resetDialog = () => {
    setOpen(false)
    setReason('')
    setError(null)
  }

  const handleConfirm = () => {
    const trimmedReason = reason.trim()
    if (!trimmedReason) {
      setError('Reason is required.')
      return
    }

    setError(null)
    startTransition(async () => {
      const result = await onConfirm(trimmedReason)
      if (result && result.success === false) {
        setError(result.error || 'Action failed')
        return
      }

      resetDialog()
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-container-low transition-colors"
      >
        {triggerLabel}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close dialog"
            onClick={resetDialog}
            className="absolute inset-0 bg-black/50"
          />
          <div className="relative w-full max-w-lg bg-surface-container-lowest rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-on-surface">{title}</h3>
              <p className="text-sm text-on-surface-variant mt-1">{description}</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="action-reason" className="text-sm font-medium text-on-surface">
                Reason
              </label>
              <textarea
                id="action-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Enter reason"
                rows={4}
                required
                className="w-full px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface resize-y"
              />
              {error ? <p className="text-sm text-error">{error}</p> : null}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetDialog}
                disabled={isPending}
                className="px-4 py-2 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isPending}
                className={`px-4 py-2 rounded-xl font-medium hover:opacity-90 disabled:opacity-60 ${confirmClassName}`}
              >
                {isPending ? 'Working...' : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
