import { AccountInfoCard } from "../../components/data-display/AccountInfoCard"
import { ChangePasswordForm } from "../../components/auth/ChangePasswordForm"

export function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">👤 Hồ sơ cá nhân</h1>
        <p className="text-sm text-base-content/60 mt-1">
          Quản lý thông tin tài khoản và bảo mật
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Account Info (3/5 width) */}
        <div className="lg:col-span-3">
          <AccountInfoCard />
        </div>

        {/* Change Password (2/5 width) */}
        <div className="lg:col-span-2">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  )
}
