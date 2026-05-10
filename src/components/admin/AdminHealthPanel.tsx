import React from "react"

interface HealthCheckItem {
  label: string
  description: string
  href: string
  status?: "ok" | "warning" | "error"
}

const healthChecks: HealthCheckItem[] = [
  {
    label: "Database Performance",
    description: "Review query performance and index usage",
    href: "#",
  },
  {
    label: "Security Advisors",
    description: "Check for security vulnerabilities and recommendations",
    href: "#",
  },
  {
    label: "RLS Policies",
    description: "Verify row-level security policies are properly configured",
    href: "#",
  },
  {
    label: "API Rate Limits",
    description: "Monitor API usage and throttling",
    href: "#",
  },
  {
    label: "Storage Buckets",
    description: "Check storage configuration and quotas",
    href: "#",
  },
  {
    label: "Edge Functions",
    description: "Review deployed edge functions and logs",
    href: "#",
  },
]

interface AdminHealthPanelProps {
  className?: string
}

export function AdminHealthPanel({ className = "" }: AdminHealthPanelProps) {
  return (
    <div
      className={`bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="material-symbols-outlined text-xl text-primary">
          health_and_safety
        </span>
        <h2 className="text-lg font-bold text-on-surface">Platform Health</h2>
      </div>
      <p className="text-on-surface-variant text-sm mb-4">
        Super admin checklist for monitoring platform health and security.
        Connect to Supabase dashboard for live advisor data.
      </p>
      <div className="space-y-3">
        {healthChecks.map((check) => (
          <a
            key={check.label}
            href={check.href}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-lg text-on-surface-variant mt-0.5">
              chevron_right
            </span>
            <div>
              <div className="font-medium text-on-surface text-sm">
                {check.label}
              </div>
              <div className="text-on-surface-variant text-xs">
                {check.description}
              </div>
            </div>
          </a>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-outline-variant/20">
        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:text-primary-container flex items-center gap-1"
        >
          Open Supabase Dashboard
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </a>
      </div>
    </div>
  )
}