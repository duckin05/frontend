import { Outlet } from "react-router-dom"

export function StudentAuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Outlet />
    </div>
  )
}
