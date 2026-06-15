import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "../store"
import { AccessDenied } from "../components/data-display/AccessDenied"

export function AdminRoute() {
  const { isAuthenticated, role } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role !== "admin") return <AccessDenied />
  return <Outlet />
}
