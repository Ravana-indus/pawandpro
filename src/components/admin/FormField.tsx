'use client'

import React from 'react'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox'
  defaultValue?: string | number | boolean
  options?: { value: string; label: string }[]
  error?: string
  required?: boolean
}

export function FormField({ label, name, type = 'text', defaultValue, options, error, required }: FormFieldProps) {
  const baseClass = "w-full px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/50"

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-on-surface">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea name={name} defaultValue={String(defaultValue || '')} className={`${baseClass} min-h-[100px]`} />
      ) : type === 'select' ? (
        <select name={name} defaultValue={String(defaultValue || '')} className={baseClass}>
          {options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      ) : type === 'checkbox' ? (
        <input type="checkbox" name={name} defaultChecked={!!defaultValue} className="rounded" />
      ) : (
        <input
          type={type}
          name={name}
          defaultValue={String(defaultValue || '')}
          className={baseClass}
        />
      )}
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
}
