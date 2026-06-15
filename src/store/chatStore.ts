import { create } from "zustand"
import type { ChatMessage } from "../types"

interface ChatState {
  messages: ChatMessage[]
  isTyping: boolean
  addMessage: (msg: ChatMessage) => void
  setTyping: (typing: boolean) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set) => {
  return {
    messages: [],
    isTyping: false,
    addMessage: (msg) => set((state) => {
      return { messages: [...state.messages, msg] }
    }),
    setTyping: (typing) => set({ isTyping: typing }),
    clearMessages: () => set({ messages: [] }),
  }
})
