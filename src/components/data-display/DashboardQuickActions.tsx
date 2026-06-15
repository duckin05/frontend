import { Link } from "react-router-dom"
import { useAuthStore } from "../../store"
import { ROUTES } from "../../constants/routes"

export function DashboardQuickActions() {
  const role = useAuthStore((s) => s.role)
  const isAdmin = role === "admin"

  const adminActions = [
    { icon: "➕", label: "Thêm sinh viên", desc: "Tạo mới hồ sơ sinh viên", to: ROUTES.STUDENTS, color: "btn-primary" },
    { icon: "📁", label: "Import Excel", desc: "Nhập danh sách từ file .xlsx", to: ROUTES.IMPORT, color: "btn-secondary" },
    { icon: "📥", label: "Export Excel", desc: "Xuất danh sách ra file Excel", to: ROUTES.IMPORT, color: "btn-accent" },
    { icon: "⛓️", label: "Blockchain", desc: "Xem trạng thái blockchain", to: ROUTES.BLOCKCHAIN, color: "btn-ghost" },
  ]

  const userActions = [
    { icon: "👤", label: "Hồ sơ", desc: "Xem thông tin tài khoản", to: ROUTES.PROFILE, color: "btn-primary" },
    { icon: "⚙️", label: "Cài đặt", desc: "Tùy chỉnh hệ thống", to: ROUTES.SETTINGS, color: "btn-secondary" },
    { icon: "🤖", label: "Trợ lý AI", desc: "Hỏi đáp với AI", to: ROUTES.CHAT, color: "btn-accent" },
    { icon: "🔐", label: "Đổi mật khẩu", desc: "Bảo mật tài khoản", to: ROUTES.PROFILE, color: "btn-ghost" },
  ]

  const actions = isAdmin ? adminActions : userActions

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => (
        <Link
          key={action.label}
          to={action.to}
          className={`btn ${action.color} flex-col gap-1 h-auto py-4 px-3 border border-base-300/20`}
        >
          <span className="text-xl">{action.icon}</span>
          <span className="text-xs font-semibold">{action.label}</span>
          <span className="text-[10px] opacity-60 font-normal">{action.desc}</span>
        </Link>
      ))}
    </div>
  )
}
