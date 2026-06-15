import { useState, useEffect, useCallback } from "react"
import { studentService } from "../services"
import { blockchainService } from "../services"
import type { IStudent } from "../types"
import type { IBlock } from "../types"

// Mock data for demo when API is unavailable
function generateMockData(): {
  students: IStudent[]
  blocks: IBlock[]
  isValid: boolean
  totalStudents: number
} {
  const mockStudents: IStudent[] = [
    { ma_sv: "2823250017", ten: "Nguyễn Đức Kiên", lop: "TH28.21", timestamp: "2026-03-23T18:05:08", created_by: "admin" },
    { ma_sv: "2823250018", ten: "Đào Đức Bình", lop: "TH28.21", timestamp: "2026-03-23T18:05:15", created_by: "admin" },
    { ma_sv: "2823250019", ten: "Cảnh", lop: "TH28.21", timestamp: "2026-03-23T18:05:27", created_by: "admin" },
    { ma_sv: "2823250010", ten: "Giang", lop: "TH28.21", timestamp: "2026-03-23T18:05:37", created_by: "admin" },
    { ma_sv: "2823250011", ten: "Xuyến", lop: "TH28.21", timestamp: "2026-03-23T18:05:47", created_by: "admin" },
    { ma_sv: "2823250000", ten: "Nguyễn KIKI", lop: "TH28.21", timestamp: "2026-06-05T23:37:22", created_by: "student" },
    { ma_sv: "2823250001", ten: "Trần Văn A", lop: "TH28.20", timestamp: "2026-06-06T10:00:00", created_by: "admin" },
    { ma_sv: "2823250002", ten: "Lê Thị B", lop: "TH28.22", timestamp: "2026-06-06T11:30:00", created_by: "admin" },
  ]

  const baseHash = "19f06af024f9c70ecedeae3653b039986e5a6aedfbcd0ccd0dba4e2d555c2c59"
  const mockBlocks: IBlock[] = [
    { index: 0, timestamp: "2026-03-23T18:04:46", data: "Genesis Block", previous_hash: "0", hash: baseHash, isValid: true },
    ...mockStudents.map((s, i) => ({
      index: i + 1,
      timestamp: s.timestamp,
      data: { ma_sv: s.ma_sv, ten: s.ten, lop: s.lop },
      previous_hash: i === 0 ? baseHash : `hash_${i}`,
      hash: `hash_${i + 1}`,
      isValid: true,
    })),
  ]

  return {
    students: mockStudents,
    blocks: mockBlocks,
    isValid: true,
    totalStudents: mockStudents.length,
  }
}

const mockData = generateMockData()

export interface DashboardData {
  totalStudents: number
  isValid: boolean
  totalBlocks: number
  students: IStudent[]
  recentStudents: IStudent[]
  classDistribution: { name: string; value: number }[]
  studentGrowth: { date: string; count: number }[]
  timeline: { id: string; icon: string; title: string; description: string; timestamp: string }[]
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [studentsRes, blockchainRes] = await Promise.all([
        studentService.getAll({ q: "", page: 1, limit: 100 }),
        blockchainService.getAll(),
      ])

      const students: IStudent[] = studentsRes?.data || []
      const blocks: IBlock[] = blockchainRes?.blocks || []
      const isValid = blockchainRes?.valid ?? true

      processData(students, blocks, isValid)
    } catch {
      // Use mock data when API is not available
      processData(mockData.students, mockData.blocks, mockData.isValid)
    }
  }, [])

  function processData(students: IStudent[], blocks: IBlock[], isValid: boolean) {
    // Class distribution
    const classMap = new Map<string, number>()
    students.forEach((s) => {
      const lop = s.lop || "Chưa xếp"
      classMap.set(lop, (classMap.get(lop) || 0) + 1)
    })
    const classDistribution = Array.from(classMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)

    // Student growth (by month)
    const monthMap = new Map<string, number>()
    const sortedStudents = [...students].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
    sortedStudents.forEach((s) => {
      const date = new Date(s.timestamp)
      const key = `${date.getMonth() + 1}/${date.getFullYear()}`
      monthMap.set(key, (monthMap.get(key) || 0) + 1)
    })
    const studentGrowth = Array.from(monthMap.entries()).map(([date, count]) => ({ date, count }))

    // Recent students (last 5)
    const recentStudents = [...students]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)

    // Timeline
    const timeline = recentStudents.map((s) => ({
      id: s.ma_sv,
      icon: "🎓",
      title: `Thêm sinh viên ${s.ten}`,
      description: `Mã SV: ${s.ma_sv} - Lớp: ${s.lop}`,
      timestamp: s.timestamp,
    }))

    setData({
      totalStudents: students.length,
      isValid,
      totalBlocks: blocks.length,
      students,
      recentStudents,
      classDistribution,
      studentGrowth,
      timeline,
    })
    setIsLoading(false)
  }

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return { data, isLoading, error, refetch: fetchDashboard }
}
