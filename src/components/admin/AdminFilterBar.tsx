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

export function AdminFilterBar({
  basePath,
  searchPlaceholder = "Search...",
  statusOptions = [],
  sortOptions,
  perPageOptions = [10, 25, 50, 100],
  defaults,
}: AdminFilterBarProps) {
  return (
    <form
      method="get"
      action={basePath}
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
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary"
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
