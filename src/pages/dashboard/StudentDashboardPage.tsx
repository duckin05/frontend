import { useEffect } from "react"
import { useAuthStore } from "../../store"
import { profileService } from "../../services"
import { AccountInfoCard } from "../../components/data-display/AccountInfoCard"
import { DashboardQuickActions } from "../../components/data-display/DashboardQuickActions"

export function StudentDashboardPage() {
  const user = useAuthStore((s) => s.user)

  // Fetch profile data on mount to populate the store
  useEffect(() => {
    profileService.getProfile().catch(() => {})
  }, [])

  if (!user) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-2xl md:text-3xl font-bold">📊 Dashboard</h1>
        <span className="badge badge-secondary gap-1">🎓 Học sinh</span>
      </div>
      <p className="text-sm text-base-content/60 -mt-4">
        Xin chào, {user.username} | Thông tin cá nhân của bạn
      </p>

      {/* Personal Info Card */}
      <AccountInfoCard />

      {/* Welcome message */}
      <div className="card bg-base-100 border border-base-300/30 shadow-sm">
        <div className="card-body p-6">
          <div className="flex items-start gap-4">
            <span className="text-4xl">🎓</span>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Chào mừng bạn đến với hệ thống!
              </h3>
              <p className="text-sm text-base-content/60 leading-relaxed">
                Đây là trang thông tin cá nhân của bạn. Tại đây bạn có thể xem hồ sơ,
                đổi mật khẩu và tùy chỉnh cài đặt tài khoản.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="badge badge-outline gap-1">👤 {user.username}</span>
                {user.student_id && (
                  <span className="badge badge-outline gap-1">📋 {user.student_id}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card bg-base-100 border border-base-300/30 shadow-sm">
        <div className="card-body p-5">
          <h3 className="card-title text-base font-semibold mb-3">⚡ Tiện ích</h3>
          <DashboardQuickActions />
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-base-content/30 py-4">
        Hệ thống quản lý sinh viên Blockchain | Phiên bản dành cho học sinh
      </div>
    </div>
  )
}
