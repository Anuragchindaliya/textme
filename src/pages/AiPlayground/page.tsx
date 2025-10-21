import { GoogleGenAI } from "@google/genai"
import { Loader } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import remarkGfm from "remark-gfm"
interface Message {
  role: "user" | "ai"
  text: string
}

// const genAI = new GoogleGenAI(import.meta.env.VITE_GEMINI_API_KEY);
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY })

export default function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("chat_history")
    return saved ? JSON.parse(saved) : []
  })
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const callGemini = async (prompt: string) => {
    setLoading(true)
    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      })
      // const result = await model.generateContent(prompt);
      const text = result.text || "No response"

      setMessages((prev) => [...prev, { role: "ai", text }])
    } catch (error) {
      console.error("Gemini Error:", error)
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ Error fetching response." },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSend = () => {
    if (!input.trim()) return
    const userMessage = { role: "user" as const, text: input }
    setMessages((prev) => [...prev, userMessage])
    callGemini(input)
    setInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) handleSend()
  }

  const clearChat = () => {
    if (confirm("Clear chat history?")) {
      setMessages([])
      localStorage.removeItem("chat_history")
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="p-4 text-center text-2xl font-bold border-b border-gray-700">
        🤖 Gemini AI Chat
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            Start chatting with Gemini 👇
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-800 text-gray-100 rounded-bl-none"
                }`}
              >
                {msg.role === "ai" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({
                        inline,
                        className,
                        children,
                        ...props
                      }: {
                        inline?: boolean
                        className?: string
                        children?: React.ReactNode
                      }) {
                        const match = /language-(\w+)/.exec(className || "")
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code
                            className="bg-gray-700 px-1.5 py-0.5 rounded text-sm"
                            {...props}
                          >
                            {children}
                          </code>
                        )
                      },
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Section */}
      <div className="border-t border-gray-700 bg-gray-950 p-4 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 p-3 bg-gray-800 text-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className={`px-5 py-2 rounded-xl font-semibold flex gap-4 ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? <Loader className="animate-spin" /> : "Send"}
          {/* {loading ? "..." : "Send"} */}
        </button>
        <button
          onClick={clearChat}
          className="text-sm text-gray-400 hover:text-red-400"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
