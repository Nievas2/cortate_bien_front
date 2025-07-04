import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useSocket } from "@/contexts/socketContext"
import { useAuthContext } from "@/contexts/authContext"
import { ChatResponseDto } from "@/interfaces/Chat"
import { getUserChats } from "@/services/ChatService"

export const useChatsList = () => {
  const { authUser } = useAuthContext()
  const { socket } = useSocket()
  const queryClient = useQueryClient()

  const query = useQuery<ChatResponseDto[], Error>({
    queryKey: ["chats"],
    queryFn: () => getUserChats(),
    enabled: !!authUser?.token,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (!socket) return

    // Escucha nuevos mensajes para actualizar la lista de chats
    const handleNewMessage = (data: { message: any; chatId: string }) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] })
      queryClient.invalidateQueries({ queryKey: ["chatMessages", data.chatId] })
    }

    // Escucha cuando se crea un nuevo chat
    const handleNewChat = () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] })
    }

    socket.on("new_message", handleNewMessage)
    socket.on("new_chat", handleNewChat)

    return () => {
      socket.off("new_message", handleNewMessage)
      socket.off("new_chat", handleNewChat)
    }
  }, [socket, queryClient])

  return query
}
