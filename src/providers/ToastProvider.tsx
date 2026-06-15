import { type ReactNode } from "react"
import { useUIStore } from "../store"

export function ToastProvider({ children }: { children: ReactNode }) {
  const toasts = useUIStore((s) => s.toasts)
  const removeToast = useUIStore((s) => s.removeToast)
  return (
    <>
      {children}
      <div className="toast toast-end toast-top z-50">
        {toasts.map((t) => (
          <div key={t.id} className={`alert alert-${t.type}`}>
            <span>{t.message}</span>
            <button onClick={() => removeToast(t.id)} className="btn btn-ghost btn-xs">x</button>
          </div>
        ))}
      </div>
    </>
  )
}
