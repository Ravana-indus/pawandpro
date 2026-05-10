import React from 'react'
import { getPendingVerifications } from '@/lib/queries/admin'
import { VerificationsPageClient } from '@/components/admin/VerificationsPageClient'

export default async function VerificationsPage() {
  const result = await getPendingVerifications()
  return <VerificationsPageClient data={result.data || []} total={result.data?.length || 0} />
}