export interface AdminAuditInput {
  actorId: string
  action: string
  targetType: string
  targetId: string
  reason?: string
  before?: unknown
  after?: unknown
  metadata?: Record<string, unknown>
}

export type AdminAuditWriterClient = {
  from: (table: string) => {
    insert: (values: Record<string, unknown>) => PromiseLike<unknown> | unknown
  }
}

export async function writeAdminAuditLog(
  supabase: AdminAuditWriterClient,
  input: AdminAuditInput,
) {
  const response = await supabase.from("audit_logs").insert({
    actor_id: input.actorId,
    action: input.action,
    target_type: input.targetType,
    target_id: input.targetId,
    details: {
      reason: input.reason ?? null,
      before: input.before ?? null,
      after: input.after ?? null,
      source: "admin",
      ...(input.metadata ?? {}),
    },
  })

  const { error } = response as { error?: { message?: string } | null }
  if (error) {
    throw new Error(error.message ?? "Failed to write admin audit log")
  }
}
