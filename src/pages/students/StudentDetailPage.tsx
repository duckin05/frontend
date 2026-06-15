import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useStudent } from "../../hooks/useStudent"
import { ROUTES } from "../../constants/routes"
import { formatDateTime } from "../../utils/format"

export function StudentDetailPage() {
  const { ma_sv } = useParams<{ ma_sv: string }>()
  const navigate = useNavigate()
  const { student, isLoading, error, fetchStudent } = useStudent()

  useEffect(() => {
    if (ma_sv) {
      fetchStudent(ma_sv)
    }
  }, [ma_sv, fetchStudent])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <span className="text-4xl">⚠️</span>
        <p className="text-base-content/60 text-sm">{error}</p>
        <div className="flex gap-3">
          <button onClick={() => ma_sv && fetchStudent(ma_sv)} className="btn btn-primary btn-sm">
            Thử lại
          </button>
          <button onClick={() => navigate(ROUTES.STUDENTS)} className="btn btn-ghost btn-sm">
            Quay lại
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-base-300 rounded mb-2" />
          <div className="h-4 w-64 bg-base-300 rounded" />
        </div>
        <div className="card bg-base-100 border border-base-300/30 shadow-sm">
          <div className="card-body p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-3 w-20 bg-base-300 rounded mb-2" />
                  <div className="h-5 w-40 bg-base-300 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <span className="text-4xl">🔍</span>
        <h2 className="text-lg font-semibold">Không tìm thấy sinh viên</h2>
        <p className="text-sm text-base-content/60">Mã sinh viên "{ma_sv}" không tồn tại trong hệ thống.</p>
        <button onClick={() => navigate(ROUTES.STUDENTS)} className="btn btn-primary btn-sm mt-2">
          Quay lại danh sách
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">👤 Chi tiết sinh viên</h1>
          <p className="text-sm text-base-content/60 mt-1">
            Thông tin chi tiết của sinh viên {student.ten}
          </p>
        </div>
        <button onClick={() => navigate(ROUTES.STUDENTS)} className="btn btn-ghost btn-sm">
          ← Quay lại
        </button>
      </div>

      {/* Info Card */}
      <div className="card bg-base-100 border border-base-300/30 shadow-sm">
        <div className="card-body p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">
                Mã sinh viên
              </span>
              <p className="text-lg font-mono font-bold mt-1">{student.ma_sv}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">
                Họ tên
              </span>
              <p className="text-lg font-medium mt-1">{student.ten}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">
                Lớp
              </span>
              <p className="text-lg font-medium mt-1">
                <span className="badge badge-primary badge-lg">{student.lop}</span>
              </p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">
                Người tạo
              </span>
              <p className="text-lg font-medium mt-1">{student.created_by || "Hệ thống"}</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">
                Thời gian tạo
              </span>
              <p className="text-base font-mono mt-1 text-base-content/60">
                {formatDateTime(student.timestamp)}
              </p>
            </div>
            {student.index !== undefined && (
              <div>
                <span className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">
                  Block Index
                </span>
                <p className="text-lg font-mono font-bold mt-1 text-primary">#{student.index}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Blockchain Info */}
      {student.hash && (
        <div className="card bg-base-100 border border-base-300/30 shadow-sm">
          <div className="card-body p-6">
            <h3 className="card-title text-base font-semibold mb-4">⛓️ Thông tin Blockchain</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">Hash</span>
                <p className="text-xs font-mono mt-1 text-base-content/60 break-all">{student.hash}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">Previous Hash</span>
                <p className="text-xs font-mono mt-1 text-base-content/40 break-all">{student.previous_hash}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
