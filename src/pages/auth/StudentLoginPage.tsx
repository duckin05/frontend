import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "../../hooks/useAuth"
import { ROUTES } from "../../constants/routes"

const studentLoginSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
})

type StudentLoginFormData = z.infer<typeof studentLoginSchema>

export function StudentLoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentLoginFormData>({
    resolver: zodResolver(studentLoginSchema),
    defaultValues: { username: "", password: "" },
  })

  const onSubmit = async (data: StudentLoginFormData) => {
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
      const msg = err?.response?.data?.message || err?.message || "Đã có lỗi xảy ra"
      setServerError(msg)
    }
  }

  return (
    <div className="flex w-full max-w-5xl min-h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-base-100 border border-base-300/20">
      {/* Left: Brand Illustration */}
      <div className="hidden md:flex md:w-1/2 p-6 bg-gradient-to-br from-base-200/50 to-base-300/30">
        <div className="relative min-h-[320px] rounded-2xl overflow-hidden flex flex-col justify-center p-8 bg-gradient-to-br from-secondary/10 via-primary/5 to-accent/10 border border-base-300/30 w-full">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-float" />
            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              🎓 Cổng Sinh Viên
            </h2>
            <p className="text-base-content/70 text-sm leading-relaxed mb-4">
              Đăng nhập để xem thông tin hồ sơ, theo dõi dữ liệu blockchain và kết nối với hệ thống quản lý.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-100/50 border border-base-300/30 backdrop-blur-sm">
              <span className="text-xs font-medium text-base-content/60">Dành cho học sinh, sinh viên</span>
            </div>
          </div>
          <div className="relative z-10 mt-6 flex flex-wrap gap-2">
            {["Secure", "Connected", "Verified"].map((feature) => (
              <span key={feature} className="px-3 py-1 text-xs font-medium rounded-full bg-base-100/40 border border-base-300/20 text-base-content/60">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="w-full md:w-1/2 p-8 md:p-10 flex items-center">
        <div className="w-full max-w-sm mx-auto">
          <div className="flex flex-col">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">🎓 Đăng nhập sinh viên</h3>
              <p className="text-sm text-base-content/60">
                Đăng nhập để xem thông tin hồ sơ của bạn
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {serverError && (
                <div className="alert alert-error text-sm py-2" role="alert">
                  <span>{serverError}</span>
                </div>
              )}

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

              <button
                type="submit"
                className={`btn btn-secondary w-full ${isSubmitting ? "btn-disabled" : ""}`}
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

              <div className="flex flex-col items-center gap-3 mt-4">
                <Link
                  to={ROUTES.STUDENT_REGISTER}
                  className="link link-hover text-sm text-base-content/60 hover:text-secondary"
                >
                  Chưa có tài khoản? Đăng ký
                </Link>
                <div className="divider divider-xs text-base-content/40">hoặc</div>
                <Link
                  to={ROUTES.LOGIN}
                  className="link link-hover text-sm text-base-content/60 hover:text-primary"
                >
                  🔐 Cổng đăng nhập Admin
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
