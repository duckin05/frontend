export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="text-5xl mb-4">⚠️</span>
      <h3 className="text-lg font-semibold text-error mb-2">Đã có lỗi xảy ra</h3>
      {message && <p className="text-sm text-base-content/40 max-w-sm mb-4">{message}</p>}
      {onRetry && (
        <button onClick={onRetry} className="btn btn-outline btn-sm">
          Thử lại
        </button>
      )}
    </div>
  )
}
