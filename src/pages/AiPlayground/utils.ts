import { Message } from "./types"

/**
 * Parses Server-Sent Events (SSE) from the response stream
 * and triggers callbacks on events.
 */
export async function parseSSEStream(
  response: Response,
  callbacks: {
    onChunk: (chunk: any) => void
    onEnd: () => void
    onError: (error: Error) => void
  },
) {
  if (!response.body) {
    callbacks.onError(new Error("Response body is not readable."))
    return
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split("\n")
      // Keep the last partial line in the buffer
      buffer = lines.pop() || ""

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue

        if (trimmed.startsWith("data: ")) {
          const jsonStr = trimmed.slice(6).trim()
          if (jsonStr === "[DONE]") {
            callbacks.onEnd()
            return
          }

          try {
            const data = JSON.parse(jsonStr)
            if (data.type === "end") {
              callbacks.onEnd()
              return
            } else if (data.type === "error") {
              callbacks.onError(
                new Error(data.message || "An error occurred from API stream."),
              )
              return
            } else {
              callbacks.onChunk(data)
            }
          } catch (e) {
            console.error("Failed to parse SSE data block:", jsonStr, e)
          }
        }
      }
    }

    // Process final remaining line if any
    if (buffer.trim().startsWith("data: ")) {
      const jsonStr = buffer.trim().slice(6).trim()
      try {
        const data = JSON.parse(jsonStr)
        if (data.type === "end") {
          callbacks.onEnd()
        } else if (data.type === "error") {
          callbacks.onError(
            new Error(data.message || "An error occurred from API stream."),
          )
        } else {
          callbacks.onChunk(data)
        }
      } catch (e) {
        // ignore final parse errors on incomplete streams
      }
    } else {
      callbacks.onEnd()
    }
  } catch (error: any) {
    callbacks.onError(error)
  } finally {
    reader.releaseLock()
  }
}

/**
 * Estimates token count based on string length (1 token ≈ 4 characters).
 */
export function estimateTokens(text: string): number {
  if (!text) return 0
  return Math.max(1, Math.ceil(text.length / 4))
}

/**
 * Smoothly scrolls a container to its bottom.
 */
export function scrollToBottom(
  element: HTMLElement | null,
  behavior: ScrollBehavior = "smooth",
) {
  if (!element) return
  element.scrollTo({
    top: element.scrollHeight,
    behavior,
  })
}

/**
 * Checks if the container is scrolled up past a threshold from the bottom.
 */
export function isNearBottom(
  element: HTMLElement | null,
  threshold: number = 300,
): boolean {
  if (!element) return false
  const { scrollTop, scrollHeight, clientHeight } = element
  return scrollHeight - scrollTop - clientHeight <= threshold
}
