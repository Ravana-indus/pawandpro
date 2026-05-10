import React from 'react'

interface DetailSectionProps {
  title: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
}

export function DetailSection({ title, description, actions, children }: DetailSectionProps) {
  return (
    <section className="bg-surface-container-lowest rounded-2xl p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-on-surface">{title}</h2>
          {description ? <p className="text-sm text-on-surface-variant mt-1">{description}</p> : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      {children}
    </section>
  )
}
