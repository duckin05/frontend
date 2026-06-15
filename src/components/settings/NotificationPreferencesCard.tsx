import { useState, useEffect } from "react"

interface NotifPrefs {
  emailNotifications: boolean
  pushNotifications: boolean
  smsAlerts: boolean
  weeklyReport: boolean
}

const STORAGE_KEY = "notification_prefs"

const defaultPrefs: NotifPrefs = {
  emailNotifications: true,
  pushNotifications: true,
  smsAlerts: false,
  weeklyReport: true,
}

function loadPrefs(): NotifPrefs {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...defaultPrefs, ...JSON.parse(stored) } : defaultPrefs
  } catch {
    return defaultPrefs
  }
}

function savePrefs(prefs: NotifPrefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
}

export function NotificationPreferencesCard() {
  const [prefs, setPrefs] = useState<NotifPrefs>(loadPrefs)

  useEffect(() => {
    savePrefs(prefs)
  }, [prefs])

  const toggle = (key: keyof NotifPrefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const notifications = [
    { key: "emailNotifications" as const, icon: "📧", label: "Thông báo qua email", desc: "Nhận thông báo về hoạt động hệ thống qua email" },
    { key: "pushNotifications" as const, icon: "🔔", label: "Thông báo push", desc: "Nhận thông báo trên trình duyệt" },
    { key: "smsAlerts" as const, icon: "📱", label: "Cảnh báo qua SMS", desc: "Cảnh báo khẩn cấp qua tin nhắn SMS" },
    { key: "weeklyReport" as const, icon: "📊", label: "Báo cáo hàng tuần", desc: "Nhận báo cáo tổng hợp hàng tuần" },
  ]

  return (
    <div className="card bg-base-100 border border-base-300/30 shadow-sm">
      <div className="card-body p-6">
        <h3 className="card-title text-base font-semibold mb-4">🔔 Thông báo</h3>
        <p className="text-sm text-base-content/60 mb-4">
          Quản lý các kênh thông báo và cảnh báo
        </p>

        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.key}
              className="flex items-center justify-between p-3 rounded-xl bg-base-200/40 border border-base-300/20 hover:bg-base-200/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{notif.icon}</span>
                <div>
                  <p className="text-sm font-medium">{notif.label}</p>
                  <p className="text-xs text-base-content/50">{notif.desc}</p>
                </div>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary toggle-sm"
                checked={prefs[notif.key]}
                onChange={() => toggle(notif.key)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
