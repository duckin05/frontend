import { Routes, Route, Navigate } from "react-router-dom"
import { ProtectedRoute } from "./ProtectedRoute"
import { AdminRoute } from "./AdminRoute"
import { AppLayout } from "../layouts/AppLayout"
import { AuthLayout } from "../layouts/AuthLayout"
import { LoginPage } from "../pages/auth/LoginPage"
import { RegisterPage } from "../pages/auth/RegisterPage"
import { StudentLoginPage } from "../pages/auth/StudentLoginPage"
import { StudentRegisterPage } from "../pages/auth/StudentRegisterPage"
import { DashboardRouter } from "../pages/dashboard/DashboardRouter"
import { StudentsListPage } from "../pages/students/StudentsListPage"
import { StudentDetailPage } from "../pages/students/StudentDetailPage"
import { BlockchainPage } from "../pages/blockchain/BlockchainPage"
import { ProfilePage } from "../pages/profile/ProfilePage"
import { SettingsPage } from "../pages/settings/SettingsPage"
import { ImportPage } from "../pages/import/ImportPage"
import { ChatPage } from "../pages/chat/ChatPage"

export function AppRouter() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/student/login" element={<StudentLoginPage />} />
        <Route path="/student/register" element={<StudentRegisterPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/chat" element={<ChatPage />} />

          {/* Admin-only routes */}
          <Route element={<AdminRoute />}>
            <Route path="/students" element={<StudentsListPage />} />
            <Route path="/students/:ma_sv" element={<StudentDetailPage />} />
            <Route path="/blockchain" element={<BlockchainPage />} />
            <Route path="/import" element={<ImportPage />} />
          </Route>
        </Route>
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
