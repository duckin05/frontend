import { useEffect, type ReactNode } from "react"
import { useUIStore } from "../store"

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useUIStore((s) => s.theme)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light")
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])
  return <>{children}</>
}
