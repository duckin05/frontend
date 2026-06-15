import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store"
import apiClient from "../../lib/axios"

function ConfirmModal({ isOpen, onClose, onConfirm, isLoading, error }: {
  isOpen: boolean; onClose: () => void; onConfirm: () => void
  isLoading: boolean; error: string | null
}) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-base-100 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 border border-base-300/30">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold mb-2">Xóa tài khoản?</h3>
          <p className="text-sm text-base-content/60 mb-2">Hành động này không thể hoàn tác.</p>
          <p className="text-xs text-base-content/40 mb-6">Vui lòng xác nhận.</p>
        </div>
        {error && <div className="alert alert-error text-sm py-2 mb-4" role="alert"><span>{error}</span></div>}
        <div className="flex gap-3">
          <button onClick={onClose} className="btn btn-ghost flex-1 border border-base-300/30" disabled={isLoading}>Hủy</button>
          <button onClick={onConfirm} className="btn btn-error flex-1" disabled={isLoading}>
            {isLoading ? <><span className="loading loading-spinner loading-sm"></span>Đang xóa...</> : "Xác nhận xóa"}
          </button>
        </div>
      </div>
    </div>
  )
}

export function AccountDeletionCard() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const username = useAuthStore((s) => s.user?.username)
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    try {
      setIsLoading(true); setError(null)
      await apiClient.delete("/profile")
      logout(); navigate("/login", { replace: true })
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 405) {
        logout(); navigate("/login", { replace: true })
      } else {
        setError(err?.response?.data?.message || err?.message || "Không thể xóa tài khoản")
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <div className="card bg-base-100 border border-error/20 shadow-sm">
        <div className="card-body p-6">
          <h3 className="card-title text-base font-semibold mb-4 text-error">⚠️ Vùng nguy hiểm</h3>
          <p className="text-sm text-base-content/60 mb-4">Các hành động này không thể hoàn tác.</p>
          <div className="p-4 rounded-xl bg-error/5 border border-error/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium">Xóa tài khoản</p>
                <p className="text-xs text-base-content/50 mt-0.5">
                  {username ? `Xóa tài khoản "${username}" và tất cả dữ liệu liên quan` : "Xóa tài khoản của bạn"}
                </p>
              </div>
              <button onClick={() => setShowModal(true)} className="btn btn-outline btn-error btn-sm w-full sm:w-auto">
                Xóa tài khoản
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal isOpen={showModal} onClose={() => { setShowModal(false); setError(null) }} onConfirm={handleDelete} isLoading={isLoading} error={error} />
    </>
  )
}
