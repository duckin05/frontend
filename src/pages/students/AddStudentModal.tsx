import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { studentSchema, type StudentFormData } from "../../utils/validation"
import { studentService } from "../../services/studentService"
import { useStudentStore } from "../../store/studentStore"

export function AddStudentModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const addStudent = useStudentStore((s) => s.addStudent)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: { ma_sv: "", ten: "", lop: "" },
  })

  if (!isOpen) return null

  const onSubmit = async (data: StudentFormData) => {
    try {
      setServerError(null)
      const response = await studentService.create(data)
      if (response.success) {
        // Add optimistic update
        addStudent({
          ...data,
          timestamp: new Date().toISOString(),
          created_by: "admin",
        })
        reset()
        onClose()
      } else {
        setServerError(response.message || "Không thể thêm sinh viên")
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Đã có lỗi xảy ra"
      setServerError(msg)
    }
  }

  return (
    <dialog className="modal modal-open" onClick={onClose}>
      <div className="modal-box max-w-md" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-lg mb-6">＋ Thêm sinh viên mới</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {serverError && (
            <div className="alert alert-error text-sm py-2" role="alert">
              <span>{serverError}</span>
            </div>
          )}

          <div className="form-control">
            <label className="label"><span className="label-text">Mã sinh viên *</span></label>
            <input
              type="text"
              placeholder="VD: 2823250000"
              className={`input input-bordered w-full ${errors.ma_sv ? "input-error" : ""}`}
              {...register("ma_sv")}
              disabled={isSubmitting}
            />
            {errors.ma_sv && <label className="label"><span className="label-text-alt text-error">{errors.ma_sv.message}</span></label>}
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Họ tên *</span></label>
            <input
              type="text"
              placeholder="VD: Nguyễn Văn A"
              className={`input input-bordered w-full ${errors.ten ? "input-error" : ""}`}
              {...register("ten")}
              disabled={isSubmitting}
            />
            {errors.ten && <label className="label"><span className="label-text-alt text-error">{errors.ten.message}</span></label>}
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">Lớp *</span></label>
            <input
              type="text"
              placeholder="VD: TH28.21"
              className={`input input-bordered w-full ${errors.lop ? "input-error" : ""}`}
              {...register("lop")}
              disabled={isSubmitting}
            />
            {errors.lop && <label className="label"><span className="label-text-alt text-error">{errors.lop.message}</span></label>}
          </div>

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <><span className="loading loading-spinner loading-sm"></span> Đang lưu...</>
              ) : (
                "Lưu sinh viên"
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  )
}
