import Link from "next/link"

interface AdminPaginationProps {
  basePath: string
  page: number
  totalPages: number
  query?: Record<string, string | number | null | undefined>
}

function buildHref(
  basePath: string,
  page: number,
  query: Record<string, string | number | null | undefined>,
) {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") {
      continue
    }
    params.set(key, String(value))
  }

  params.set("page", String(page))
  const qs = params.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, currentPage])
  for (let i = currentPage - 2; i <= currentPage + 2; i += 1) {
    if (i > 1 && i < totalPages) {
      pages.add(i)
    }
  }
  return Array.from(pages).sort((a, b) => a - b)
}

export function AdminPagination({
  basePath,
  page,
  totalPages,
  query = {},
}: AdminPaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const visiblePages = getVisiblePages(page, totalPages)
  const prevPage = Math.max(1, page - 1)
  const nextPage = Math.min(totalPages, page + 1)

  return (
    <nav className="flex items-center justify-between gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-3">
      <Link
        href={buildHref(basePath, prevPage, query)}
        aria-disabled={page <= 1}
        className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
          page <= 1
            ? "pointer-events-none opacity-50"
            : "bg-surface-container-high hover:bg-surface-container-highest"
        }`}
      >
        Previous
      </Link>
      <div className="flex items-center gap-1">
        {visiblePages.map((visiblePage) => (
          <Link
            key={visiblePage}
            href={buildHref(basePath, visiblePage, query)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              visiblePage === page
                ? "bg-primary text-on-primary"
                : "bg-surface-container-high hover:bg-surface-container-highest"
            }`}
          >
            {visiblePage}
          </Link>
        ))}
      </div>
      <Link
        href={buildHref(basePath, nextPage, query)}
        aria-disabled={page >= totalPages}
        className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
          page >= totalPages
            ? "pointer-events-none opacity-50"
            : "bg-surface-container-high hover:bg-surface-container-highest"
        }`}
      >
        Next
      </Link>
    </nav>
  )
}
