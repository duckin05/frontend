import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useProfile } from "../../hooks/useProfile"

const changePasswordSchema = z.object({
  old_password: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
  new_password: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
  confirm_password: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirm_password"],
})

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export function ChangePasswordForm() {
  const { changePassword, isLoading } = useProfile()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { old_password: "", new_password: "", confirm_password: "" },
  })

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setServerError(null)
      setIsSuccess(false)
      const response = await changePassword(data.old_password, data.new_password)
      if (response.success) {
        setIsSuccess(true)
        reset()
        setTimeout(() => setIsSuccess(false), 3000)
      } else {
        setServerError(response.message || "Đổi mật khẩu thất bại")
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Đã có lỗi xảy ra"
      setServerError(msg)
    }
  }

  return (
    <div className="card bg-base-100 border border-base-300/30 shadow-sm">
      <div className="card-body p-6">
        <h3 className="card-title text-base font-semibold mb-4">🔑 Đổi mật khẩu</h3>
        <p className="text-sm text-base-content/60 mb-4">
          Cập nhật mật khẩu để bảo vệ tài khoản của bạn
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {serverError && (
            <div className="alert alert-error text-sm py-2" role="alert">
              <span>{serverError}</span>
              <button onClick={() => setServerError(null)} className="btn btn-ghost btn-xs">✖</button>
            </div>
          )}

          {isSuccess && (
            <div className="alert alert-success text-sm py-2" role="alert">
              <span>✅ Mật khẩu đã được thay đổi thành công!</span>
            </div>
          )}

          <div className="form-control">
            <label className="label" htmlFor="old_password">
              <span className="label-text">Mật khẩu hiện tại</span>
            </label>
            <input
              id="old_password"
              type="password"
              placeholder="Nhập mật khẩu hiện tại..."
              className={`input input-bordered w-full ${errors.old_password ? "input-error" : ""}`}
              {...register("old_password")}
              disabled={isLoading}
              autoComplete="current-password"
            />
            {errors.old_password && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.old_password.message}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="new_password">
              <span className="label-text">Mật khẩu mới</span>
            </label>
            <input
              id="new_password"
              type="password"
              placeholder="Ít nhất 6 ký tự..."
              className={`input input-bordered w-full ${errors.new_password ? "input-error" : ""}`}
              {...register("new_password")}
              disabled={isLoading}
              autoComplete="new-password"
            />
            {errors.new_password && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.new_password.message}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label" htmlFor="confirm_password">
              <span className="label-text">Xác nhận mật khẩu mới</span>
            </label>
            <input
              id="confirm_password"
              type="password"
              placeholder="Nhập lại mật khẩu mới..."
              className={`input input-bordered w-full ${errors.confirm_password ? "input-error" : ""}`}
              {...register("confirm_password")}
              disabled={isLoading}
              autoComplete="new-password"
            />
            {errors.confirm_password && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.confirm_password.message}</span>
              </label>
            )}
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-full mt-2 ${isLoading ? "btn-disabled" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Đang đổi mật khẩu...
              </>
            ) : (
              "Đổi mật khẩu"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
