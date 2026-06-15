import { useNavigate } from "react-router-dom"
import { ROUTES } from "../../constants/routes"

interface AccessDeniedProps {
  message?: string
}

export function AccessDenied({ message }: AccessDeniedProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-24 h-24 rounded-full bg-error/10 flex items-center justify-center mb-6">
        <span className="text-5xl">🚫</span>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-base-content mb-3">
        Bạn không có quyền truy cập
      </h1>
      <p className="text-sm text-base-content/60 max-w-md mb-2">
        {message || "Trang này chỉ dành cho quản trị viên. Tài khoản của bạn không có quyền truy cập vào mục này."}
      </p>
      <p className="text-xs text-base-content/40 max-w-md mb-8">
        Vui lòng liên hệ quản trị viên nếu bạn cần được cấp quyền.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => navigate(ROUTES.DASHBOARD, { replace: true })}
          className="btn btn-primary"
        >
          ← Quay về Dashboard
        </button>
        <button
          onClick={() => navigate(ROUTES.PROFILE)}
          className="btn btn-ghost"
        >
          👤 Xem hồ sơ
        </button>
      </div>
    </div>
  )
}
