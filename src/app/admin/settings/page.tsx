import React from "react"
import Link from "next/link"

export default async function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
          Settings
        </h1>
        <p className="text-on-surface-variant">Configure platform settings and admin management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/settings/platform"
          className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 hover:border-primary/50 transition-colors"
        >
          <span className="material-symbols-outlined text-3xl text-primary mb-3">settings</span>
          <h3 className="text-lg font-bold text-on-surface mb-1">Platform Settings</h3>
          <p className="text-sm text-on-surface-variant">Site name, logo, email templates, auto-moderation rules</p>
        </Link>

        <Link
          href="/admin/settings/admins"
          className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 hover:border-primary/50 transition-colors"
        >
          <span className="material-symbols-outlined text-3xl text-tertiary mb-3">manage_accounts</span>
          <h3 className="text-lg font-bold text-on-surface mb-1">Admin Management</h3>
          <p className="text-sm text-on-surface-variant">Invite admins, manage permissions</p>
        </Link>

        <Link
          href="/admin/settings/permissions"
          className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 hover:border-primary/50 transition-colors"
        >
          <span className="material-symbols-outlined text-3xl text-secondary mb-3">security</span>
          <h3 className="text-lg font-bold text-on-surface mb-1">Role Permissions</h3>
          <p className="text-sm text-on-surface-variant">Configure role-permission matrix</p>
        </Link>

        <Link
          href="/admin/settings/payments"
          className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 hover:border-primary/50 transition-colors"
        >
          <span className="material-symbols-outlined text-3xl text-warning mb-3">payments</span>
          <h3 className="text-lg font-bold text-on-surface mb-1">Payment Settings</h3>
          <p className="text-sm text-on-surface-variant">Commission rates, payout schedules</p>
        </Link>
      </div>
    </div>
  )
}