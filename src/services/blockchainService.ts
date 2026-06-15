import apiClient from "../lib/axios"

export const blockchainService = {
  getAll: async () => {
    const { data } = await apiClient.get("/blockchain")
    return data
  },
  checkIntegrity: async () => {
    const { data } = await apiClient.get("/blockchain/integrity")
    return data
  },
  exportReport: async () => {
    const response = await apiClient.get("/export-integrity", { responseType: "blob" })
    return response
  },
}
