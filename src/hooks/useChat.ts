import { useCallback } from "react"
import { useChatStore } from "../store"
import { chatService } from "../services"

export function useChat() {
  const { messages, isTyping, addMessage, setTyping, clearMessages } = useChatStore()
  const sendMessage = useCallback(async (text: string) => {
    const userMsg = { id: Date.now().toString(), role: "user" as const, text, timestamp: new Date().toISOString() }
    addMessage(userMsg)
    setTyping(true)
    try {
      const response = await chatService.sendMessage(text)
      addMessage({ id: (Date.now() + 1).toString(), role: "bot" as const, text: response.reply, timestamp: new Date().toISOString() })
    } catch {
      addMessage({ id: (Date.now() + 1).toString(), role: "bot" as const, text: "Xin loi, da co loi xay ra.", timestamp: new Date().toISOString() })
    } finally {
      setTyping(false)
    }
  }, [addMessage, setTyping])
  return { messages, isTyping, sendMessage, clearMessages }
}
