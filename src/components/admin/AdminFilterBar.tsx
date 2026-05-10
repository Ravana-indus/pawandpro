"use client"

import React, { useTransition } from "react"
import { useRouter } from "next/navigation"

import type { AdminSortDirection } from "@/lib/admin/types"

export interface AdminFilterOption {
  value: string
  label: string
}

interface AdminFilterBarProps {
  basePath: string
  searchPlaceholder?: string
  statusOptions?: AdminFilterOption[]
  sortOptions: AdminFilterOption[]
  perPageOptions?: number[]
  defaults: {
    search?: string
    status?: string
    sort: string
    direction: AdminSortDirection
    perPage: number
  }
}

function parseDirection(value: FormDataEntryValue | null): AdminSortDirection {
  return value === "asc" ? "asc" : "desc"
}

export function AdminFilterBar({
  basePath,
  searchPlaceholder = "Search...",
  statusOptions = [],
  sortOptions,
  perPageOptions = [10, 25, 50, 100],
  defaults,
}: AdminFilterBarProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function updateQuery(formData: FormData) {
    const params = new URLSearchParams(window.location.search)
    const search = String(formData.get("search") ?? "").trim()
    const status = String(formData.get("status") ?? "").trim()
    const sort = String(formData.get("sort") ?? "").trim()
    const direction = parseDirection(formData.get("direction"))
    const perPage = String(formData.get("perPage") ?? "").trim()

    if (search) params.set("search", search)
    else params.delete("search")

    if (status) params.set("status", status)
    else params.delete("status")

    if (sort) params.set("sort", sort)
    else params.delete("sort")

    params.set("direction", direction)

    if (perPage) params.set("perPage", perPage)
    else params.delete("perPage")

    params.delete("page")

    const query = params.toString()
    router.push(query ? `${basePath}?${query}` : basePath)
  }

  return (
    <form
      action={(formData) => {
        startTransition(() => updateQuery(formData))
      }}
      className="grid gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low p-4 md:grid-cols-6"
    >
      <input
        name="search"
        type="search"
        defaultValue={defaults.search ?? ""}
        placeholder={searchPlaceholder}
        className="md:col-span-2 rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-3 py-2 text-sm"
      />

      {statusOptions.length > 0 ? (
        <select
          name="status"
          defaultValue={defaults.status ?? ""}
          className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}

      <select
        name="sort"
        defaultValue={defaults.sort}
        className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-3 py-2 text-sm"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        name="direction"
        defaultValue={defaults.direction}
        className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-3 py-2 text-sm"
      >
        <option value="desc">Newest / High to Low</option>
        <option value="asc">Oldest / Low to High</option>
      </select>

      <select
        name="perPage"
        defaultValue={String(defaults.perPage)}
        className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-3 py-2 text-sm"
      >
        {perPageOptions.map((value) => (
          <option key={value} value={value}>
            {value} / page
          </option>
        ))}
      </select>

      <div className="md:col-span-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary disabled:opacity-60"
        >
          Apply
        </button>
        <a
          href={basePath}
          className="rounded-lg border border-outline-variant/20 px-4 py-2 text-sm font-medium text-on-surface"
        >
          Reset
        </a>
      </div>
    </form>
  )
}
