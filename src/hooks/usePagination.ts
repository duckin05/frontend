import { useMemo } from "react"
export function usePagination(total: number, currentPage: number, pageSize: number) {
  const totalPages = Math.ceil(total / pageSize)
  const pages = useMemo(() => {
    const result: number[] = []
    const start = Math.max(1, currentPage - 2)
    const end = Math.min(totalPages, currentPage + 2)
    for (let i = start; i <= end; i++) result.push(i)
    return result
  }, [currentPage, totalPages])
  return { totalPages, pages, hasNext: currentPage < totalPages, hasPrev: currentPage > 1 }
}
