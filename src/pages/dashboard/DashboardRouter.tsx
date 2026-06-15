import { useAuthStore } from "../../store"
import { AdminDashboardPage } from "./AdminDashboardPage"
import { StudentDashboardPage } from "./StudentDashboardPage"

export function DashboardRouter() {
  const role = useAuthStore((s) => s.role)
  const isAdmin = role === "admin"

  if (isAdmin) {
    return <AdminDashboardPage />
  }

  return <StudentDashboardPage />
}
