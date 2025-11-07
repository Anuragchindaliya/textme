import { GoogleGenAI } from "@google/genai"
import { Loader } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import remarkGfm from "remark-gfm"
import Sidebar from "../Notes/components/Sidebar"

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// const GEMINI_KEY = "";

interface Message {
  role: "user" | "ai"
  text: string
}

export default function App() {
  const {theme}=useTheme();
  const syntaxTheme = theme === "dark" ? oneDark : oneLight; // Dynamically set the theme
  const [apiKey, setApiKey] = useState<string | null>(() => {
    return GEMINI_KEY || localStorage.getItem("ai_key")
  })
  const [platform, setPlatform] = useState<string>(() => {
    return localStorage.getItem("ai_platform") || "gemini"
  })
  const [showKeyModal, setShowKeyModal] = useState(!apiKey)

  const [ai, setAi] = useState<GoogleGenAI | null>(
    apiKey ? new GoogleGenAI({ apiKey }) : null
  )

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

  // Handle Gemini call
  const callGemini = async (prompt: string) => {
    if (!ai) {
      alert("Please provide an API key first.")
      setShowKeyModal(true)
      return
    }
    setLoading(true)
    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      })
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

  const handleSaveKey = () => {
    if (!apiKey?.trim()) {
      alert("Please enter a valid API key.")
      return
    }
    localStorage.setItem("ai_key", apiKey)
    localStorage.setItem("ai_platform", platform)
    setAi(new GoogleGenAI({ apiKey }))
    setShowKeyModal(false)
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b dark:from-gray-900 to-black dark:text-white">
      {/* Sidebar */}
      <div className="absolute top-4 left-4 z-9">
        <Sidebar />
      </div>
      

      {/* Header */}
      <header className="p-4 text-center text-2xl font-bold border-b dark:border-gray-700">
        🤖 Gemini AI Chat
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-6xl m-auto space-y-4">
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
                  className={`max-w-[80%] p-4 rounded-2xl whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "dark:bg-blue-600 bg-blue-100 dark:text-white rounded-br-none"
                      : "dark:bg-gray-800 bg-gray-100 dark:text-gray-100 rounded-bl-none"
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
                              style={syntaxTheme}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code
                              className="dark:bg-gray-700 bg-gray-300 px-1.5 py-0.5 rounded text-sm"
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
      </div>

      {/* Input Section */}
      <div className="border-t dark:border-gray-700 dark:bg-gray-950 p-4 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 p-3 dark:bg-gray-800 bg-gray-100 dark:text-white rounded-xl outline-none focus:ring-2 dark:focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className={`px-5 py-2 rounded-xl font-semibold flex gap-4 ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {loading ? <Loader className="animate-spin" /> : "Send"}
        </button>
        <button
          onClick={clearChat}
          className="text-sm text-gray-400 hover:text-red-400"
        >
          Clear
        </button>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed  flex items-center justify-center bg-black bg-opacity-60 z-50 top-[64px] left-0 w-full h-full">
          <div className="dark:bg-gray-900 bg-white dark:text-white p-6 rounded-2xl w-96 shadow-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-center">
              🔑 Enter AI API Key
            </h2>
            <label className="block mb-2 text-sm dark:text-gray-300">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full mb-4 p-2 rounded dark:bg-gray-800 dark:text-white border border-gray-700"
            >
              <option value="gemini">Gemini</option>
              <option disabled value="openai">
                OpenAI (coming soon)
              </option>
            </select>

            <label className="block mb-2 text-sm dark:text-gray-300">API Key</label>
            <input
              type="password"
              value={apiKey || ""}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="w-full mb-6 p-2 rounded dark:bg-gray-800 dark:text-white border dark:border-gray-700"
            />

            <button
              onClick={handleSaveKey}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
            >
              Save Key
            </button>
          </div>
        </div>
      )}
      {/* <Dialog open={showKeyModal} onOpenChange={setShowKeyModal}>
        <DialogContent>
            <DialogTitle className="text-xl font-bold mb-4 text-center">
              🔑 Enter AI API Key
            </DialogTitle>
            <label className="block mb-2 text-sm text-gray-300">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-gray-800 text-white border border-gray-700"
            >
              <option value="gemini">Gemini</option>
              <option disabled value="openai">
                OpenAI (coming soon)
              </option>
            </select>

            <label className="block mb-2 text-sm text-gray-300">API Key</label>
            <input
              type="password"
              value={apiKey || ""}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="w-full mb-6 p-2 rounded bg-gray-800 text-white border border-gray-700"
            />

            <button
              onClick={handleSaveKey}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
            >
              Save Key
            </button>
        </DialogContent>
      </Dialog> */}
    </div>
  )
}
