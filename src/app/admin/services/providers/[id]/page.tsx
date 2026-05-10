import React from "react"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EntityHeader } from "@/components/admin/EntityHeader"
import { StatusBadge } from "@/components/admin/StatusBadge"
import { VerifyToggleButton } from "./VerifyToggleButton"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProviderDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: provider, error } = await supabase
    .from('service_provider_details')
    .select(`
      *,
      profile:profiles!service_provider_details_profile_id_fkey (
        id,
        full_name,
        contact_email
      )
    `)
    .eq('id', id)
    .single()

  if (error || !provider) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <EntityHeader
        title={provider.profile?.full_name || 'Service Provider'}
        subtitle={`${provider.service_type} • ${provider.specialization || 'General'}`}
        backHref="/admin/services/providers"
        backLabel="← Back to Providers"
      />

      <div className="bg-surface rounded-xl border border-outline-variant p-6 space-y-4">
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
              {new Date(provider.created_at).toLocaleDateString()}
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

        <div className="flex justify-end pt-4">
          <VerifyToggleButton
            providerId={provider.id}
            isVerified={provider.is_verified}
          />
        </div>
      </div>
    </div>
  )
}