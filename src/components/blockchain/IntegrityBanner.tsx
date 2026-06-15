export function IntegrityBanner({
  isValid,
  totalBlocks,
  onCheck,
  onExport,
  isChecking,
}: {
  isValid: boolean
  totalBlocks: number
  onCheck: () => void
  onExport: () => void
  isChecking: boolean
}) {
  const isValidChain = isValid

  const bgColor = isValidChain
    ? "from-success/10 via-success/5 to-transparent border-success/30"
    : "from-error/10 via-error/5 to-transparent border-error/30"
  const glowClass = isValidChain ? "shadow-success/20" : "shadow-error/20"
  const icon = isValidChain ? "✅" : "⚠️"
  const statusText = isValidChain ? "Blockchain an toàn" : "Phát hiện bất thường!"
  const description = isValidChain
    ? `Tất cả ${totalBlocks} blocks đều hợp lệ và không có dữ liệu nào bị thay đổi.`
    : `Một hoặc nhiều blocks không hợp lệ đã được phát hiện trong chuỗi.`

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${bgColor} border shadow-lg ${glowClass} p-6`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl animate-pulse ${
            isValidChain ? "bg-success/20" : "bg-error/20"
          }`}
        />
        <div
          className={`absolute -bottom-10 -left-10 w-24 h-24 rounded-full blur-2xl animate-pulse ${
            isValidChain ? "bg-success/15" : "bg-error/15"
          }`}
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div
          className={`text-4xl w-16 h-16 flex items-center justify-center rounded-2xl ${
            isValidChain ? "bg-success/20" : "bg-error/20"
          }`}
        >
          {icon}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold">{statusText}</h3>
          <p className="text-sm text-base-content/60 mt-1">{description}</p>
          <p className="text-xs text-base-content/40 mt-1">
            Tổng số blocks: <span className="font-mono font-bold">{totalBlocks}</span>
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={onCheck}
            className={`btn btn-sm flex-1 sm:flex-none ${isValidChain ? "btn-success" : "btn-error"}`}
            disabled={isChecking}
          >
            {isChecking ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Đang kiểm tra...
              </>
            ) : (
              <>
                <span>🔍</span>
                Kiểm tra
              </>
            )}
          </button>
          <button
            onClick={onExport}
            className="btn btn-sm btn-ghost flex-1 sm:flex-none border border-base-300/30"
          >
            <span>📥</span>
            Xuất báo cáo
          </button>
        </div>
      </div>
    </div>
  )
}
