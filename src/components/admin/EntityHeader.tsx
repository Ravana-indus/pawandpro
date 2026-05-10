'use client'

import React from 'react'
import Link from 'next/link'

interface EntityHeaderProps {
  title: string
  subtitle?: string
  backHref: string
  backLabel?: string
  actions?: React.ReactNode
}

export function EntityHeader({ title, subtitle, backHref, backLabel = 'Back', actions }: EntityHeaderProps) {
  return (
    <div className="space-y-4">
      <Link href={backHref} className="text-sm text-on-surface-variant hover:text-primary flex items-center gap-1">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        {backLabel}
      </Link>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">{title}</h1>
          {subtitle && <p className="text-on-surface-variant mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </div>
  )
}
