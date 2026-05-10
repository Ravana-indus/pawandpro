"use client"

import React, { useState } from "react"

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  showNotes?: boolean
  notesPlaceholder?: string
  onConfirm: (notes?: string) => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  showNotes = false,
  notesPlaceholder = 'Add notes (optional)',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [notes, setNotes] = useState('')

  if (!open) return null

  const variantClasses = {
    danger: 'bg-error text-on-error',
    warning: 'bg-warning text-on-warning',
    info: 'bg-primary text-on-primary',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-surface-container-lowest p-6 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-on-surface mb-2">{title}</h3>
        <p className="text-on-surface-variant mb-4">{message}</p>
        {showNotes && (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={notesPlaceholder}
            className="w-full px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20 mb-4 resize-none"
            rows={3}
          />
        )}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl hover:bg-surface-container-low font-medium"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => onConfirm(notes)}
            className={`px-4 py-2 rounded-xl font-medium hover:opacity-90 ${variantClasses[variant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}