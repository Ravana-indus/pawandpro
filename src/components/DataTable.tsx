"use client"

import React, { useState } from "react"

interface Column {
  key: string
  label: string
  sortable?: boolean
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: Record<string, unknown>[]
  pagination?: {
    page: number
    perPage: number
    total: number
    onPageChange: (page: number) => void
  }
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  actions?: (row: Record<string, unknown>) => React.ReactNode
  selectable?: boolean
  onSelect?: (selectedIds: string[]) => void
}

export function DataTable({
  columns,
  data,
  pagination,
  onSort,
  sortKey,
  sortDirection,
  actions,
  selectable,
  onSelect,
}: DataTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(data.map(row => row.id as string))
      onSelect?.(data.map(row => row.id as string))
    } else {
      setSelectedIds([])
      onSelect?.([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = checked 
      ? [...selectedIds, id]
      : selectedIds.filter(s => s !== id)
    setSelectedIds(newSelected)
    onSelect?.(newSelected)
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-outline-variant/20">
      <table className="w-full">
        <thead>
          <tr className="bg-surface-container-low">
            {selectable && (
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length === data.length && data.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded"
                />
              </th>
            )}
            {columns.map(col => (
              <th 
                key={col.key}
                className={`px-4 py-3 text-left text-sm font-medium text-on-surface-variant ${
                  col.sortable ? 'cursor-pointer hover:bg-surface-container-high' : ''
                }`}
                onClick={() => col.sortable && onSort?.(col.key, sortDirection === 'asc' ? 'desc' : 'asc')}
              >
                <div className="flex items-center gap-2">
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    <span className="material-symbols-outlined text-xs">
                      {sortDirection === 'asc' ? 'expand_less' : 'expand_more'}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {actions && <th className="px-4 py-3 text-right text-sm font-medium text-on-surface-variant">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr 
              key={row.id as string || idx}
              className="border-t border-outline-variant/10 hover:bg-surface-container-low"
            >
              {selectable && (
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id as string)}
                    onChange={(e) => handleSelectRow(row.id as string, e.target.checked)}
                    className="rounded"
                  />
                </td>
              )}
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 text-sm text-on-surface">
                  {col.render 
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? '')}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-3 text-right">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 bg-surface-container-low border-t border-outline-variant/10">
          <span className="text-sm text-on-surface-variant">
            Showing {((pagination.page - 1) * pagination.perPage) + 1} to {Math.min(pagination.page * pagination.perPage, pagination.total)} of {pagination.total}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 rounded-lg hover:bg-surface-container-high disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page * pagination.perPage >= pagination.total}
              className="px-3 py-1 rounded-lg hover:bg-surface-container-high disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}