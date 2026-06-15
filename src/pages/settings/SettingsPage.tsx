import { ThemeToggleCard } from "../../components/settings/ThemeToggleCard"
import { NotificationPreferencesCard } from "../../components/settings/NotificationPreferencesCard"
import { LanguageSelectorCard } from "../../components/settings/LanguageSelectorCard"
import { AccountDeletionCard } from "../../components/settings/AccountDeletionCard"

export function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">⚙️ Cài đặt</h1>
        <p className="text-sm text-base-content/60 mt-1">
          Tùy chỉnh cài đặt hệ thống theo ý muốn
        </p>
      </div>

      {/* Top row: Theme + Language */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThemeToggleCard />
        <LanguageSelectorCard />
      </div>

      {/* Notifications */}
      <NotificationPreferencesCard />

      {/* Danger Zone */}
      <AccountDeletionCard />
    </div>
  )
}
