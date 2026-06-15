import { useState, useMemo } from "react"
import type { IStudent } from "../../../types"

interface SortConfig {
  key: string
  direction: "asc" | "desc"
}

export function useDataTable(data: IStudent[]) {
  const [globalFilter, setGlobalFilter] = useState("")
  const [filterLop, setFilterLop] = useState("")
  const [sorting, setSorting] = useState<SortConfig>({
    key: "timestamp",
    direction: "desc",
  })
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const uniqueClasses = useMemo(() => {
    const classes = new Set(data.map((s) => s.lop).filter(Boolean))
    return Array.from(classes).sort()
  }, [data])

  const filtered = useMemo(() => {
    let result = data
    const q = globalFilter.toLowerCase()
    if (q) {
      result = result.filter(
        (s) =>
          s.ma_sv.toLowerCase().includes(q) ||
          s.ten.toLowerCase().includes(q) ||
          s.lop.toLowerCase().includes(q)
      )
    }
    if (filterLop) {
      result = result.filter((s) => s.lop === filterLop)
    }
    return result
  }, [data, globalFilter, filterLop])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      const aVal = (a as any)[sorting.key] || ""
      const bVal = (b as any)[sorting.key] || ""
      const cmp = String(aVal).localeCompare(String(bVal))
      return sorting.direction === "asc" ? cmp : -cmp
    })
    return arr
  }, [filtered, sorting])

  const toggleSelect = (ma_sv: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(ma_sv)) next.delete(ma_sv)
      else next.add(ma_sv)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === sorted.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(sorted.map((s) => s.ma_sv)))
    }
  }

  const clearSelection = () => setSelected(new Set())

  return {
    globalFilter,
    setGlobalFilter,
    filterLop,
    setFilterLop,
    uniqueClasses,
    sorting,
    setSorting,
    selected,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    filteredData: sorted,
  }
}
