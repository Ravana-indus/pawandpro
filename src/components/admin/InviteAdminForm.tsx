'use client'

import React, { useTransition } from 'react'
import { EntityForm } from '@/components/admin/EntityForm'
import { FormField } from '@/components/admin/FormField'
import { inviteAdmin } from '@/lib/admin/mutations/platform'
import { useRouter } from 'next/navigation'

function toast(message: string) {
  alert(message)
}

export function InviteAdminForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  async function handleInvite(formData: FormData) {
    const email = formData.get('email') as string
    const role = formData.get('role') as string

    const result = await inviteAdmin(email, role)

    if (result.success) {
      toast('Admin invitation sent')
      startTransition(() => router.refresh())
      return { success: true }
    } else {
      return { success: false, error: result.error || 'Failed to send invitation' }
    }
  }

  return (
    <EntityForm action={handleInvite} submitLabel="Send Invitation">
      <FormField
        label="Email"
        name="email"
        type="email"
        required
      />
      <FormField
        label="Role"
        name="role"
        type="select"
        defaultValue="ADMIN"
        options={[
          { value: 'ADMIN', label: 'Admin' },
          { value: 'SUPER_ADMIN', label: 'Super Admin' },
        ]}
        required
      />
    </EntityForm>
  )
}
