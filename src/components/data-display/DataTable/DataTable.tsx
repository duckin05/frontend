import { useNavigate, Link } from "react-router-dom"
import { useDataTable } from "./useDataTable"
import type { IStudent } from "../../../types"
import { formatDateTime } from "../../../utils/format"
import { ROUTES } from "../../../constants/routes"
import { useExcel } from "../../../hooks/useExcel"

interface DataTableProps {
  data: IStudent[]
  isLoading: boolean
  onAddStudent: () => void
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function DataTable({
  data,
  isLoading,
  onAddStudent,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: DataTableProps) {
  const navigate = useNavigate()
  const { exportExcel } = useExcel()
  const {
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
    filteredData,
  } = useDataTable(data)

  const totalPages = Math.ceil(total / pageSize)

  const SortHeader = ({ label, sortKey }: { label: string; sortKey: string }) => (
    <th
      className="cursor-pointer hover:text-primary transition-colors select-none"
      onClick={() =>
        setSorting({
          key: sortKey,
          direction:
            sorting.key === sortKey && sorting.direction === "asc" ? "desc" : "asc",
        })
      }
    >
      <div className="flex items-center gap-1">
        {label}
        {sorting.key === sortKey && (
          <span className="text-xs">{sorting.direction === "asc" ? "▲" : "▼"}</span>
        )}
      </div>
    </th>
  )

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          {/* Search */}
          <label className="input input-bordered input-sm flex items-center gap-2 w-56">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
            <input
              type="text"
              className="grow"
              placeholder="Tìm mã SV, tên, lớp..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </label>

          {/* Filter by Class */}
          <select
            className="select select-bordered select-sm"
            value={filterLop}
            onChange={(e) => setFilterLop(e.target.value)}
          >
            <option value="">Tất cả lớp</option>
            {uniqueClasses.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={exportExcel} className="btn btn-ghost btn-sm">📥 Export</button>
          <button onClick={() => navigate(ROUTES.IMPORT)} className="btn btn-ghost btn-sm">📁 Import</button>
          <button onClick={onAddStudent} className="btn btn-primary btn-sm">
            ＋ Thêm sinh viên
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2 mb-3 bg-primary/5 border border-primary/20 rounded-lg text-sm">
          <span className="font-medium">Đã chọn {selected.size} sinh viên</span>
          <button onClick={clearSelection} className="btn btn-ghost btn-xs">
            Bỏ chọn
          </button>
          <div className="flex-1" />
          <button onClick={exportExcel} className="btn btn-ghost btn-xs">📥 Export</button>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="w-10">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={selected.size === filteredData.length && filteredData.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <SortHeader label="Mã SV" sortKey="ma_sv" />
              <SortHeader label="Họ tên" sortKey="ten" />
              <SortHeader label="Lớp" sortKey="lop" />
              <SortHeader label="Thời gian" sortKey="timestamp" />
              <th className="w-20"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6}>
                  <div className="space-y-3 py-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex gap-4 animate-pulse">
                        <div className="h-4 w-8 bg-base-300 rounded" />
                        <div className="h-4 w-24 bg-base-300 rounded" />
                        <div className="h-4 w-32 bg-base-300 rounded flex-1" />
                        <div className="h-4 w-20 bg-base-300 rounded" />
                        <div className="h-4 w-28 bg-base-300 rounded" />
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-base-content/40">
                  {globalFilter
                    ? "Không tìm thấy kết quả phù hợp"
                    : "Chưa có sinh viên nào. Hãy thêm sinh viên đầu tiên!"}
                </td>
              </tr>
            ) : (
              filteredData.map((student) => (
                <tr
                  key={student.ma_sv}
                  className={`hover:bg-base-200/50 cursor-pointer ${selected.has(student.ma_sv) ? "bg-primary/5" : ""}`}
                  onClick={() => navigate(ROUTES.STUDENT_DETAIL(student.ma_sv))}
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={selected.has(student.ma_sv)}
                      onChange={() => toggleSelect(student.ma_sv)}
                    />
                  </td>
                  <td className="font-mono text-sm">{student.ma_sv}</td>
                  <td className="font-medium">{student.ten}</td>
                  <td>{student.lop}</td>
                  <td className="text-sm text-base-content/60">{formatDateTime(student.timestamp)}</td>
                  <td>
                    <Link
                      to={ROUTES.STUDENT_DETAIL(student.ma_sv)}
                      className="btn btn-ghost btn-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Xem
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="card bg-base-100 border border-base-300/30 p-4 animate-pulse">
              <div className="h-4 w-32 bg-base-300 rounded mb-2" />
              <div className="h-4 w-24 bg-base-300 rounded" />
            </div>
          ))
        ) : filteredData.length === 0 ? (
          <div className="text-center py-12 text-base-content/40">
            {globalFilter ? "Không tìm thấy kết quả" : "Chưa có sinh viên"}
          </div>
        ) : (
          filteredData.map((student) => (
            <Link
              key={student.ma_sv}
              to={ROUTES.STUDENT_DETAIL(student.ma_sv)}
              className="card bg-base-100 border border-base-300/30 p-4 block hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm mt-1"
                  checked={selected.has(student.ma_sv)}
                  onChange={(e) => {
                    e.preventDefault()
                    toggleSelect(student.ma_sv)
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{student.ten}</span>
                    <span className="text-xs text-base-content/50">{student.lop}</span>
                  </div>
                  <p className="text-xs text-base-content/40 mt-1 truncate">
                    {student.ma_sv} · {formatDateTime(student.timestamp)}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
        <div className="flex items-center gap-2 text-sm text-base-content/50">
          <span>Hiển thị {Math.min(page * pageSize + 1, total)}-{Math.min((page + 1) * pageSize, total)} / {total}</span>
          <select
            className="select select-bordered select-xs"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="join">
          <button
            className="join-item btn btn-sm"
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`join-item btn btn-sm ${page === i ? "btn-primary" : ""}`}
              onClick={() => onPageChange(i)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="join-item btn btn-sm"
            disabled={page >= totalPages - 1}
            onClick={() => onPageChange(page + 1)}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
}
