import { createContext, useContext, type ReactNode } from "react"
import { useAuthStore } from "../store"

interface AuthContextType {
  isAuthenticated: boolean
  role: string | null
}

const AuthContext = createContext<AuthContextType>({ isAuthenticated: false, role: null })

export function AuthProvider({ children }: { children: ReactNode }) {
  const isAuth = useAuthStore((s) => s.isAuthenticated)
  const role = useAuthStore((s) => s.role)
  return <AuthContext.Provider value={{ isAuthenticated: isAuth, role }}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)
