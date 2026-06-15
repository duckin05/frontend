import apiClient from "../lib/axios"
import type { LoginPayload, RegisterPayload } from "../types"

export const authService = {
  login: async (payload: LoginPayload) => {
    const { data } = await apiClient.post("/login", payload)
    return data
  },
  register: async (payload: RegisterPayload) => {
    const { data } = await apiClient.post("/register", payload)
    return data
  },
  studentLogin: async (payload: LoginPayload) => {
    const { data } = await apiClient.post("/student/login", payload)
    return data
  },
  studentRegister: async (formData: FormData) => {
    const { data } = await apiClient.post("/student/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  },
}
