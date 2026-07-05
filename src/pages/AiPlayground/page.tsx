import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { useGoogleLogin } from "@react-oauth/google"
import { KeyRound, Eye, EyeOff, Sparkles, HelpCircle } from "lucide-react"

import Sidebar from "../Notes/components/Sidebar"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectCurrentEmail, setEmail } from "../../features/auth/authSlice"
import { ChatContainer } from "./ChatContainer"
import { UsageDashboard } from "./UsageDashboard"
import { Message, UsageStats, UserSession, Product, MapData } from "./types"
import { estimateTokens, parseSSEStream } from "./utils"

// const BACKEND_URL = "http://localhost:5001/api/ai/playground"
// https://cue-king-nodejs.onrender.com
const BACKEND_URL = "https://cue-king-nodejs.onrender.com/api/ai/playground"

export default function AiPlayground() {
  const { theme } = useTheme()
  const dispatch = useAppDispatch()
  const reduxEmail = useAppSelector(selectCurrentEmail)

  // 1. State for API Key
  const [apiKey, setApiKey] = useState<string | null>(() => {
    return localStorage.getItem("ai_key") || null
  })
  const [inputKey, setInputKey] = useState("")
  const [showKeyText, setShowKeyText] = useState(false)

  // 2. State for User Session
  const [session, setSession] = useState<UserSession>(() => {
    const isLoggedIn = !!reduxEmail
    return {
      isLoggedIn,
      email: reduxEmail || undefined,
    }
  })

  // Sync session when Redux email changes
  useEffect(() => {
    setSession({
      isLoggedIn: !!reduxEmail,
      email: reduxEmail || undefined,
    })
  }, [reduxEmail])

  // 3. State for Chat History & Save History Preference
  const [saveHistory, setSaveHistory] = useState<boolean>(() => {
    const savedFlag = localStorage.getItem("ai_save_history")
    if (reduxEmail) return true
    return savedFlag === "true"
  })

  // Sync save history preference when login status changes
  useEffect(() => {
    if (reduxEmail) {
      setSaveHistory(true)
    }
  }, [reduxEmail])

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("ai_chat_history")
    if (saved && (saveHistory || reduxEmail)) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        return []
      }
    }
    return []
  })

  // Save messages to local storage whenever they change
  useEffect(() => {
    if (saveHistory || reduxEmail) {
      localStorage.setItem("ai_chat_history", JSON.stringify(messages))
    } else {
      localStorage.removeItem("ai_chat_history")
    }
    localStorage.setItem("ai_save_history", saveHistory ? "true" : "false")
  }, [messages, saveHistory, reduxEmail])

  // 4. Token & Usage Analytics State
  const [usageStats, setUsageStats] = useState<UsageStats>(() => {
    const savedStats = localStorage.getItem("ai_usage_stats")
    if (savedStats) {
      try {
        return JSON.parse(savedStats)
      } catch (e) {}
    }
    return {
      promptTokens: 0,
      responseTokens: 0,
      totalTokens: 0,
      ceiling: 50000,
    }
  })

  useEffect(() => {
    localStorage.setItem("ai_usage_stats", JSON.stringify(usageStats))
  }, [usageStats])

  // 5. Sidebar Toggle State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // 6. Google Login Hook
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
            Accept: "application/json",
          },
        },
      )
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user profile")
          return res.json()
        })
        .then((data) => {
          if (data.email) {
            const userInfo = {
              email: data.email,
              id: data.id || data.sub || "",
            }
            dispatch(setEmail(userInfo))
            localStorage.setItem("userInfo", JSON.stringify(userInfo))
            setSaveHistory(true)
          }
        })
        .catch((err) => {
          console.error("Google Auth failed details:", err)
          alert("Failed to sign in with Google.")
        })
    },
    onError: () => {
      console.error("Google Sign-In Failed")
    },
  })

  // 7. Save API Key handler
  const handleSaveApiKey = () => {
    const trimmed = inputKey.trim()
    if (!trimmed) {
      alert("Please enter a valid API key.")
      return
    }
    // Warn if the API key does not look like a Google AI Studio key
    if (!trimmed.startsWith("AIzaSy") && !trimmed.startsWith("AQ")) {
      const confirmSave = confirm(
        "Warning: The entered key does not match the standard format for Google Gemini API Keys (which typically start with 'AIzaSy' or 'AQ'). Are you sure you want to save it?",
      )
      if (!confirmSave) return
    }
    localStorage.setItem("ai_key", trimmed)
    setApiKey(trimmed)
  }

  // 8. Change/Clear API Key handler
  const handleChangeApiKey = () => {
    if (confirm("Are you sure you want to clear your saved Gemini API Key?")) {
      localStorage.removeItem("ai_key")
      setApiKey(null)
      setInputKey("")
    }
  }

  // 9. Stream handler
  const handleSendPrompt = async (promptText: string) => {
    if (!apiKey) return

    const pTokens = estimateTokens(promptText)

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: promptText,
      timestamp: Date.now(),
      tokens: pTokens,
    }

    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    setUsageStats((prev) => ({
      ...prev,
      promptTokens: prev.promptTokens + pTokens,
      totalTokens: prev.totalTokens + pTokens,
    }))

    const aiMsgId = crypto.randomUUID()
    const initialAiMsg: Message = {
      id: aiMsgId,
      role: "ai",
      content: "",
      timestamp: Date.now(),
      tokens: 0,
      type: "text",
    }

    setMessages((prev) => [...prev, initialAiMsg])

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      }
      if (session.isLoggedIn && session.email) {
        headers["x-user-email"] = session.email
      }

      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ prompt: promptText }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `Request failed with status ${response.status}`)
      }

      let accumulatedContent = ""
      let activeTokens = 0

      await parseSSEStream(response, {
        onChunk: (chunk) => {
          setMessages((prev) => {
            const idx = prev.findIndex((m) => m.id === aiMsgId)
            if (idx === -1) return prev

            const updated = [...prev]
            const msg = { ...updated[idx] }

            if (chunk.type === "text") {
              accumulatedContent += chunk.content
              msg.content = accumulatedContent
              msg.type = "text"
            } else if (chunk.type === "code") {
              accumulatedContent += chunk.content
              msg.content = accumulatedContent
              msg.type = "code"
              msg.language = chunk.language
            } else if (chunk.type === "product") {
              msg.type = "product"
              msg.products = chunk.data as Product[]
            } else if (chunk.type === "map") {
              msg.type = "map"
              msg.mapData = {
                coordinates: chunk.coordinates,
                locationName: chunk.locationName,
              } as MapData
            }

            const nextTokens = estimateTokens(accumulatedContent)
            const tokenDiff = nextTokens - activeTokens
            activeTokens = nextTokens
            msg.tokens = activeTokens

            if (tokenDiff > 0) {
              setUsageStats((prevStats) => ({
                ...prevStats,
                responseTokens: prevStats.responseTokens + tokenDiff,
                totalTokens: prevStats.totalTokens + tokenDiff,
              }))
            }

            updated[idx] = msg
            return updated
          })
        },
        onEnd: () => {
          setLoading(false)
        },
        onError: (err) => {
          console.error("Streaming error details:", err)
          setMessages((prev) => {
            const idx = prev.findIndex((m) => m.id === aiMsgId)
            if (idx === -1) return prev

            const updated = [...prev]
            updated[idx] = {
              ...updated[idx],
              type: "error",
              content: err.message || "A streaming interruption occurred.",
            }
            return updated
          })
          setLoading(false)
        },
      })
    } catch (err: any) {
      console.error("Fetch/Stream API error:", err)
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === aiMsgId)
        if (idx === -1) return prev

        const updated = [...prev]
        updated[idx] = {
          ...updated[idx],
          type: "error",
          content: err.message || "Unable to establish backend streaming connection.",
        }
        return updated
      })
      setLoading(false)
    }
  }

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear your chat history?")) {
      setMessages([])
      localStorage.removeItem("ai_chat_history")
    }
  }

  // 9. Render Key Setup Screen if no key is available
  if (!apiKey) {
    return (
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden">
        {/* Sidebar */}
        <div className="absolute top-4 left-4 z-20">
          <Sidebar />
        </div>

        {/* Outer ambient blur */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[128px] pointer-events-none" />

        {/* API key block screen */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-600/10 dark:bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />
            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/20 border border-white/10">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-wide text-slate-800 dark:text-white">
                  Gemini API Key Required
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[280px] mx-auto leading-relaxed">
                  Enter your Gemini API key to establish connections to the
                  streaming playground server.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5 relative">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Secure API Key
                </label>
                <div className="relative">
                  <input
                    type={showKeyText ? "text" : "password"}
                    name="gemini-api-key"
                    id="gemini-api-key"
                    autoComplete="new-password"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full p-3 pr-10 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 font-mono tracking-wider transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeyText(!showKeyText)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showKeyText ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Warning label to prevent password manager hijacked values */}
              {inputKey.trim().length > 0 && !inputKey.trim().startsWith("AIzaSy") && !inputKey.trim().startsWith("AQ") && (
                <div className="p-2.5 bg-amber-500/10 border border-amber-550/20 text-[10px] text-amber-600 dark:text-amber-400 rounded-lg leading-normal">
                  ⚠️ Note: Typical Gemini API Keys start with <b>AIzaSy</b> or <b>AQ</b>. Make
                  sure this is not your login password.
                </div>
              )}

              {/* Help Feature - Instructions on how to get the key */}
              <div className="bg-blue-500/5 border border-blue-200 dark:border-blue-500/10 rounded-2xl p-4 space-y-1.5 text-xs">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-blue-550 dark:text-blue-400" />
                  How to generate a Gemini Key:
                </h4>
                <ol className="list-decimal pl-4.5 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>
                    Go to{" "}
                    <a
                      href="https://aistudio.google.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                    >
                      Google AI Studio
                    </a>
                    .
                  </li>
                  <li>Click on the <b>Create API Key</b> button.</li>
                  <li>
                    Generate a key and copy it (it typically starts with{" "}
                    <code className="bg-slate-250 dark:bg-slate-950 px-1 py-0.5 rounded font-mono text-[10px] text-blue-700 dark:text-blue-300">
                      AIzaSy
                    </code>{" "}
                    or{" "}
                    <code className="bg-slate-250 dark:bg-slate-950 px-1 py-0.5 rounded font-mono text-[10px] text-blue-700 dark:text-blue-300">
                      AQ
                    </code>
                    ) and paste it above.
                  </li>
                </ol>
              </div>

              <button
                onClick={handleSaveApiKey}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm transition-all duration-300 shadow-md shadow-indigo-500/10 hover:scale-[1.02] active:scale-[0.98]"
              >
                Configure API Key
              </button>
            </div>

            <div className="text-[10px] text-slate-500 text-center leading-normal">
              Your API key is stored safely inside your browser's local storage
              and never shared elsewhere.
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 10. Main Chat & Dashboard Panel Screen
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden">
      {/* Sidebar navigation */}
      <div className="absolute top-4 left-4 z-20">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-row relative h-full">
        {/* Core Chat Area Container */}
        <div
          className={`flex-1 flex flex-col h-full transition-all duration-500 ${
            isSidebarOpen ? "mr-80" : "mr-0"
          }`}
        >
          <div className="pl-16 h-full flex flex-col">
            <ChatContainer
              messages={messages}
              loading={loading}
              onSend={handleSendPrompt}
              clearChat={handleClearChat}
              saveHistory={saveHistory}
              onToggleSaveHistory={() => setSaveHistory(!saveHistory)}
              session={session}
              onGoogleLogin={() => googleLogin()}
              theme={theme}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              onChangeApiKey={handleChangeApiKey}
            />
          </div>
        </div>

        {/* Usage Analytics Sidebar Panel */}
        <UsageDashboard
          stats={usageStats}
          onCeilingChange={(val) =>
            setUsageStats((prev) => ({ ...prev, ceiling: val }))
          }
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>
    </div>
  )
}
