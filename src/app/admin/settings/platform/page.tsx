import React from "react"
import { EntityHeader } from "@/components/admin/EntityHeader"

interface SettingRowProps {
  label: string
  value: React.ReactNode
}

function SettingRow({ label, value }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-outline-variant/20 last:border-0">
      <span className="text-sm text-on-surface-variant">{label}</span>
      <span className="text-sm font-medium text-on-surface">{value}</span>
    </div>
  )
}

function ToggleDisplay({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
        enabled
          ? "bg-tertiary-container text-on-tertiary-container"
          : "bg-surface-container-high text-on-surface-variant"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${enabled ? "bg-tertiary" : "bg-outline"}`} />
      {enabled ? "Enabled" : "Disabled"}
    </span>
  )
}

const platformConfig = {
  siteName: process.env.NEXT_PUBLIC_PLATFORM_NAME || "PawsAndPro",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@pawsandpro.com",
  maintenanceMode: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true",
  registrationEnabled: process.env.NEXT_PUBLIC_REGISTRATION_ENABLED !== "false",
  requireEmailVerification: process.env.NEXT_PUBLIC_REQUIRE_EMAIL_VERIFICATION === "true",
}

export default function PlatformSettingsPage() {
  return (
    <div className="space-y-6">
      <EntityHeader
        title="Platform Settings"
        subtitle="View platform configuration"
        backHref="/admin/settings"
        backLabel="All Settings"
      />

      <div className="bg-surface-container-low rounded-2xl border border-outline-variant/20 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/20">
          <h2 className="text-lg font-bold text-on-surface">General Settings</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            These settings are managed via environment variables or a future settings database.
          </p>
        </div>
        <div className="p-6">
          <SettingRow label="Site Name" value={platformConfig.siteName} />
          <SettingRow label="Support Email" value={platformConfig.supportEmail} />
          <SettingRow label="Maintenance Mode" value={<ToggleDisplay enabled={platformConfig.maintenanceMode} />} />
          <SettingRow label="Registration Enabled" value={<ToggleDisplay enabled={platformConfig.registrationEnabled} />} />
          <SettingRow label="Require Email Verification" value={<ToggleDisplay enabled={platformConfig.requireEmailVerification} />} />
        </div>
      </div>
    </div>
  )
}