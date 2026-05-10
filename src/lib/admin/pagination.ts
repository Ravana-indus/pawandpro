import type { AdminPaginationInput, AdminSortInput } from "./types"

const DEFAULT_PER_PAGE = 25
const MAX_PER_PAGE = 100

export function parseAdminPagination(input: AdminPaginationInput = {}) {
  const page = Math.max(1, Number(input.page) || 1)
  const requestedPerPage = Number(input.perPage) || DEFAULT_PER_PAGE
  const perPage = Math.min(MAX_PER_PAGE, Math.max(1, requestedPerPage))
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  return { page, perPage, from, to }
}

export function totalPages(total: number, perPage: number) {
  return Math.max(1, Math.ceil(total / perPage))
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
