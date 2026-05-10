"use client"

import React from "react"
import { linkVetToHospital } from "@/lib/actions/admin"
import { useRouter } from "next/navigation"

interface LinkHospitalFormProps {
  vetId: string
  hospitals: { id: string; name: string }[]
  currentHospitalId?: string
}

export function LinkHospitalForm({ vetId, hospitals, currentHospitalId }: LinkHospitalFormProps) {
  const router = useRouter()

  async function handleLink(formData: FormData) {
    const hospitalId = formData.get("hospitalId") as string
    const result = await linkVetToHospital(vetId, hospitalId)
    if (result.success) {
      router.refresh()
    }
  }

  return (
    <form action={handleLink} className="flex items-center gap-3">
      <select
        name="hospitalId"
        required
        defaultValue={currentHospitalId || ""}
        className="px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <option value="">Select a hospital...</option>
        {hospitals.map((h) => (
          <option key={h.id} value={h.id}>{h.name}</option>
        ))}
      </select>
      <button
        type="submit"
        className="px-4 py-2 rounded-xl bg-primary text-on-primary font-medium hover:opacity-90"
      >
        Link Hospital
      </button>
    </form>
  )
}