import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterFormData } from "../../utils/validation"
import { useAuth } from "../../hooks/useAuth"
import { ROUTES } from "../../constants/routes"

export function RegisterForm() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", password: "", student_id: "", name: "", student_class: "" },
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError(null)
      const response = await registerUser({
        username: data.username,
        password: data.password,
        student_id: data.student_id,
        name: data.name,
        student_class: data.student_class,
      })
      if (response.success) {
        setIsSuccess(true)
        setTimeout(() => {
          navigate(ROUTES.LOGIN, { replace: true })
        }, 2000)
      } else {
        setServerError(response.message || "Đăng ký thất bại. Vui lòng thử lại.")
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Đã có lỗi xảy ra. Vui lòng thử lại."
      setServerError(msg)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold mb-2">Đăng ký thành công!</h3>
        <p className="text-sm text-base-content/60 mb-6">
          Tài khoản của bạn đã được tạo. Đang chuyển đến trang đăng nhập...
        </p>
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">📝 Đăng ký</h3>
        <p className="text-sm text-base-content/60">
          Tạo tài khoản mới để quản lý sinh viên
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {/* Server error */}
        {serverError && (
          <div className="alert alert-error text-sm py-2" role="alert">
            <span>{serverError}</span>
          </div>
        )}

        {/* Full Name */}
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

        {/* Username */}
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

        {/* Student ID */}
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

        {/* Class */}
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

        {/* Password */}
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

        {/* Submit */}
        <button
          type="submit"
          className={`btn btn-primary w-full mt-1 ${isSubmitting ? "btn-disabled" : ""}`}
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

        {/* Link to login */}
        <div className="flex justify-center mt-3">
          <Link
            to={ROUTES.LOGIN}
            className="link link-hover text-sm text-base-content/60 hover:text-primary"
          >
            Đã có tài khoản? Đăng nhập
          </Link>
        </div>
      </form>
    </div>
  )
}
