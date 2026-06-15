import apiClient from "../lib/axios"

export const profileService = {
  getProfile: async () => {
    const { data } = await apiClient.get("/profile")
    return data
  },
  changePassword: async (old_password: string, new_password: string) => {
    const { data } = await apiClient.put("/change-password", { old_password, new_password })
    return data
  },
  uploadPhoto: async (file: File) => {
    const formData = new FormData()
    formData.append("photo", file)
    const { data } = await apiClient.put("/profile/photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  },
}
