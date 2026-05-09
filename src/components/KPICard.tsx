"use client"

import React from "react"

interface KPICardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon: string
  color?: 'primary' | 'secondary' | 'tertiary' | 'error'
}

export function KPICard({ title, value, change, icon, color = 'primary' }: KPICardProps) {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    tertiary: 'text-tertiary bg-tertiary/10',
    error: 'text-error bg-error/10',
  }

  return (
    <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            {icon}
          </span>
        </div>
        {change && (
          <span className={`text-sm font-medium ${change.type === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
            {change.type === 'increase' ? '+' : '-'}{change.value}%
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-on-surface mb-1">{value}</div>
      <div className="text-sm text-on-surface-variant">{title}</div>
    </div>
  )
}