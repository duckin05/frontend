import { useAuthStore } from "../store"
import { authService } from "../services"
import type { LoginPayload, RegisterPayload } from "../types"

export function useAuth() {
  const { token, user, role, isAuthenticated, login, logout } = useAuthStore()

  const handleLogin = async (payload: LoginPayload) => {
    const response = await authService.login(payload)
    if (response.success) login(response.token, response.user, response.role)
    return response
  }

  const handleRegister = async (payload: RegisterPayload) => {
    return await authService.register(payload)
  }

  const handleLogout = () => { logout() }

  return { token, user, role, isAuthenticated, login: handleLogin, register: handleRegister, logout: handleLogout }
}
