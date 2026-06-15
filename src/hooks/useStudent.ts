import { useState, useCallback } from "react"
import { studentService } from "../services"
import type { IStudent } from "../types"

export function useStudent() {
  const [student, setStudent] = useState<IStudent | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStudent = useCallback(async (ma_sv: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await studentService.getByMaSV(ma_sv)
      setStudent(response.data || null)
    } catch (err: any) {
      setError(err.message || "Loi khi tai thong tin")
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { student, isLoading, error, fetchStudent }
}
