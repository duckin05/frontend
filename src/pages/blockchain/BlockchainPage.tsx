import { useState, useEffect, useCallback } from "react"
import { useBlockchain } from "../../hooks/useBlockchain"
import { blockchainService } from "../../services"
import { BlockCard } from "../../components/blockchain/BlockCard"
import { IntegrityBanner } from "../../components/blockchain/IntegrityBanner"
import { BlockchainTable } from "../../components/blockchain/BlockchainTable"
import { ChartCard } from "../../components/chart/ChartCard"

function SkeletonChain() {
  return (
    <div className="flex gap-3 overflow-hidden animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex-shrink-0 w-64 h-48 rounded-xl bg-base-300" />
      ))}
    </div>
  )
}

export function BlockchainPage() {
  const { blocks, isValid, isLoading, error, fetchBlocks } = useBlockchain()
  const [isChecking, setIsChecking] = useState(false)
  const [checkResult, setCheckResult] = useState<{ valid: boolean; message: string } | null>(null)

  // Fetch on mount
  useEffect(() => {
    fetchBlocks()
  }, [fetchBlocks])

  const handleCheckIntegrity = useCallback(async () => {
    try {
      setIsChecking(true)
      setCheckResult(null)
      // Re-fetch to get fresh data
      await fetchBlocks()
      // Also call the integrity API
      const res = await blockchainService.checkIntegrity()
      setCheckResult({
        valid: res.valid ?? isValid,
        message: res.valid
          ? "✅ Kiểm tra thành công! Tất cả blocks hợp lệ."
          : "⚠️ Phát hiện sự thay đổi dữ liệu trong chuỗi!",
      })
    } catch {
      setCheckResult({
        valid: isValid,
        message: isValid
          ? "✅ Chuỗi khối hiện tại ổn định."
          : "⚠️ Không thể xác minh đầy đủ.",
      })
    } finally {
      setIsChecking(false)
    }
  }, [fetchBlocks, isValid])

  const handleExport = useCallback(async () => {
    try {
      const response = await blockchainService.exportReport()
      const blob = new Blob([response.data], {
        type: response.headers?.["content-type"] || "application/octet-stream",
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `blockchain-integrity-report-${new Date().toISOString().slice(0, 10)}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch {
      // If export fails, try JSON export as fallback
      const jsonBlob = new Blob([JSON.stringify({ blocks, isValid, exportedAt: new Date().toISOString() }, null, 2)], {
        type: "application/json",
      })
      const url = window.URL.createObjectURL(jsonBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = `blockchain-report-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }
  }, [blocks, isValid])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <span className="text-4xl">⚠️</span>
        <p className="text-base-content/60 text-sm">{error}</p>
        <button onClick={fetchBlocks} className="btn btn-primary btn-sm">
          Thử lại
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">⛓️ Blockchain Explorer</h1>
        <p className="text-sm text-base-content/60 mt-1">
          Duyệt và kiểm tra toàn bộ chuỗi khối của hệ thống quản lý sinh viên
        </p>
      </div>

      {/* Integrity Banner */}
      <IntegrityBanner
        isValid={checkResult?.valid ?? isValid}
        totalBlocks={blocks.length}
        onCheck={handleCheckIntegrity}
        onExport={handleExport}
        isChecking={isChecking}
      />

      {/* Check Result Toast */}
      {checkResult && (
        <div
          className={`alert ${checkResult.valid ? "alert-success" : "alert-error"} shadow-lg`}
        >
          <span>{checkResult.message}</span>
          <button
            onClick={() => setCheckResult(null)}
            className="btn btn-ghost btn-xs"
          >
            ✖
          </button>
        </div>
      )}

      {/* Visual Chain Overview */}
      <ChartCard title="Tổng quan chuỗi khối" subtitle="Cuộn ngang để xem tất cả blocks">
        {isLoading ? (
          <SkeletonChain />
        ) : (
          <div className="flex gap-1 pb-2 overflow-x-auto">
            {blocks.map((block, idx) => (
              <div key={block.index} className="flex items-center">
                <BlockCard block={block} isValid={block.isValid} />
                {idx < blocks.length - 1 && (
                  <div className="flex-shrink-0 flex items-center mx-2">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-primary/40 to-secondary/40" />
                    <svg
                      className="w-4 h-4 text-secondary/40"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ChartCard>

      {/* Detail Table */}
      <ChartCard title="Chi tiết Blocks" subtitle="Danh sách blocks theo thứ tự mới nhất">
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-base-300 rounded" />
            ))}
          </div>
        ) : (
          <BlockchainTable blocks={blocks} />
        )}
      </ChartCard>
    </div>
  )
}
