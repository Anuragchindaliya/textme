import { useEffect, useState, useRef } from "react"
import { Message, UsageStats, UserSession, Product, MapData } from "./types"
import { estimateTokens, parseSSEStream } from "./utils"

const BACKEND_URL = "https://cue-king-nodejs.onrender.com/api/ai/playground"

interface UseAiStreamingProps {
  apiKey: string | null
  session: UserSession
  saveHistory: boolean
}

export function useAiStreaming({ apiKey, session, saveHistory }: UseAiStreamingProps) {
  const [loading, setLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)

  // 1. Messages state
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("ai_chat_history")
    if (saved && (saveHistory || session.isLoggedIn)) {
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
    if (saveHistory || session.isLoggedIn) {
      localStorage.setItem("ai_chat_history", JSON.stringify(messages))
    } else {
      localStorage.removeItem("ai_chat_history")
    }
    localStorage.setItem("ai_save_history", saveHistory ? "true" : "false")
  }, [messages, saveHistory, session.isLoggedIn])

  // 2. Token & Usage Analytics State
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

  // References for Abort Controller and Animation Frame
  const abortControllerRef = useRef<AbortController | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // References for chunk buffering and dynamic typing animation
  const streamBufferRef = useRef<string>("")
  const renderingBufferRef = useRef<string>("")
  const isStreamActiveRef = useRef<boolean>(false)
  const latestMsgTypeRef = useRef<string>("text")
  const latestMsgLanguageRef = useRef<string | undefined>(undefined)
  const latestMsgProductsRef = useRef<Product[] | undefined>(undefined)
  const latestMsgMapDataRef = useRef<MapData | undefined>(undefined)
  const activeTokensRef = useRef<number>(0)
  const currentAiMsgIdRef = useRef<string | null>(null)

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Stop active streaming response
  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    isStreamActiveRef.current = false
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    setLoading(false)
    setIsStreaming(false)
    abortControllerRef.current = null
  }

  // Stream handler with requestAnimationFrame and AbortController
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
    setIsStreaming(false)

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

    // Cancel any active stream/fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    // Reset buffer tracking references
    streamBufferRef.current = ""
    renderingBufferRef.current = ""
    isStreamActiveRef.current = true
    latestMsgTypeRef.current = "text"
    latestMsgLanguageRef.current = undefined
    latestMsgProductsRef.current = undefined
    latestMsgMapDataRef.current = undefined
    activeTokensRef.current = 0
    currentAiMsgIdRef.current = aiMsgId

    // Define requestAnimationFrame typing loop
    const animateRender = () => {
      if (!isStreamActiveRef.current && renderingBufferRef.current.length === streamBufferRef.current.length) {
        // Stream completed and all buffered chunks are typed out
        setLoading(false)
        setIsStreaming(false)
        abortControllerRef.current = null
        return
      }

      let hasTextChange = false

      if (renderingBufferRef.current.length < streamBufferRef.current.length) {
        const diff = streamBufferRef.current.length - renderingBufferRef.current.length
        // Dynamic speed adjustments: type faster if we are lagging far behind the stream buffer
        const step = Math.max(1, Math.ceil(diff / 6))
        renderingBufferRef.current += streamBufferRef.current.slice(
          renderingBufferRef.current.length,
          renderingBufferRef.current.length + step
        )
        hasTextChange = true
      }

      // Sync state with buffer changes once per frame
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === aiMsgId)
        if (idx === -1) return prev

        const updated = [...prev]
        const msg = { ...updated[idx] }

        if (hasTextChange) {
          msg.content = renderingBufferRef.current
        }
        msg.type = latestMsgTypeRef.current as any

        if (latestMsgLanguageRef.current) {
          msg.language = latestMsgLanguageRef.current
        }
        if (latestMsgProductsRef.current) {
          msg.products = latestMsgProductsRef.current
        }
        if (latestMsgMapDataRef.current) {
          msg.mapData = latestMsgMapDataRef.current
        }

        // Token increments match dynamically to visible text
        const nextTokens = estimateTokens(renderingBufferRef.current)
        const tokenDiff = nextTokens - activeTokensRef.current
        activeTokensRef.current = nextTokens
        msg.tokens = nextTokens

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

      // Request next frame if stream is active OR there is text still left in buffer
      if (isStreamActiveRef.current || renderingBufferRef.current.length < streamBufferRef.current.length) {
        animationFrameRef.current = requestAnimationFrame(animateRender)
      } else {
        setLoading(false)
        setIsStreaming(false)
        abortControllerRef.current = null
      }
    }

    // Cancel any previous frames and start loop
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    animationFrameRef.current = requestAnimationFrame(animateRender)

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
        signal: controller.signal,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || `Request failed with status ${response.status}`)
      }

      await parseSSEStream(response, {
        onChunk: (chunk) => {
          setIsStreaming(true) // First chunk arrived, we are actively streaming!
          
          if (chunk.type === "text" || chunk.type === "code") {
            streamBufferRef.current += chunk.content
            latestMsgTypeRef.current = chunk.type
            if (chunk.type === "code") {
              latestMsgLanguageRef.current = chunk.language
            }
          } else if (chunk.type === "product") {
            latestMsgTypeRef.current = "product"
            latestMsgProductsRef.current = chunk.data as Product[]
          } else if (chunk.type === "map") {
            latestMsgTypeRef.current = "map"
            latestMsgMapDataRef.current = {
              coordinates: chunk.coordinates,
              locationName: chunk.locationName,
            } as MapData
          }
        },
        onEnd: () => {
          isStreamActiveRef.current = false
        },
        onError: (err) => {
          if (err.name === "AbortError") {
            isStreamActiveRef.current = false
            return
          }
          console.error("Streaming error details:", err)
          isStreamActiveRef.current = false
          
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current)
          }

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
          setIsStreaming(false)
        },
      })
    } catch (err: any) {
      if (err.name === "AbortError") {
        isStreamActiveRef.current = false
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        setLoading(false)
        setIsStreaming(false)
        return
      }
      console.error("Fetch/Stream API error:", err)
      isStreamActiveRef.current = false
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
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
      setIsStreaming(false)
    }
  }

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear your chat history?")) {
      setMessages([])
      localStorage.removeItem("ai_chat_history")
    }
  }

  return {
    messages,
    loading,
    isStreaming,
    usageStats,
    setUsageStats,
    handleSendPrompt,
    handleStopStreaming,
    handleClearChat,
  }
}
