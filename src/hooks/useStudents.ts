import { useCallback } from "react"
import { useStudentStore } from "../store"
import { studentService } from "../services"
import type { StudentListParams } from "../types"

export function useStudents() {
  const { students, total, params, isLoading, error, setStudents, setParams, setLoading, setError } = useStudentStore()

  const fetchStudents = useCallback(async (overrideParams?: Partial<StudentListParams>) => {
    try {
      setLoading(true)
      setError(null)
      const mergedParams = { ...params, ...overrideParams }
      const response = await studentService.getAll(mergedParams)
      setStudents(response.data || [], response.total || 0)
    } catch (err: any) {
      setError(err.message || "Loi khi tai danh sach")
    } finally {
      setLoading(false)
    }
  }, [params, setStudents, setParams, setLoading, setError])

  return { students, total, params, isLoading, error, fetchStudents, setParams }
}
