import { create } from "zustand"
import type { IUser } from "../types"

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

interface AuthState {
  token: string | null
  user: IUser | null
  role: "admin" | "user" | null
  isAuthenticated: boolean
  login: (token: string, user: IUser, role: "admin" | "user") => void
  logout: () => void
  updateUser: (user: Partial<IUser>) => void
}

export const useAuthStore = create<AuthState>((set) => {
  return {
    token: localStorage.getItem("token"),
    user: loadFromStorage<IUser | null>("user", null),
    role: loadFromStorage<"admin" | "user" | null>("role", null),
    isAuthenticated: !!localStorage.getItem("token"),
    login: (token, user, role) => {
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("role", JSON.stringify(role))
      set({ token, user, role, isAuthenticated: true })
    },
    logout: () => {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      localStorage.removeItem("role")
      set({ token: null, user: null, role: null, isAuthenticated: false })
    },
    updateUser: (updates) => {
      const currentUser = loadFromStorage<IUser | null>("user", null)
      if (currentUser) {
        const updated = { ...currentUser, ...updates }
        localStorage.setItem("user", JSON.stringify(updated))
      }
      set((state) => {
        return { user: state.user ? { ...state.user, ...updates } : null }
      })
    },
  }
})
