import React from "react"
import { KPICard } from "@/components/KPICard"
import { getAnalyticsDashboard } from "@/lib/queries/admin"

export default async function AdminDashboardPage() {
  const metrics = await getAnalyticsDashboard()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
          Dashboard
        </h1>
        <p className="text-on-surface-variant">Platform overview and key metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Users"
          value={metrics.totalUsers}
          change={{ value: 12, type: 'increase' }}
          icon="people"
          color="primary"
        />
        <KPICard
          title="Users Today"
          value={metrics.usersToday}
          icon="person_add"
          color="primary"
        />
        <KPICard
          title="Total Orders"
          value={metrics.totalOrders}
          change={{ value: 8, type: 'increase' }}
          icon="shopping_cart"
          color="secondary"
        />
        <KPICard
          title="Orders Today"
          value={metrics.ordersToday}
          icon="receipt"
          color="secondary"
        />
        <KPICard
          title="Pending Verifications"
          value={metrics.pendingVerifications}
          icon="verified_user"
          color="tertiary"
        />
        <KPICard
          title="Moderation Queue"
          value={metrics.openModeration}
          icon="flag"
          color="error"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
        <h2 className="text-lg font-bold text-on-surface mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/verifications"
            className="px-4 py-2 rounded-xl bg-tertiary/10 text-tertiary font-medium hover:bg-tertiary/20 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Review Verifications
          </a>
          <a
            href="/admin/community/queue"
            className="px-4 py-2 rounded-xl bg-error/10 text-error font-medium hover:bg-error/20 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">flag</span>
            Moderate Content
          </a>
          <a
            href="/admin/users"
            className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-medium hover:bg-primary/20 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">manage_accounts</span>
            Manage Users
          </a>
          <a
            href="/admin/audit-logs"
            className="px-4 py-2 rounded-xl bg-secondary/10 text-secondary font-medium hover:bg-secondary/20 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">history</span>
            View Audit Logs
          </a>
        </div>
      </div>

      {/* Recent Activity would go here - placeholder */}
      <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
        <h2 className="text-lg font-bold text-on-surface mb-4">Recent Activity</h2>
        <div className="text-on-surface-variant text-sm">
          Activity feed will appear here once audit logs are populated.
        </div>
      </div>
    </div>
  )
}