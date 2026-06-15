import { useState, useRef } from "react"
import { useExcel } from "../../hooks/useExcel"

export function ImportPage() {
  const { importExcel, exportExcel, isLoading } = useExcel()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setResult(null)
  }

  const handleImport = async () => {
    if (!file) return
    try {
      setResult(null)
      const response = await importExcel(file)
      setResult({
        success: response.success,
        message: response.message || "Import thành công!",
      })
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Import thất bại"
      setResult({ success: false, message: msg })
    }
  }

  const handleExport = async () => {
    try {
      setResult(null)
      await exportExcel()
      setResult({ success: true, message: "Xuất file Excel thành công!" })
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Xuất thất bại"
      setResult({ success: false, message: msg })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">📁 Import / Export Excel</h1>
        <p className="text-sm text-base-content/60 mt-1">
          Nhập danh sách sinh viên từ file Excel hoặc xuất dữ liệu hiện tại
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Import Card */}
        <div className="card bg-base-100 border border-base-300/30 shadow-sm">
          <div className="card-body p-6">
            <h3 className="card-title text-base font-semibold mb-2">📥 Import từ Excel</h3>
            <p className="text-sm text-base-content/60 mb-4">
              Chọn file .xlsx chứa danh sách sinh viên. File cần có các cột: <strong>Mã SV</strong>, <strong>Họ tên</strong>, <strong>Lớp</strong>.
            </p>

            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="file-input file-input-bordered file-input-primary w-full"
                disabled={isLoading}
              />

              {file && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-base-200/50 border border-base-300/20">
                  <span className="text-2xl">📄</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-base-content/40">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={handleImport}
                    className="btn btn-primary btn-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <><span className="loading loading-spinner loading-xs"></span> Đang nhập...</>
                    ) : (
                      "Nhập dữ liệu"
                    )}
                  </button>
                </div>
              )}

              {!file && (
                <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-base-300/30 rounded-xl bg-base-200/20">
                  <span className="text-4xl mb-3 text-base-content/30">📂</span>
                  <p className="text-sm text-base-content/40">Chọn file Excel để bắt đầu</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Export Card */}
        <div className="card bg-base-100 border border-base-300/30 shadow-sm">
          <div className="card-body p-6">
            <h3 className="card-title text-base font-semibold mb-2">📤 Export ra Excel</h3>
            <p className="text-sm text-base-content/60 mb-4">
              Xuất toàn bộ danh sách sinh viên hiện tại ra file Excel (.xlsx).
            </p>

            <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-base-300/30 rounded-xl bg-base-200/20">
              <span className="text-4xl mb-3 text-base-content/30">📊</span>
              <p className="text-sm text-base-content/40 mb-4">
                Tải về danh sách sinh viên dưới dạng file Excel
              </p>
              <button
                onClick={handleExport}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <><span className="loading loading-spinner loading-xs"></span> Đang xuất...</>
                ) : (
                  <>
                    <span>📥</span>
                    Xuất Excel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Result Alert */}
      {result && (
        <div className={`alert ${result.success ? "alert-success" : "alert-error"} shadow-lg`}>
          <span>{result.message}</span>
          <button onClick={() => setResult(null)} className="btn btn-ghost btn-xs">✖</button>
        </div>
      )}
    </div>
  )
}
