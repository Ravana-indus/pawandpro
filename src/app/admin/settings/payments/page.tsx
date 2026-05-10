import React from "react"
import { EntityHeader } from "@/components/admin/EntityHeader"

interface InfoCardProps {
  label: string
  value: string
  icon: string
}

function InfoCard({ label, value, icon }: InfoCardProps) {
  return (
    <div className="bg-surface-container-low rounded-2xl border border-outline-variant/20 p-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="material-symbols-outlined text-on-surface-variant">{icon}</span>
        <span className="text-sm text-on-surface-variant">{label}</span>
      </div>
      <p className="text-2xl font-bold text-on-surface">{value}</p>
    </div>
  )
}

function getNextPayoutDate(): string {
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return nextMonth.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

export default function PaymentsSettingsPage() {
  return (
    <div className="space-y-6">
      <EntityHeader
        title="Payment Settings"
        subtitle="Payment platform configuration"
        backHref="/admin/settings"
        backLabel="All Settings"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard label="Commission Rate" value="5%" icon="percent" />
        <InfoCard label="Payout Schedule" value="Monthly" icon="calendar_month" />
        <InfoCard label="Payment Gateway" value="Stripe" icon="credit_card" />
        <InfoCard label="Next Payout Date" value={getNextPayoutDate()} icon="payments" />
      </div>
    </div>
  )
}