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
      // Actualizar el último mensaje del chat directamente en el cache
      queryClient.setQueryData(["chats"], (oldChats: ChatResponseDto[] | undefined) => {
        if (!oldChats) return oldChats

        return oldChats.map((chat) => {
          if (chat.id === data.chatId) {
            return {
              ...chat,
              ultimoMensaje: data.message,
              updatedAt: data.message.createdAt,
              // Incrementar contador de no leídos si el mensaje no es del usuario actual
              mensajesNoLeidos: data.message.remitente.id === authUser?.user.sub 
                ? chat.mensajesNoLeidos 
                : (chat.mensajesNoLeidos || 0) + 1,
            }
          }
          return chat
        }).sort((a, b) => {
          // Re-ordenar por fecha de actualización (último mensaje primero)
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        })
      })
    }

    // Escucha cuando los mensajes se marcan como leídos
    const handleMessagesRead = (data: { messageIds: string[]; readBy: string; chatId?: string }) => {
      // Si soy yo quien marcó como leído, resetear el contador de no leídos
      if (data.readBy === authUser?.user.sub && data.chatId) {
        queryClient.setQueryData(["chats"], (oldChats: ChatResponseDto[] | undefined) => {
          if (!oldChats) return oldChats

          return oldChats.map((chat) => {
            if (chat.id === data.chatId) {
              return {
                ...chat,
                mensajesNoLeidos: 0,
              }
            }
            return chat
          })
        })
      }
    }

    // Escucha cuando se crea un nuevo chat
    const handleNewChat = () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] })
    }

    socket.on("new_message", handleNewMessage)
    socket.on("messages_read", handleMessagesRead)
    socket.on("new_chat", handleNewChat)

    return () => {
      socket.off("new_message", handleNewMessage)
      socket.off("messages_read", handleMessagesRead)
      socket.off("new_chat", handleNewChat)
    }
  }, [socket, queryClient, authUser?.user?.sub])

  return query
}
