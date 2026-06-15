import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { authService } from "../../services/authService"
import { ROUTES } from "../../constants/routes"

const studentRegisterSchema = z.object({
  username: z.string().min(3, "Username phải có ít nhất 3 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  student_id: z.string().min(1, "Vui lòng nhập mã sinh viên"),
  name: z.string().min(1, "Vui lòng nhập họ tên"),
  student_class: z.string().min(1, "Vui lòng nhập lớp"),
})

type StudentRegisterFormData = z.infer<typeof studentRegisterSchema>

export function StudentRegisterPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentRegisterFormData>({
    resolver: zodResolver(studentRegisterSchema),
    defaultValues: { username: "", password: "", student_id: "", name: "", student_class: "" },
  })

  const onSubmit = async (data: StudentRegisterFormData) => {
    try {
      setServerError(null)
      const formData = new FormData()
      formData.append("username", data.username)
      formData.append("password", data.password)
      formData.append("student_id", data.student_id)
      formData.append("name", data.name)
      formData.append("class", data.student_class)
      if (photoFile) {
        formData.append("photo", photoFile)
      }

      const response = await authService.studentRegister(formData)
      if (response.success) {
        setIsSuccess(true)
        setTimeout(() => {
          navigate(ROUTES.STUDENT_LOGIN, { replace: true })
        }, 2000)
      } else {
        setServerError(response.message || "Đăng ký thất bại")
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Đã có lỗi xảy ra"
      setServerError(msg)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex w-full max-w-5xl min-h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-base-100 border border-base-300/20">
        <div className="w-full flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold mb-2">Đăng ký thành công!</h3>
            <p className="text-sm text-base-content/60 mb-6">
              Tài khoản của bạn đã được tạo. Đang chuyển đến trang đăng nhập...
            </p>
            <span className="loading loading-spinner loading-lg text-secondary"></span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-5xl min-h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-base-100 border border-base-300/20">
      {/* Left: Brand Illustration */}
      <div className="hidden md:flex md:w-1/2 p-6 bg-gradient-to-br from-base-200/50 to-base-300/30">
        <div className="relative min-h-[320px] rounded-2xl overflow-hidden flex flex-col justify-center p-8 bg-gradient-to-br from-accent/10 via-secondary/5 to-primary/10 border border-base-300/30 w-full">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-float" />
            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              🧑‍🎓 Đăng ký học sinh
            </h2>
            <p className="text-base-content/70 text-sm leading-relaxed mb-4">
              Tạo tài khoản, tải lên ảnh đại diện và đồng bộ dữ liệu vào hệ thống blockchain an toàn.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-100/50 border border-base-300/30 backdrop-blur-sm">
              <span className="text-xs font-medium text-base-content/60">Bảo mật · Minh bạch · Kết nối</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Register Form */}
      <div className="w-full md:w-1/2 p-8 md:p-10 flex items-center">
        <div className="w-full max-w-sm mx-auto">
          <div className="flex flex-col">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">📝 Đăng ký</h3>
              <p className="text-sm text-base-content/60">
                Tạo tài khoản để theo dõi thông tin của bạn
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              {serverError && (
                <div className="alert alert-error text-sm py-2" role="alert">
                  <span>{serverError}</span>
                </div>
              )}

              <div className="form-control">
                <label className="label" htmlFor="name">
                  <span className="label-text">Họ tên</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Nguyễn Văn A..."
                  className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
                  {...register("name")}
                  disabled={isSubmitting}
                  autoComplete="name"
                  autoFocus
                />
                {errors.name && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.name.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label" htmlFor="username">
                  <span className="label-text">Tên đăng nhập</span>
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Nhập username..."
                  className={`input input-bordered w-full ${errors.username ? "input-error" : ""}`}
                  {...register("username")}
                  disabled={isSubmitting}
                  autoComplete="username"
                />
                {errors.username && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.username.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label" htmlFor="student_id">
                  <span className="label-text">Mã sinh viên</span>
                </label>
                <input
                  id="student_id"
                  type="text"
                  placeholder="2823250017..."
                  className={`input input-bordered w-full ${errors.student_id ? "input-error" : ""}`}
                  {...register("student_id")}
                  disabled={isSubmitting}
                  autoComplete="off"
                />
                {errors.student_id && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.student_id.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label" htmlFor="student_class">
                  <span className="label-text">Lớp</span>
                </label>
                <input
                  id="student_class"
                  type="text"
                  placeholder="TH28.21..."
                  className={`input input-bordered w-full ${errors.student_class ? "input-error" : ""}`}
                  {...register("student_class")}
                  disabled={isSubmitting}
                  autoComplete="off"
                />
                {errors.student_class && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.student_class.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Ảnh đại diện</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="file-input file-input-bordered file-input-secondary w-full"
                  disabled={isSubmitting}
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/40">(JPG, PNG — tối đa 5MB, không bắt buộc)</span>
                </label>
              </div>

              <div className="form-control">
                <label className="label" htmlFor="password">
                  <span className="label-text">Mật khẩu</span>
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Ít nhất 6 ký tự..."
                  className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`}
                  {...register("password")}
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
                {errors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.password.message}</span>
                  </label>
                )}
              </div>

              <button
                type="submit"
                className={`btn btn-secondary w-full mt-1 ${isSubmitting ? "btn-disabled" : ""}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Đang đăng ký...
                  </>
                ) : (
                  "Đăng ký"
                )}
              </button>

              <div className="flex justify-center mt-3">
                <Link
                  to={ROUTES.STUDENT_LOGIN}
                  className="link link-hover text-sm text-base-content/60 hover:text-secondary"
                >
                  Đã có tài khoản? Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
