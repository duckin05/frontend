import apiClient from "../lib/axios"

export const chatService = {
  sendMessage: async (message: string) => {
    const { data } = await apiClient.post("/chat", { message })
    return data
  },
}
