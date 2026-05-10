import { describe, expect, it, vi } from "vitest"

import { writeAdminAuditLog } from "./audit"

describe("writeAdminAuditLog", () => {
  it("writes to audit_logs with actor_id and normalized details payload", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null })
    const from = vi.fn().mockReturnValue({ insert })
    const supabase = { from }

    await writeAdminAuditLog(supabase, {
      actorId: "actor-123",
      action: "update_user",
      targetType: "profiles",
      targetId: "profile-1",
      reason: "correcting typo",
      before: { full_name: "Old Name" },
      after: { full_name: "New Name" },
      metadata: { fieldCount: 1 },
    })

    expect(from).toHaveBeenCalledWith("audit_logs")
    expect(insert).toHaveBeenCalledWith({
      actor_id: "actor-123",
      action: "update_user",
      target_type: "profiles",
      target_id: "profile-1",
      details: {
        reason: "correcting typo",
        before: { full_name: "Old Name" },
        after: { full_name: "New Name" },
        source: "admin",
        fieldCount: 1,
      },
    })
  })
})
