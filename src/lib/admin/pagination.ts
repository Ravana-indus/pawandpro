import type { AdminPaginationInput, AdminSortInput } from "./types"

const DEFAULT_PER_PAGE = 25
const MAX_PER_PAGE = 100

function parseFinitePositiveInt(value: string | number | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) && Number.isInteger(value) && value > 0
      ? value
      : undefined
  }

  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!/^\d+$/.test(trimmed)) {
      return undefined
    }

    const parsed = Number(trimmed)
    return Number.isFinite(parsed) && Number.isInteger(parsed) && parsed > 0
      ? parsed
      : undefined
  }

  return undefined
}

export function parseAdminPagination(input: AdminPaginationInput = {}) {
  const page = parseFinitePositiveInt(input.page) ?? 1
  const requestedPerPage =
    parseFinitePositiveInt(input.perPage) ?? DEFAULT_PER_PAGE
  const perPage = Math.min(MAX_PER_PAGE, requestedPerPage)
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  return { page, perPage, from, to }
}

export function totalPages(total: number, perPage: number) {
  if (!Number.isFinite(perPage) || perPage <= 0) {
    return 1
  }

  const safeTotal = Number.isFinite(total) && total > 0 ? total : 0
  return Math.max(1, Math.ceil(safeTotal / perPage))
}

export function parseAdminSort<TSort extends string>(
  inputSort: AdminSortInput["sort"],
  allowedSorts: readonly TSort[],
  fallbackSort: TSort,
) {
  if (typeof inputSort !== "string") {
    return fallbackSort
  }

  return allowedSorts.includes(inputSort as TSort)
    ? (inputSort as TSort)
    : fallbackSort
}
