import { Outlet, Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store"
import { ROUTES } from "../constants/routes"

export function AppLayout() {
  const role = useAuthStore((s) => s.role)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const isAdmin = role === "admin"

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-100 border-b border-base-300 px-4">
          <div className="flex-none lg:hidden">
            <label htmlFor="sidebar-drawer" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
          </div>
          <div className="flex-1 flex items-center gap-3">
            <span className="text-lg font-bold">🎓 Blockchain Student</span>
            {user && (
              <span className="badge badge-sm gap-1">
                {isAdmin ? "👑 Admin" : "🎓 Học sinh"}
              </span>
            )}
          </div>
          <div className="flex-none">
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">
              🚪 Đăng xuất
            </button>
          </div>
        </div>
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-base-200 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
      <div className="drawer-side">
        <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
        <aside className="bg-base-100 min-h-screen w-64 p-4 flex flex-col gap-4 border-r border-base-300">
          <div className="flex items-center gap-2 px-2 py-4">
            <span className="text-2xl">🎓</span>
            <span className="font-bold text-lg">Blockchain Student</span>
          </div>
          <nav className="flex-1 flex flex-col gap-1">
            {/* Dashboard - everyone */}
            <Link to={ROUTES.DASHBOARD} className="btn btn-ghost justify-start gap-2">
              📊 Dashboard
            </Link>

            {/* Admin-only links */}
            {isAdmin && (
              <>
                <Link to={ROUTES.STUDENTS} className="btn btn-ghost justify-start gap-2">
                  📚 Danh sách sinh viên
                </Link>
                <Link to={ROUTES.BLOCKCHAIN} className="btn btn-ghost justify-start gap-2">
                  ⛓️ Blockchain
                </Link>
                <Link to={ROUTES.IMPORT} className="btn btn-ghost justify-start gap-2">
                  📁 Import / Export
                </Link>
              </>
            )}

            {/* Chat - everyone */}
            <Link to={ROUTES.CHAT} className="btn btn-ghost justify-start gap-2">
              🤖 Trợ lý AI
            </Link>
          </nav>

          {/* User info & logout */}
          <div className="border-t border-base-300 pt-4 flex flex-col gap-1">
            <Link to={ROUTES.PROFILE} className="btn btn-ghost justify-start gap-2">
              👤 {user?.username || "Hồ sơ"}
            </Link>
            <Link to={ROUTES.SETTINGS} className="btn btn-ghost justify-start gap-2">
              ⚙️ Cài đặt
            </Link>
            <button onClick={handleLogout} className="btn btn-ghost justify-start gap-2 text-error">
              🚪 Đăng xuất
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
