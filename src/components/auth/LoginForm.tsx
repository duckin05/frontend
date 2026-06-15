import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginFormData } from "../../utils/validation"
import { useAuth } from "../../hooks/useAuth"
import { ROUTES } from "../../constants/routes"

export function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError(null)
      const response = await login({
        username: data.username,
        password: data.password,
      })
      if (response.success) {
        navigate(ROUTES.DASHBOARD, { replace: true })
      } else {
        setServerError(response.message || "Sai tên đăng nhập hoặc mật khẩu")
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Đã có lỗi xảy ra. Vui lòng thử lại."
      setServerError(msg)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2">🔐 Đăng nhập</h3>
        <p className="text-sm text-base-content/60">
          Đăng nhập để quản lý hoặc xem thông tin sinh viên
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Server error */}
        {serverError && (
          <div className="alert alert-error text-sm py-2" role="alert">
            <span>{serverError}</span>
          </div>
        )}

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
            autoFocus
          />
          {errors.username && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.username.message}</span>
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
            placeholder="Nhập mật khẩu..."
            className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`}
            {...register("password")}
            disabled={isSubmitting}
            autoComplete="current-password"
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
          className={`btn btn-primary w-full ${isSubmitting ? "btn-disabled" : ""}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Đang đăng nhập...
            </>
          ) : (
            "Đăng nhập"
          )}
        </button>

        {/* Links */}
        <div className="flex flex-col items-center gap-3 mt-4">
          <Link
            to={ROUTES.REGISTER}
            className="link link-hover text-sm text-base-content/60 hover:text-primary"
          >
            Chưa có tài khoản? Đăng ký
          </Link>
          <div className="divider divider-xs text-base-content/40">hoặc</div>
          <Link
            to={ROUTES.STUDENT_LOGIN}
            className="link link-hover text-sm text-base-content/60 hover:text-secondary"
          >
            🎓 Cổng đăng nhập sinh viên
          </Link>
        </div>
      </form>
    </div>
  )
}
