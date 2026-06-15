import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "../store"

export function StudentRoute() {
  const { isAuthenticated, role } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}
