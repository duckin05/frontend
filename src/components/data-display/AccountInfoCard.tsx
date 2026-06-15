import { useState, useEffect, useCallback } from "react"
import { useAuthStore } from "../../store"
import { profileService } from "../../services"
import { PhotoUploadCropModal } from "../auth/PhotoUploadCropModal"

export function AccountInfoCard() {
  const user = useAuthStore((s) => s.user)
  const role = useAuthStore((s) => s.role)
  const updateUser = useAuthStore((s) => s.updateUser)
  const [showCropModal, setShowCropModal] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(user?.photo || null)

  // Revoke old blob URL when photoUrl changes to avoid memory leaks
  useEffect(() => {
    return () => {
      if (photoUrl?.startsWith("blob:")) URL.revokeObjectURL(photoUrl)
    }
  }, [photoUrl])

  if (!user) return null

  const initials = user.username
    .split(/[\s._-]+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const roleLabel = role === "admin" ? "Quản trị viên" : "Người dùng"
  const roleColor = role === "admin" ? "badge-primary" : "badge-ghost"

  const handleCropComplete = useCallback(async (blob: Blob) => {
    try {
      setUploadError(null)
      const file = new File([blob], "profile-photo.jpg", { type: "image/jpeg" })
      const response = await profileService.uploadPhoto(file)

      // Update local state with the returned or a local URL
      const localUrl = URL.createObjectURL(blob)
      setPhotoUrl(localUrl)

      // Update the store if the API returns a photo URL
      if (response?.photo) {
        updateUser({ photo: response.photo })
      } else {
        updateUser({ photo: localUrl })
      }

      setShowCropModal(false)
    } catch (err: any) {
      setUploadError(err?.response?.data?.message || err?.message || "Không thể tải ảnh lên")
    }
  }, [updateUser])

  return (
    <>
      <div className="card bg-base-100 border border-base-300/30 shadow-sm">
        <div className="card-body p-6">
          <h3 className="card-title text-base font-semibold mb-4">👤 Thông tin tài khoản</h3>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Avatar with hover upload overlay */}
            <div className="relative group">
              <div
                className="avatar placeholder cursor-pointer"
                onClick={() => setShowCropModal(true)}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-2xl font-bold shadow-lg overflow-hidden">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
              </div>

              {/* Hover overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => setShowCropModal(true)}
              >
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold">{user.username}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-2 justify-center sm:justify-start">
                <span className={`badge ${roleColor} badge-sm`}>{roleLabel}</span>
                {user.student_id && (
                  <span className="badge badge-outline badge-sm">Mã SV: {user.student_id}</span>
                )}
              </div>
            </div>
          </div>

          {/* Upload error */}
          {uploadError && (
            <div className="alert alert-error text-sm py-2 mt-4" role="alert">
              <span>{uploadError}</span>
              <button onClick={() => setUploadError(null)} className="btn btn-ghost btn-xs">✖</button>
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t border-base-300/30">
            <div>
              <span className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">Tên đăng nhập</span>
              <p className="text-sm font-medium mt-1">{user.username}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">Vai trò</span>
              <p className="text-sm font-medium mt-1 capitalize">{role || "Đã xác thực"}</p>
            </div>
            {user.student_id && (
              <div>
                <span className="text-xs uppercase tracking-wider text-base-content/40 font-semibold">Mã sinh viên</span>
                <p className="text-sm font-mono font-medium mt-1">{user.student_id}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <PhotoUploadCropModal
        isOpen={showCropModal}
        onClose={() => setShowCropModal(false)}
        onCropComplete={handleCropComplete}
      />
    </>
  )
}
