import React from "react"
import { notFound } from "next/navigation"
import { EntityHeader } from "@/components/admin/EntityHeader"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { AuditTimeline } from "@/components/admin/AuditTimeline"
import { DetailSection } from "@/components/admin/DetailSection"
import { getAdminProviderDetail } from "@/lib/admin/queries/services"
import { updateAdminProviderVerification } from "@/lib/admin/mutations/services"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProviderDetailPage({ params }: PageProps) {
  const { id } = await params
  const { data: provider, error } = await getAdminProviderDetail(id)

  if (error || !provider) {
    notFound()
  }

  const nextVerificationState = !provider.is_verified
  const memberSince = provider.profile?.created_at
    ? new Date(provider.profile.created_at).toLocaleDateString()
    : 'Unknown'

  async function updateVerificationAction(formData: FormData) {
    "use server"
    const reason = String(formData.get("reason") || "")
    await updateAdminProviderVerification(id, nextVerificationState, reason)
  }

  return (
    <div className="space-y-6">
      <EntityHeader
        title={provider.profile?.full_name || 'Service Provider'}
        subtitle={`${provider.service_type} • ${provider.specialization || 'General'}`}
        backHref="/admin/services/providers"
        backLabel="← Back to Providers"
      />

      <DetailSection title="Provider Details" description="Operational profile and verification state.">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-on-surface-variant">Service Type</label>
            <p className="text-lg font-medium text-on-surface">{provider.service_type}</p>
          </div>
          <div>
            <label className="text-sm text-on-surface-variant">Specialization</label>
            <p className="text-lg font-medium text-on-surface">{provider.specialization || 'General'}</p>
          </div>
          <div>
            <label className="text-sm text-on-surface-variant">Service Fee</label>
            <p className="text-lg font-medium text-on-surface">
              {provider.service_fee ? `$${Number(provider.service_fee).toFixed(2)}` : 'N/A'}
            </p>
          </div>
          <div>
            <label className="text-sm text-on-surface-variant">Verified Status</label>
            <div className="mt-1">
              <StatusBadge status={provider.is_verified ? 'verified' : 'pending'} />
            </div>
          </div>
          <div>
            <label className="text-sm text-on-surface-variant">Available Now</label>
            <p className="text-lg font-medium text-on-surface">
              {provider.is_available_now ? 'Yes' : 'No'}
            </p>
          </div>
          <div>
            <label className="text-sm text-on-surface-variant">Member Since</label>
            <p className="text-lg font-medium text-on-surface">
              {memberSince}
            </p>
          </div>
        </div>

        <div className="border-t border-outline-variant pt-4 mt-4">
          <h3 className="text-sm text-on-surface-variant mb-3">Profile Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-on-surface-variant">Full Name</label>
              <p className="text-lg font-medium text-on-surface">
                {provider.profile?.full_name || 'N/A'}
              </p>
            </div>
            <div>
              <label className="text-sm text-on-surface-variant">Email</label>
              <p className="text-lg font-medium text-on-surface">
                {provider.profile?.contact_email || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </DetailSection>

      <DetailSection
        title={provider.is_verified ? "Unverify Provider" : "Verify Provider"}
        description="Verification changes require an audit reason."
      >
        <form action={updateVerificationAction} className="space-y-3">
          <label htmlFor="provider-reason" className="block text-sm font-medium text-on-surface">
            Reason
          </label>
          <textarea
            id="provider-reason"
            name="reason"
            required
            minLength={3}
            maxLength={500}
            placeholder="Document why this verification status is being changed"
            className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-high px-3 py-2 text-sm text-on-surface"
            rows={4}
          />
          <button
            type="submit"
            className={`rounded-xl px-4 py-2 text-sm font-medium ${
              provider.is_verified
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
          >
            {provider.is_verified ? "Unverify Provider" : "Verify Provider"}
          </button>
        </form>
      </DetailSection>

      <DetailSection title="Audit Timeline" description="Recent administrative actions for this provider.">
        <AuditTimeline targetType="service_provider_details" targetId={provider.id} />
      </DetailSection>
    </div>
  )
}
