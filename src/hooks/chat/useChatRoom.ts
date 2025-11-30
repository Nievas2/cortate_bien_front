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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isPending,
    isFetchingNextPage,
  } = useInfiniteQuery({
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
      .reduceRight(
        (acc, curr) => [...acc, ...curr],
        [] as MessageResponseDto[]
      ) || []

  // Lógica de WebSocket
  useEffect(() => {
    if (!socket) {
      console.log("❌ Socket no disponible en useChatRoom")
      return
    }

    console.log("✅ Socket disponible, uniéndose al chat:", chatId)

    // Unirse a la sala de chat
    socket.emit("join_chat", { chatId }, (response: any) => {
      console.log("📝 Respuesta join_chat:", response)
    })

    const handleNewMessage = (data: {
      message: MessageResponseDto
      chatId: string
    }) => {
      console.log("📨 Mensaje recibido por socket:", data)
      
      if (data.chatId === chatId) {
        // Solo agregar mensajes de otros usuarios (no los propios que ya están optimistas)
        if (data.message.remitente.id !== authUser?.user.sub) {
          console.log("➕ Agregando mensaje de otro usuario al cache")
          queryClient.setQueryData(["chatMessages", chatId], (oldData: any) => {
            if (!oldData) return oldData

            const newData = { ...oldData }
            const lastPage = newData.pages[newData.pages.length - 1]
            
            // Verificar si el mensaje ya existe (para evitar duplicados)
            const messageExists = newData.pages.some((page: any) =>
              page.results.some((msg: MessageResponseDto) => msg.id === data.message.id)
            )

            if (!messageExists) {
              // Agregar el mensaje a la última página
              lastPage.results = [...lastPage.results, data.message]
            }

            return newData
          })
        } else {
          console.log("⏭️ Ignorando mensaje propio (ya está optimista)")
        }
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
        // Actualizar localmente antes de enviar al servidor
        queryClient.setQueryData(["chatMessages", chatId], (oldData: any) => {
          if (!oldData) return oldData

          const newData = { ...oldData }
          newData.pages = newData.pages.map((page: any) => ({
            ...page,
            results: page.results.map((msg: MessageResponseDto) =>
              messageIds.includes(msg.id) ? { ...msg, leido: true } : msg
            ),
          }))

          return newData
        })

        socket.emit("mark_messages_read", { chatId, messageIds })
      }
    },
    [socket, chatId, queryClient]
  )

  // Enviar un mensaje
  const sendMessage = (contenido: string) => {
    if (!socket || !contenido.trim()) return
    
    const messageDto = {
      chatId,
      contenido,
    }
    
    // Crear mensaje optimista
    const optimisticMessage: MessageResponseDto = {
      id: `temp-${Date.now()}`, // ID temporal
      contenido,
      chatId,
      remitente: {
        id: authUser?.user.sub || '',
        nombre: authUser?.user.name || '',
        apellido: authUser?.user.username || '',
        email: authUser?.user.email || '',
        imagen: null,
      },
      leido: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Agregar mensaje optimista al cache
    queryClient.setQueryData(["chatMessages", chatId], (oldData: any) => {
      if (!oldData) return oldData

      const newData = { ...oldData }
      const lastPage = newData.pages[newData.pages.length - 1]
      
      if (lastPage && lastPage.results) {
        lastPage.results = [...lastPage.results, optimisticMessage]
      }

      return newData
    })

    // Enviar mensaje por socket con timeout
    socket.timeout(5000).emit("send_message", messageDto, (error: any, response: any) => {
      if (error) {
        console.error("Error al enviar mensaje:", error)
        // Remover mensaje optimista si falla
        queryClient.setQueryData(["chatMessages", chatId], (oldData: any) => {
          if (!oldData) return oldData

          const newData = { ...oldData }
          newData.pages = newData.pages.map((page: any) => ({
            ...page,
            results: page.results.filter((msg: MessageResponseDto) => msg.id !== optimisticMessage.id),
          }))

          return newData
        })
        return
      }

      if (response?.success && response?.message) {
        // Reemplazar mensaje optimista con el real del servidor
        queryClient.setQueryData(["chatMessages", chatId], (oldData: any) => {
          if (!oldData) return oldData

          const newData = { ...oldData }
          newData.pages = newData.pages.map((page: any) => ({
            ...page,
            results: page.results.map((msg: MessageResponseDto) =>
              msg.id === optimisticMessage.id ? response.message : msg
            ),
          }))

          return newData
        })
      }
    })
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
    isPending,
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
