import { useDashboard } from "../../hooks/useDashboard"
import { useAuthStore } from "../../store"
import { useBlockchainIntegrity } from "../../providers"
import { KPICard } from "../../components/data-display/KPICard"
import { ChartCard } from "../../components/chart/ChartCard"
import { StudentGrowthChart } from "../../components/chart/StudentGrowthChart"
import { ClassDistributionChart } from "../../components/chart/ClassDistributionChart"
import { Timeline } from "../../components/data-display/Timeline"
import { DashboardQuickActions } from "../../components/data-display/DashboardQuickActions"

const sparklineData = [
  { value: 2 }, { value: 3 }, { value: 5 }, { value: 5 },
  { value: 6 }, { value: 6 }, { value: 7 }, { value: 8 },
]

function SkeletonCard() {
  return (
    <div className="card bg-base-100 p-5 border border-base-300/30 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-base-300" />
        <div className="w-14 h-5 rounded-full bg-base-300" />
      </div>
      <div className="h-4 w-24 bg-base-300 rounded mb-2" />
      <div className="h-8 w-16 bg-base-300 rounded" />
    </div>
  )
}

function SkeletonChart() {
  return (
    <div className="card bg-base-100 p-5 border border-base-300/30 animate-pulse">
      <div className="h-5 w-36 bg-base-300 rounded mb-4" />
      <div className="h-48 bg-base-300 rounded" />
    </div>
  )
}

export function AdminDashboardPage() {
  const username = useAuthStore((s) => s.user?.username)
  const { data, isLoading, error, refetch } = useDashboard()
  const { isValid, isChecking, check, dismiss, isDismissed, invalidBlocks, showDetail, setShowDetail } = useBlockchainIntegrity()

  const blockchainOk = isValid === null || isValid === true
  const showWarning = isValid === false && !isDismissed

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <span className="text-4xl">⚠️</span>
        <p className="text-base-content/60 text-sm">{error}</p>
        <button onClick={refetch} className="btn btn-primary btn-sm">
          Thử lại
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-bold">📊 Dashboard</h1>
          <span className="badge badge-primary gap-1">👑 Admin</span>
        </div>
        <p className="text-sm text-base-content/60 mt-1">
          Xin chào, {username || "Admin"} | Tổng quan hệ thống quản lý sinh viên
        </p>
      </div>

      {/* Integrity Warning Banner - Hiển thị khi blockchain bị thay đổi */}
      {showWarning && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-error/20 via-error/10 to-transparent border-2 border-error/40 shadow-lg shadow-error/30 animate-pulse">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-error/30 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-error/20 blur-2xl" style={{ animationDelay: "1s" }} />
          </div>
          <div className="relative z-10 p-6">
            <div className="flex items-start gap-4">
              <div className="text-5xl w-20 h-20 flex items-center justify-center rounded-2xl bg-error/30 flex-shrink-0">
                🚨
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-extrabold text-error">
                  ⚠️ CẢNH BÁO: Dữ liệu Blockchain đã bị thay đổi!
                </h3>
                <p className="text-base text-error/80 mt-2 font-medium">
                  Phát hiện sự thay đổi trái phép trong file <code className="px-2 py-0.5 rounded bg-error/20 font-mono text-sm">blockchain_data.json</code>.
                  Các hash không khớp — dữ liệu có thể đã bị can thiệp từ bên ngoài.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={check}
                    className="btn btn-error btn-sm gap-2"
                    disabled={isChecking}
                  >
                    {isChecking ? (
                      <><span className="loading loading-spinner loading-xs"></span> Đang kiểm tra...</>
                    ) : (
                      <><span>🔍</span> Kiểm tra lại</>
                    )}
                  </button>
                  <button
                    onClick={() => setShowDetail(!showDetail)}
                    className="btn btn-ghost btn-sm gap-2 border border-error/30 text-error/70 hover:text-error"
                  >
                    <span>📋</span> {showDetail ? "Ẩn chi tiết" : "Xem chi tiết"}
                  </button>
                  <button
                    onClick={dismiss}
                    className="btn btn-ghost btn-sm gap-2 border border-error/30 text-error/70 hover:text-error"
                  >
                    <span>✕</span> Bỏ qua cảnh báo
                  </button>
                  <span className="text-xs text-error/50 self-center">
                    Khôi phục dữ liệu gốc trong file <code className="font-mono">blockchain_data.json</code> để hết cảnh báo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integrity Detail Panel - hiển thị khi user bấm Xem chi tiết */}
      {showDetail && invalidBlocks.length > 0 && (
        <div className="rounded-2xl bg-base-100 border-2 border-error/30 shadow-lg overflow-hidden">
          <div className="bg-error/10 px-5 py-3 border-b border-error/20 flex items-center gap-2">
            <span className="text-lg">🔍</span>
            <h3 className="font-semibold text-sm">Chi tiết các block bị thay đổi</h3>
            <span className="text-xs text-base-content/50 ml-auto">{invalidBlocks.length} block(s) không hợp lệ</span>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra table-xs w-full">
              <thead>
                <tr className="text-xs uppercase text-base-content/60">
                  <th>Block</th>
                  <th>Thời gian</th>
                  <th>Vấn đề</th>
                  <th>Stored Hash</th>
                  <th>Computed Hash</th>
                  <th>Dữ liệu</th>
                </tr>
              </thead>
              <tbody>
                {invalidBlocks.map((b) => (
                  <tr key={b.index}>
                    <td className="font-mono">#{b.index}</td>
                    <td className="text-xs">{b.timestamp}</td>
                    <td>
                      {b.issue === "hash_mismatch" ? (
                        <span className="badge badge-error badge-xs gap-1">Hash mismatch</span>
                      ) : (
                        <span className="badge badge-warning badge-xs gap-1">Chain broken</span>
                      )}
                    </td>
                    <td className="font-mono text-[10px] max-w-[120px] truncate" title={b.storedHash}>
                      {b.storedHash}
                    </td>
                    <td className="font-mono text-[10px] max-w-[120px] truncate text-error" title={b.computedHash}>
                      {b.computedHash}
                    </td>
                    <td
                      className="text-xs max-w-[200px] truncate"
                      title={typeof b.data === "object" && b.data !== null ? JSON.stringify(b.data, null, 2) : String(b.data)}
                    >
                      {typeof b.data === "object" && b.data !== null
                        ? JSON.stringify(b.data).slice(0, 60) + "..."
                        : String(b.data).slice(0, 60)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-base-200/50 px-5 py-2 text-xs text-base-content/40 text-center">
            Dữ liệu hiển thị được đọc trực tiếp từ file <code className="font-mono">blockchain_data.json</code> trên disk
          </div>
        </div>
      )}

      {/* KPI Cards Row - Admin sees all data */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KPICard
            icon={<span className="text-lg">👥</span>}
            label="Tổng số sinh viên"
            value={data?.totalStudents ?? 0}
            subtext={`${data?.totalBlocks ?? 0} blocks trên blockchain`}
            sparklineData={sparklineData}
            color="blue"
          />
          <KPICard
            icon={<span className="text-lg">✅</span>}
            label="Trạng thái Blockchain"
            value={blockchainOk ? "An toàn" : "Không hợp lệ"}
            subtext={blockchainOk ? "Tất cả blocks hợp lệ" : "Phát hiện bất thường"}
            trend={blockchainOk ? { value: 100, isUp: true } : { value: 0, isUp: false }}
            color={blockchainOk ? "green" : "red"}
            gradient
          />
          <KPICard
            icon={<span className="text-lg">⛓️</span>}
            label="Tổng số Blocks"
            value={data?.totalBlocks ?? 0}
            subtext={`Bao gồm 1 block genesis`}
            sparklineData={[
              { value: 1 }, { value: 2 }, { value: 3 },
              { value: 4 }, { value: 5 }, { value: 6 },
              { value: 7 }, { value: data?.totalBlocks ?? 8 },
            ]}
            color="primary"
          />
        </div>
      )}

      {/* Charts Row - Admin only */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SkeletonChart />
          <SkeletonChart />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Sinh viên theo thời gian" subtitle="Biểu đồ tăng trưởng">
            <StudentGrowthChart data={data?.studentGrowth || []} />
          </ChartCard>
          <ChartCard title="Phân bố lớp" subtitle="Số lượng sinh viên theo lớp">
            <ClassDistributionChart data={data?.classDistribution || []} />
          </ChartCard>
        </div>
      )}

      {/* Bottom Row: Recent Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Recent Activity (3/5 width) */}
        <div className="lg:col-span-3">
          <div className="card bg-base-100 border border-base-300/30 shadow-sm h-full">
            <div className="card-body p-5">
              <h3 className="card-title text-base font-semibold mb-3">📋 Hoạt động gần đây</h3>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-base-300" />
                      <div className="flex-1">
                        <div className="h-4 w-40 bg-base-300 rounded mb-1" />
                        <div className="h-3 w-24 bg-base-300 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Timeline items={data?.timeline || []} />
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions (2/5 width) */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 border border-base-300/30 shadow-sm h-full">
            <div className="card-body p-5">
              <h3 className="card-title text-base font-semibold mb-3">⚡ Quick Actions</h3>
              <DashboardQuickActions />
            </div>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-base-content/30 py-4">
        Lần cập nhật gần nhất: {new Date().toLocaleString("vi-VN")} | Bạn đang đăng nhập với quyền Admin
      </div>
    </div>
  )
}
