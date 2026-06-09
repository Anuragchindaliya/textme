import { useEffect } from "react"
import { io, Socket } from "socket.io-client"
import { useAppDispatch } from "@/app/hooks"
import { nodeBaseApi } from "@/app/services"

// let socket: Socket

export const useSocket = (userId: string) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!userId) return

    // Initialize socket connection
    // socket = io("http://localhost:3000", { // Replace with env var
    //   query: { userId },
    // })
    // Mocking socket for now as backend is not real
    const mockSocket = {
        on: (event: string, callback: any) => {
            console.log(`Listening for ${event}`)
        },
        off: (event: string) => {
            console.log(`Stopped listening for ${event}`)
        },
        disconnect: () => {
            console.log("Disconnected")
        }
    }

    // socket.on("connect", () => {
    //   console.log("Connected to socket server")
    // })

    // Listen for task updates
    // socket.on("task_updated", (data: any) => {
    //   console.log("Task updated event received:", data)
      
    //   // Invalidate relevant tags to trigger refetch
    //   dispatch(nodeBaseApi.util.invalidateTags(["Task", "ProjectList"]))
    // })

    return () => {
      // socket.disconnect()
      mockSocket.disconnect()
    }
  }, [userId, dispatch])

  // return socket
  return {} as Socket // Placeholder return
}
