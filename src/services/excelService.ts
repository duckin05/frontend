import apiClient from "../lib/axios"

export const excelService = {
  importExcel: async (file: File) => {
    const formData = new FormData()
    formData.append("excel_file", file)
    const { data } = await apiClient.post("/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data
  },
  exportExcel: async () => {
    const response = await apiClient.get("/export", { responseType: "blob" })
    return response
  },
}
