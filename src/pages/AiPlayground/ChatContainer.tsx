import React, { useEffect, useRef, useState } from "react"
import {
  ArrowDown,
  BarChart3,
  Check,
  Copy,
  CornerDownLeft,
  Download,
  KeyRound,
  Loader,
  Loader2,
  MapPin,
  Mic,
  MicOff,
  Sparkles,
  Square,
  Trash2,
  Volume2,
  VolumeX,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import remarkGfm from "remark-gfm"
import { FcGoogle } from "react-icons/fc"

import { Message, UserSession, Product, MapData } from "./types"
import { isNearBottom, scrollToBottom } from "./utils"
interface ChatContainerProps {
  messages: Message[]
  loading: boolean
  isStreaming: boolean
  onSend: (text: string) => void
  onStop: () => void
  clearChat: () => void
  saveHistory: boolean
  onToggleSaveHistory: () => void
  session: UserSession
  onGoogleLogin: () => void
  theme?: string
  onToggleSidebar: () => void
  onChangeApiKey: () => void
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  loading,
  isStreaming,
  onSend,
  onStop,
  clearChat,
  saveHistory,
  onToggleSaveHistory,
  session,
  onGoogleLogin,
  theme = "dark",
  onToggleSidebar,
  onChangeApiKey,
}) => {
  const [input, setInput] = useState("")
  const [showGoToLatest, setShowGoToLatest] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  // Code interaction state
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null)
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null)

  // Speech Recognition (Speech-to-Text) state
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef<any>(null)
  const initialTextRef = useRef("")

  // Speech Synthesis (Text-to-Speech) state
  const [activeSpeechMsgId, setActiveSpeechMsgId] = useState<string | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  // Hide Go To Latest button as soon as AI finishes streaming
  useEffect(() => {
    if (!loading) {
      setShowGoToLatest(false)
    }
  }, [loading])

  // Listen to scrolling to show/hide "Go to Latest" button
  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    const nearBottom = isNearBottom(scrollContainerRef.current, 150)
    // Only show Go to Latest button if loading/generating is true and user scrolled up
    setShowGoToLatest(loading && !nearBottom)
  }

  // Scroll to bottom on load/new messages
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollToBottom(scrollContainerRef.current, "smooth")
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || loading) return
    onSend(input.trim())
    setInput("")
    // If voice recognition is running, stop it
    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleGoToLatest = () => {
    if (scrollContainerRef.current) {
      scrollToBottom(scrollContainerRef.current, "smooth")
    }
  }

  const handleToggleHistory = () => {
    if (!session.isLoggedIn) {
      setShowAuthModal(true)
    } else {
      onToggleSaveHistory()
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCodeId(id)
    setTimeout(() => setCopiedCodeId(null), 2000)
  }

  const copyMessageToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedMsgId(id)
    setTimeout(() => setCopiedMsgId(null), 2000)
  }

  // Trigger file download of code snippets
  const downloadCode = (codeText: string, language: string) => {
    const extensions: { [key: string]: string } = {
      javascript: "js",
      typescript: "ts",
      jsx: "jsx",
      tsx: "tsx",
      python: "py",
      html: "html",
      css: "css",
      json: "json",
      rust: "rs",
      go: "go",
      java: "java",
      cpp: "cpp",
      c: "c",
      csharp: "cs",
      bash: "sh",
      shell: "sh",
      markdown: "md",
    }
    const ext = extensions[language.toLowerCase()] || "txt"
    const blob = new Blob([codeText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `gemini_code.${ext}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Speech-to-Text Handler (Dictation) with text duplication fix
  const toggleSpeechToText = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please try Google Chrome or Safari.")
      return
    }

    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
      return
    }

    // Capture initial text state before recording starts
    initialTextRef.current = input

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onstart = () => {
      setIsRecording(true)
    }

    recognition.onresult = (event: any) => {
      let sessionResult = ""
      for (let i = 0; i < event.results.length; i++) {
        sessionResult += event.results[i][0].transcript
      }
      
      const combined = initialTextRef.current +
        (initialTextRef.current && !initialTextRef.current.endsWith(" ") ? " " : "") +
        sessionResult
      setInput(combined)
    }

    recognition.onerror = (event: any) => {
      console.error("Speech Recognition Error:", event.error)
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  // Text-to-Speech Handler (Audio Output)
  const handleListenText = (text: string, messageId: string) => {
    if (activeSpeechMsgId === messageId) {
      window.speechSynthesis.cancel()
      setActiveSpeechMsgId(null)
      return
    }

    window.speechSynthesis.cancel()

    const cleanText = text
      .replace(/[*#`_\-]/g, "")
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.onend = () => {
      setActiveSpeechMsgId(null)
    }
    utterance.onerror = () => {
      setActiveSpeechMsgId(null)
    }

    utteranceRef.current = utterance
    setActiveSpeechMsgId(messageId)
    window.speechSynthesis.speak(utterance)
  }

  const syntaxTheme = theme === "dark" ? oneDark : oneLight

  return (
    <div className="flex-1 flex flex-col relative h-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-sm font-semibold tracking-wide text-slate-700 dark:text-slate-200">
            Playground Session
          </h3>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Usage Stats trigger */}
          <button
            onClick={onToggleSidebar}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-650 dark:text-slate-400 dark:hover:text-indigo-400 transition-all duration-200 py-1.5 px-2.5 sm:px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-900"
            title="Toggle Usage Analytics"
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            <span className="hidden sm:inline font-semibold">Usage Stats</span>
          </button>

          {/* Change API Key */}
          <button
            onClick={onChangeApiKey}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-amber-650 dark:text-slate-400 dark:hover:text-amber-400 transition-all duration-200 py-1.5 px-2.5 sm:px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-900"
            title="Change API Key"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span className="hidden sm:inline font-semibold">Change Key</span>
          </button>

          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-650 dark:text-slate-400 dark:hover:text-red-400 transition-all duration-200 py-1.5 px-2.5 sm:px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-900"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span className="hidden sm:inline font-semibold">Clear Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/10">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-wide">
                AI Playground Chat
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Start chatting with Gemini. Ask questions, request code snippets,
                ask for a product list, or explore coordinates for maps.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8 pb-16">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 group/msg-outer ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* AI Avatar - Restored commented out markup as requested */}
                {/* {msg.role === "ai" && (
                  <div className="flex-shrink-0 w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-md border border-white/10 mt-1">
                    AI
                  </div>
                )} */}

                <div className="max-w-[85%] flex flex-col">
                  {/* Message Bubble Container */}
                  <div
                    className={`rounded-2xl px-5 py-4 shadow-sm leading-relaxed text-sm transition-all duration-300 relative ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-slate-55 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none"
                    }`}
                  >
                    {/* Message content */}
                    {msg.role === "user" ? (
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                    ) : (
                      <div className="space-y-4">
                        {!msg.content && !msg.products && !msg.mapData && msg.type !== "error" ? (
                          <div className="flex flex-col gap-2.5 w-full py-2.5 max-w-[280px]">
                            <div className="h-3 w-full rounded-full gemini-shimmer animate-pulse" />
                            <div className="h-3 w-11/12 rounded-full gemini-shimmer animate-pulse" />
                            <div className="h-3 w-3/4 rounded-full gemini-shimmer animate-pulse" />
                          </div>
                        ) : (
                          <>
                            {/* Text/Markdown content with polished typography */}
                            {msg.content && (
                              <div className="prose prose-slate dark:prose-invert max-w-none text-slate-750 dark:text-slate-300 text-sm leading-relaxed prose-pre:m-0 prose-pre:p-0 prose-p:my-1.5 prose-headings:my-2 prose-ul:my-2 prose-ol:my-2">
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
                                      const match = /language-(\w+)/.exec(
                                        className || "",
                                      )
                                      const codeContent = String(children).replace(
                                        /\n$/,
                                        "",
                                      )
                                      const blockId = `${msg.id}-${
                                        match?.[1] || "code"
                                      }`

                                      // Custom Code Highlighter resembling Gemini Layout
                                      return !inline && match ? (
                                        <div className="relative mt-3.5 mb-2.5 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-slate-950 dark:bg-slate-955/70 group/code">
                                          {/* Header bar mimicking Gemini's clean look */}
                                          <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-850/80 bg-slate-900/60 text-xs text-slate-450 dark:text-slate-400 font-mono tracking-wide">
                                            <span className="font-semibold uppercase text-[10px] text-slate-400">
                                              {match[1]}
                                            </span>
                                            <div className="flex items-center gap-3">
                                              {/* Copy Button */}
                                              <button
                                                onClick={() =>
                                                  copyToClipboard(codeContent, blockId)
                                                }
                                                className="flex items-center gap-1.5 p-1 text-slate-400 hover:text-white transition-all hover:scale-105"
                                                title="Copy Code"
                                              >
                                                {copiedCodeId === blockId ? (
                                                  <>
                                                    <Check className="w-3.5 h-3.5 text-emerald-450" />
                                                    <span className="text-[10px] font-sans font-medium text-emerald-450">Copied</span>
                                                  </>
                                                ) : (
                                                  <>
                                                    <Copy className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-sans font-semibold">Copy</span>
                                                  </>
                                                )}
                                              </button>

                                              {/* Download Button */}
                                              <button
                                                onClick={() =>
                                                  downloadCode(codeContent, match[1])
                                                }
                                                className="flex items-center gap-1.5 p-1 text-slate-400 hover:text-white transition-all hover:scale-105"
                                                title="Download Code"
                                              >
                                                <Download className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-sans font-semibold">Download</span>
                                              </button>
                                            </div>
                                          </div>
                                          
                                          {/* Syntax highlighting */}
                                          <SyntaxHighlighter
                                            style={syntaxTheme}
                                            language={match[1]}
                                            PreTag="div"
                                            customStyle={{
                                              margin: 0,
                                              padding: "1.25rem",
                                              background: "transparent",
                                              fontSize: "13px",
                                              lineHeight: "1.6",
                                            }}
                                            {...props}
                                          >
                                            {codeContent}
                                          </SyntaxHighlighter>
                                        </div>
                                      ) : (
                                        <code
                                          className="bg-slate-100 dark:bg-slate-800 text-indigo-650 dark:text-indigo-300 px-1.5 py-0.5 rounded-lg text-xs font-mono border border-slate-200 dark:border-slate-700/50"
                                          {...props}
                                        >
                                          {children}
                                        </code>
                                      )
                                    },
                                  }}
                                >
                                  {msg.content}
                                </ReactMarkdown>
                              </div>
                            )}

                            {/* Product list rendering */}
                            {msg.type === "product" && msg.products && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                                {msg.products.map((product) => (
                                  <div
                                    key={product.id}
                                    className="p-4 bg-white dark:bg-slate-955/50 border border-slate-200 dark:border-slate-850 hover:border-blue-500/40 rounded-xl transition-all duration-300 flex flex-col justify-between hover:shadow-lg hover:shadow-blue-500/5 group/card"
                                  >
                                    <div>
                                      <div className="flex justify-between items-start gap-2">
                                        <h4 className="font-bold text-slate-850 dark:text-white text-xs tracking-wide">
                                          {product.name}
                                        </h4>
                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-205 dark:border-blue-500/20">
                                          ${product.price.toFixed(2)}
                                        </span>
                                      </div>
                                      <p className="text-xs text-slate-550 dark:text-slate-400 mt-2 leading-normal">
                                        {product.description}
                                      </p>
                                    </div>
                                    <button className="w-full mt-4 py-2 bg-blue-600/85 hover:bg-blue-650 text-white rounded-lg text-[11px] font-bold tracking-wide transition-all group-hover/card:scale-[1.02]">
                                      View Product Details
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Map coordinate rendering */}
                            {msg.type === "map" && msg.mapData && (
                              <div className="p-4 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 rounded-xl mt-3 space-y-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-550 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                                    <MapPin className="w-4.5 h-4.5 animate-bounce" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-850 dark:text-white text-xs tracking-wide">
                                      {msg.mapData.locationName}
                                    </h4>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                      Latitude: {msg.mapData.coordinates.lat}, Longitude:{" "}
                                      {msg.mapData.coordinates.lng}
                                    </p>
                                  </div>
                                </div>
                                {/* Mini vector map illustration */}
                                <div className="h-28 w-full rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 relative overflow-hidden flex items-center justify-center">
                                  <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_16px]" />
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                                    <span className="absolute inline-flex h-14 w-14 rounded-full bg-red-500/20 opacity-30 animate-ping" />
                                    <span className="absolute inline-flex h-8 w-8 rounded-full bg-red-500/30 opacity-40 animate-pulse" />
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-650 dark:bg-red-600 shadow-md" />
                                  </div>
                                  <span className="absolute bottom-2 right-2 text-[9px] text-slate-400 dark:text-slate-600 font-mono tracking-wider">
                                    GPS Simulation Model
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <button className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-705 dark:text-slate-300 rounded-lg text-[11px] font-semibold transition-colors border border-slate-200 dark:border-slate-800">
                                    Pin on Active Map
                                  </button>
                                  <button
                                    onClick={() =>
                                      copyToClipboard(
                                        `${msg.mapData?.locationName} (${msg.mapData?.coordinates.lat}, ${msg.mapData?.coordinates.lng})`,
                                        `map-${msg.id}`,
                                      )
                                    }
                                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg text-[11px] font-semibold transition-colors border border-slate-200 dark:border-slate-800"
                                  >
                                    Copy Coord
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Error panel */}
                            {msg.type === "error" && (
                              <div className="p-3 bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl mt-1 text-xs text-red-550 dark:text-red-400 leading-normal flex items-start gap-2.5">
                                <span className="font-extrabold">⚠️ Warning:</span>
                                <span>{msg.content}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* Hidden timestamp */}
                    <div className="absolute bottom-1 right-2.5 text-[8.5px] text-slate-400 dark:text-slate-500 opacity-0 group-hover/msg-outer:opacity-100 transition-opacity font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {/* AI Response Action buttons (Copy and Listen) visible on message hover */}
                  {msg.role === "ai" && !loading && (msg.content || msg.products || msg.mapData) && (
                    <div className="flex items-center gap-3 mt-1.5 ml-2.5 opacity-0 group-hover/msg-outer:opacity-100 transition-opacity duration-300">
                      {/* Copy Message Text */}
                      <button
                        onClick={() => copyMessageToClipboard(msg.content, msg.id)}
                        className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:text-slate-450 dark:hover:text-slate-200 transition-colors p-1"
                        title="Copy Response"
                      >
                        {copiedMsgId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      {/* Listen / TTS Button */}
                      <button
                        onClick={() => handleListenText(msg.content, msg.id)}
                        className={`flex items-center gap-1 text-[11px] font-medium transition-colors p-1 ${
                          activeSpeechMsgId === msg.id
                            ? "text-blue-600 dark:text-blue-400 animate-pulse font-semibold"
                            : "text-slate-500 hover:text-slate-800 dark:text-slate-450 dark:hover:text-slate-200"
                        }`}
                        title="Read out loud"
                      >
                        {activeSpeechMsgId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-blue-555 dark:text-blue-400" />
                            <span>Mute</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* User Avatar - Restored commented out markup as requested */}
                {/* {msg.role === "user" && (
                  <div className="flex-shrink-0 w-8.5 h-8.5 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md mt-1">
                    U
                  </div>
                )} */}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Go To Latest scroll indicator */}
      {showGoToLatest && (
        <button
          onClick={handleGoToLatest}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg border border-white/10 text-xs font-bold tracking-wide hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <ArrowDown className="w-4 h-4 animate-bounce" />
          Go to Latest
        </button>
      )}

      {/* User Prompt / Input Bar */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-900 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md space-y-3 z-10">
        {/* Auth prompt banner */}
        {!session.isLoggedIn && (
          <div className="max-w-4xl mx-auto px-4 py-2.5 bg-slate-55 dark:bg-slate-900/40 backdrop-blur border border-slate-200 dark:border-slate-850 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              <span className="text-xs text-slate-650 dark:text-slate-300 font-medium">
                Want to save your chat history?
              </span>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                  Save History
                </span>
                <button
                  onClick={handleToggleHistory}
                  className={`w-7 h-4 flex items-center rounded-full p-0.5 transition-colors focus:outline-none ${
                    saveHistory ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`bg-white w-3 h-3 rounded-full shadow transform transition-transform ${
                      saveHistory ? "translate-x-3" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <button
                onClick={onGoogleLogin}
                className="px-3 py-1 bg-white dark:bg-white hover:bg-slate-100 text-slate-955 rounded-lg text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5 shadow border border-slate-200"
              >
                <FcGoogle className="w-3.5 h-3.5" />
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* Text Input Row containing mic tool for dictation */}
        <div className="max-w-4xl mx-auto flex items-end gap-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-850 p-2.5 hover:border-slate-350 dark:hover:border-slate-800 focus-within:border-blue-500/50 transition-all">
          {/* Speech-to-Text Dictation Button */}
          <button
            type="button"
            onClick={toggleSpeechToText}
            className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center focus:outline-none ${
              isRecording
                ? "bg-red-500/10 text-red-550 animate-pulse border border-red-500/30 scale-105"
                : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
            title={isRecording ? "Listening... Click to stop" : "Listen to write (voice input)"}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? "Listening... Speak now" : "Type your message to Gemini..."}
            className="flex-1 max-h-36 min-h-[44px] h-11 p-2 bg-transparent text-slate-900 dark:text-slate-200 text-sm outline-none resize-none scrollbar-none leading-relaxed placeholder-slate-450 dark:placeholder-slate-500"
          />
          {loading ? (
            <div className="relative group/tooltip flex items-center justify-center">
              <button
                type="button"
                onClick={onStop}
                className="p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-350 dark:hover:bg-slate-700 hover:scale-105 active:scale-95 shadow-md"
              >
                {isStreaming ? (
                  <Square className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-650 dark:text-blue-400" />
                )}
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1.5 text-[10px] font-bold text-white bg-slate-900 dark:bg-slate-800 border border-slate-750 dark:border-slate-700 rounded-lg shadow-lg opacity-0 scale-95 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 pointer-events-none transition-all duration-150 tooltip-animate whitespace-nowrap z-30">
                Stop generating
              </div>
            </div>
          ) : (
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center ${
                !input.trim()
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/10 hover:scale-105 active:scale-95"
              }`}
            >
              <CornerDownLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Google Login Prompt Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 p-6 rounded-2xl w-[360px] shadow-2xl space-y-4 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Enable History Sync
              </h3>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-normal">
                Sign in with Google to sync your AI Playground messages history
                cross-device and access saved chats anytime.
              </p>
            </div>
            <button
              onClick={() => {
                setShowAuthModal(false)
                onGoogleLogin()
              }}
              className="w-full py-2.5 bg-slate-955 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 border border-slate-300 dark:border-none"
            >
              <FcGoogle className="w-4 h-4" />
              Sign in with Google
            </button>
            <button
              onClick={() => setShowAuthModal(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-655 dark:text-slate-400 font-semibold rounded-xl text-xs transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
