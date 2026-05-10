import React from 'react'
import { createClient } from '@/lib/supabase/server'

type AuditEntry = {
  id: string
  action: string
  created_at: string | null
  details: unknown
  actor: {
    full_name: string | null
    contact_email: string | null
  } | null
}

function getReason(details: unknown) {
  if (!details || typeof details !== 'object' || Array.isArray(details)) {
    return null
  }

  const reason = (details as Record<string, unknown>).reason
  return typeof reason === 'string' && reason.trim() ? reason : null
}

export async function AuditTimeline({
  targetType,
  targetId,
  limit = 20,
}: {
  targetType: string
  targetId: string
  limit?: number
}) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('audit_logs')
    .select('id, action, created_at, details, actor:profiles!audit_logs_actor_id_fkey(full_name, contact_email)')
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    return <p className="text-sm text-error">Failed to load audit history: {error.message}</p>
  }

  const entries = (data ?? []) as AuditEntry[]
  if (entries.length === 0) {
    return <p className="text-sm text-on-surface-variant">No audit entries yet.</p>
  }

  return (
    <ol className="space-y-3">
      {entries.map((entry) => {
        const reason = getReason(entry.details)
        const actorName = entry.actor?.full_name || entry.actor?.contact_email || 'Unknown admin'
        return (
          <li key={entry.id} className="rounded-xl border border-outline-variant/20 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-on-surface">{entry.action}</p>
              <p className="text-xs text-on-surface-variant">
                {entry.created_at ? new Date(entry.created_at).toLocaleString() : 'Unknown time'}
              </p>
            </div>
            <p className="text-sm text-on-surface-variant mt-1">By {actorName}</p>
            {reason ? <p className="text-sm text-on-surface mt-2">Reason: {reason}</p> : null}
          </li>
        )
      })}
    </ol>
  )
}
