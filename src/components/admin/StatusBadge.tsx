'use client'

import React from 'react'

const statusMap: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
  banned: { bg: 'bg-red-100', text: 'text-red-700', label: 'Banned' },
  verified: { bg: 'bg-green-100', text: 'text-green-700', label: 'Verified' },
  unverified: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Unverified' },
  approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
  dismissed: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Dismissed' },
  removed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Removed' },
  reviewed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Reviewed' },
  Processing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Processing' },
  'In Transit': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'In Transit' },
  Delivered: { bg: 'bg-green-100', text: 'text-green-700', label: 'Delivered' },
  Cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
  Available: { bg: 'bg-green-100', text: 'text-green-700', label: 'Available' },
  Sold: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Sold' },
  Gold: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Gold' },
  Silver: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Silver' },
}

export function StatusBadge({ status }: { status: string }) {
  const config = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-600', label: status }
  return (
    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}
