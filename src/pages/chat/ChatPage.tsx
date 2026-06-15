import { useState, useRef, useEffect } from "react"
import { useChat } from "../../hooks/useChat"

export function ChatPage() {
  const { messages, isTyping, sendMessage, clearMessages } = useChat()
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setInput("")
    await sendMessage(text)
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-10rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">🤖 Trợ lý AI</h1>
          <p className="text-sm text-base-content/60 mt-1">
            Hỏi về hệ thống, blockchain, sinh viên và thao tác dữ liệu
          </p>
        </div>
        {messages.length > 0 && (
          <button onClick={clearMessages} className="btn btn-ghost btn-sm">
            🗑️ Xóa lịch sử
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col bg-base-100 border border-base-300/30 shadow-sm rounded-2xl overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <span className="text-6xl mb-4">🤖</span>
              <h3 className="text-lg font-semibold text-base-content/60 mb-2">
                Bắt đầu trò chuyện
              </h3>
              <p className="text-sm text-base-content/40 max-w-md">
                Hãy hỏi tôi về hệ thống quản lý sinh viên, blockchain, 
                hoặc cách xuất nhập dữ liệu Excel.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {["Blockchain là gì?", "Xem danh sách sinh viên", "Hướng dẫn import Excel"].map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q)
                      inputRef.current?.focus()
                    }}
                    className="btn btn-outline btn-sm btn-ghost border-base-300/30"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-image avatar">
                  <div className={`w-8 h-8 rounded-full ${msg.role === "user" ? "bg-primary" : "bg-secondary"} flex items-center justify-center text-white text-xs`}>
                    {msg.role === "user" ? "👤" : "🤖"}
                  </div>
                </div>
                <div
                  className={`chat-bubble ${
                    msg.role === "user"
                      ? "chat-bubble-primary"
                      : "bg-base-200 text-base-content"
                  } max-w-[80%]`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <p className="text-[10px] mt-1 opacity-50">
                    {new Date(msg.timestamp).toLocaleTimeString("vi-VN")}
                  </p>
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="chat chat-start">
              <div className="chat-image avatar">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white text-xs">
                  🤖
                </div>
              </div>
              <div className="chat-bubble bg-base-200 text-base-content">
                <span className="loading loading-dots loading-xs"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-base-300/30 p-4 bg-base-100">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              className="input input-bordered flex-1"
              disabled={isTyping}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!input.trim() || isTyping}
            >
              {isTyping ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Gửi"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
