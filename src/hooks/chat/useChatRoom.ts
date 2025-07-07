import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { useDebouncedCallback } from "use-debounce"
import { useEffect, useState, useCallback } from "react"
import { useAuthContext } from "@/contexts/authContext"
import { getChatMessages } from "@/services/ChatService"
import { MessageResponseDto } from "@/interfaces/Chat"
import { useSocket } from "@/contexts/socketContext"

export const useChatRoom = (chatId: string) => {
  const { authUser } = useAuthContext()
  const { socket } = useSocket()
  const queryClient = useQueryClient()
  const [isTyping, setIsTyping] = useState(false)
  const [typingUser, setTypingUser] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(false)

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["chatMessages", chatId],
      queryFn: ({ pageParam = 1 }: { pageParam?: number }) =>
        getChatMessages({ chatId, pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage: any) => {
        return lastPage.current_page < lastPage.pages
          ? lastPage.current_page + 1
          : undefined
      },
      staleTime: 0,
      enabled: !!chatId,
    })

  // Combinar mensajes de modo que los de la página más reciente estén al final.
  // Cuando se carga una nueva página, sus mensajes se agregan al inicio del array.
  const messages =
    data?.pages
      .map((page) => page.results)
      .reduceRight((acc, curr) => {
        console.log("previo", acc, "   ", "actual", curr)

        return [...acc, ...curr]
      }, [] as MessageResponseDto[]) || []

  // Lógica de WebSocket
  useEffect(() => {
    if (!socket) return

    // Unirse a la sala de chat
    socket.emit("join_chat", { chatId })

    const handleNewMessage = (data: {
      message: MessageResponseDto
      chatId: string
    }) => {
      if (data.chatId === chatId) {
        //invalido las páginas de mensajes para que se recarguen
        queryClient.invalidateQueries({ queryKey: ["chatMessages", chatId] })
      }
    }

    const handleMessagesRead = (data: {
      messageIds: string[]
      readBy: string
    }) => {
      // Solo actualizar si no soy yo quien marcó como leído
      if (data.readBy !== authUser?.user.sub) {
        queryClient.setQueryData(["chatMessages", chatId], (oldData: any) => {
          if (!oldData) return oldData

          const newData = { ...oldData }
          newData.pages = newData.pages.map((page: MessageResponseDto[]) =>
            page.map((message: MessageResponseDto) =>
              data.messageIds.includes(message.id)
                ? { ...message, leido: true }
                : message
            )
          )

          return newData
        })
      }
    }

    const handleUserTyping = (data: {
      userId: string
      userName: string
      isTyping: boolean
    }) => {
      if (data.userId !== authUser?.user?.sub) {
        setIsTyping(data.isTyping)
        setTypingUser(data.isTyping ? data.userName : null)

        // Auto-ocultar typing después de 3 segundos
        if (data.isTyping) {
          setTimeout(() => {
            setIsTyping(false)
            setTypingUser(null)
          }, 3000)
        }
      }
    }

    socket.on("new_message", handleNewMessage)
    socket.on("messages_read", handleMessagesRead)
    socket.on(
      "user_online_in_chat",
      (data: { userId: string; isOnline: boolean }) => {
        if (data.userId !== authUser?.user?.sub) {
          setIsOnline(data.isOnline)
        }
      }
    )
    socket.on("user_typing", handleUserTyping)
    socket.on(
      "user_offline_in_chat",
      (data: { userId: string; chatId: boolean }) => {
        if (data.userId !== authUser?.user?.sub) {
          setIsOnline(false)
        }
      }
    )
    socket.on(
      "user_online_in_chat",
      (data: { userId: string; chatId: boolean }) => {
        if (data.userId !== authUser?.user?.sub) {
          console.log("se conectó el usuario", data.userId, data.chatId)
          setIsOnline(true)
        }
      }
    )

    return () => {
      socket.emit("leave_chat", { chatId })
      socket.off("new_message", handleNewMessage)
      socket.off("messages_read", handleMessagesRead)
      socket.off("user_typing", handleUserTyping)
    }
  }, [socket, chatId, queryClient, authUser?.user?.sub])

  // Marcar mensajes como leídos
  const markAsRead = useCallback(
    (messageIds: string[]) => {
      if (socket && messageIds.length > 0) {
        socket.emit("mark_messages_read", { chatId, messageIds })
      }
    },
    [socket, chatId]
  )

  // Enviar un mensaje
  const sendMessage = (contenido: string) => {
    if (!socket || !contenido.trim()) return
    const messageDto = {
      chatId,
      contenido,
    }
    socket.emit("send_message", messageDto)
  }

  // Emitir evento "typing" con debounce mejorado
  const emitTyping = useDebouncedCallback(
    (isTyping: boolean) => {
      if (socket) {
        socket.emit("typing", { chatId, isTyping })
      }
    },
    300 // Tiempo de espera en ms
  )

  const handleTypingChange = (isCurrentlyTyping: boolean) => {
    emitTyping(isCurrentlyTyping)

    // Cancelar typing después de 1 segundo de inactividad
    if (isCurrentlyTyping) {
      setTimeout(() => {
        emitTyping(false)
      }, 1000)
    }
  }

  return {
    messages,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    sendMessage,
    markAsRead,
    handleTypingChange,
    isTyping,
    typingUser,
    isOnline,
    setIsOnline,
  }
}
