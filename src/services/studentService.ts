import apiClient from "../lib/axios"
import type { StudentListParams, CreateStudentPayload } from "../types"

export const studentService = {
  getAll: async (params: StudentListParams) => {
    const { data } = await apiClient.get("/students", { params })
    return data
  },
  getByMaSV: async (ma_sv: string) => {
    const { data } = await apiClient.get(`/students/${ma_sv}`)
    return data
  },
  create: async (payload: CreateStudentPayload) => {
    const { data } = await apiClient.post("/students", payload)
    return data
  },
  getDashboard: async () => {
    const { data } = await apiClient.get("/dashboard")
    return data
  },
}
