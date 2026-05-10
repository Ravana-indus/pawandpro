'use client'

import React, { useState } from 'react'
import { EntityForm } from '@/components/admin/EntityForm'
import { FormField } from '@/components/admin/FormField'

function toast(message: string) {
  alert(message)
}

export function InviteAdminForm() {
  async function handleInvite(formData: FormData) {
    const email = formData.get('email') as string
    const role = formData.get('role') as string
    console.log('Invite:', { email, role })
    toast('Invitation sent')
    return { success: true }
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
