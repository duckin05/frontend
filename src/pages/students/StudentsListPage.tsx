import { useEffect, useState } from "react"
import { useStudents } from "../../hooks/useStudents"
import { DataTable } from "../../components/data-display/DataTable/DataTable"
import { AddStudentModal } from "./AddStudentModal"

export function StudentsListPage() {
  const { students, total, params, isLoading, error, fetchStudents, setParams } = useStudents()
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <span className="text-4xl">⚠️</span>
        <p className="text-base-content/60 text-sm">{error}</p>
        <button onClick={() => fetchStudents()} className="btn btn-primary btn-sm">
          Thử lại
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">📚 Danh sách sinh viên</h1>
        <p className="text-sm text-base-content/60 mt-1">
          Quản lý toàn bộ sinh viên trong hệ thống
        </p>
      </div>

      <div className="card bg-base-100 border border-base-300/30 shadow-sm">
        <div className="card-body p-4 md:p-6">
          <DataTable
            data={students}
            isLoading={isLoading}
            onAddStudent={() => setIsModalOpen(true)}
            page={params.page || 1}
            pageSize={params.limit || 25}
            total={total}
            onPageChange={(page) => setParams({ page })}
            onPageSizeChange={(limit) => setParams({ limit, page: 1 })}
          />
        </div>
      </div>

      <AddStudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          fetchStudents()
        }}
      />
    </div>
  )
}
