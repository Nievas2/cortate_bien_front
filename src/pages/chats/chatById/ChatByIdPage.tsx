import { useLocation } from "react-router-dom"
import { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useChatRoom } from "@/hooks/chat/useChatRoom"
import { useAuthContext } from "@/contexts/authContext"
import { Icon } from "@iconify/react/dist/iconify.js"
import { gsap } from "gsap"
import { renderSkeletonMessages } from "../skeletons/MessagesSkeleton"
import { useDebouncedCallback } from "use-debounce"
import {
  ChatHeader,
  MessagesList,
  ChatInput,
  ChatOptionsMenu,
  ScrollToBottomButton,
} from "./components"

interface ChatByIdPageProps {
  chatId?: string
  nombre?: string
}

export const ChatByIdPage = ({ chatId: propChatId, nombre }: ChatByIdPageProps) => {
  const { pathname } = useLocation()
  const urlChatId = pathname.split("/")[2]
  const chatId = propChatId || urlChatId
  
  // Refs
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const scrollHeightBeforeAddRef = useRef(0)
  const userScrolledRef = useRef(false)

  // Hook del chat
  const {
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
    blockStatus,
    blockUser,
    unblockUser,
    isBlocking,
    isUnblocking,
  } = useChatRoom(chatId)

  const { authUser } = useAuthContext()
  
  // Estados locales
  const [message, setMessage] = useState("")
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)

  // Animaciones GSAP al montar
  useEffect(() => {
    gsap.fromTo(
      messagesContainerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "easeOut" }
    )
    gsap.fromTo(
      inputRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "easeOut" }
    )
  }, [])

  // Cargar más mensajes
  const loadMoreMessages = useCallback(() => {
    const container = messagesContainerRef.current
    if (hasNextPage && !isFetchingNextPage && container) {
      scrollHeightBeforeAddRef.current = container.scrollHeight
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // Mantener posición de scroll al cargar más mensajes
  useLayoutEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    if (scrollHeightBeforeAddRef.current > 0) {
      const newScrollHeight = container.scrollHeight
      const heightDifference = newScrollHeight - scrollHeightBeforeAddRef.current
      container.scrollTop += heightDifference
      scrollHeightBeforeAddRef.current = 0
    } else if (!userScrolledRef.current) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages])

  // Marcar mensajes como leídos
  useEffect(() => {
    const unreadMessageIds = messages
      .filter((msg) => !msg.leido && msg.remitente.id !== authUser?.user.sub)
      .map((msg) => msg.id)

    if (unreadMessageIds.length > 0) {
      markAsRead(unreadMessageIds)
    }
  }, [messages, authUser, markAsRead])

  // Manejar scroll
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current
    if (!container) return
    const { scrollTop, scrollHeight, clientHeight } = container

    if (scrollTop < scrollHeight - clientHeight - 100) {
      userScrolledRef.current = true
      setShowScrollToBottom(true)
    } else {
      userScrolledRef.current = false
      setShowScrollToBottom(false)
    }
  }, [])

  // Scroll al final
  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current
    if (container) {
      userScrolledRef.current = false
      container.scrollTop = container.scrollHeight
    }
  }, [])

  // Enviar mensaje
  const handleSend = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!message.trim()) return

      try {
        const sendButton = (e.currentTarget as HTMLFormElement).querySelector(
          'button[type="submit"]'
        )
        if (sendButton) {
          gsap.to(sendButton, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
          })
        }

        userScrolledRef.current = false
        sendMessage(message.trim())
        setMessage("")
      } catch (error) {
        console.error("Error sending message:", error)
      }
    },
    [message, sendMessage]
  )

  // Debounce para typing
  const debouncedTyping = useDebouncedCallback((value: string) => {
    handleTypingChange(value.length > 0)
  }, 200)

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setMessage(value)
      debouncedTyping(value)
    },
    [debouncedTyping]
  )

  // Avatar inicial
  const avatarInitial = messages[0]?.remitente.nombre?.charAt(0).toUpperCase() || "U"

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <ChatHeader
        nombre={nombre}
        avatarInitial={avatarInitial}
        isOnline={isOnline}
        blockStatus={blockStatus}
        isTyping={isTyping}
        typingUser={typingUser}
        menuButtonRef={menuButtonRef}
        onMenuClick={() => setShowOptionsMenu(!showOptionsMenu)}
      />

      {/* Contenedor de mensajes */}
      <div
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent overflow-x-hidden"
        ref={messagesContainerRef}
        onScroll={handleScroll}
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="flex flex-col h-full">
          {/* Botón cargar más */}
          {hasNextPage && (
            <div className="flex-shrink-0 flex justify-center p-4">
              <Button
                onClick={loadMoreMessages}
                disabled={isFetchingNextPage}
                variant="outline"
                className="flex items-center gap-2 bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-gray-200"
              >
                {isFetchingNextPage && (
                  <Icon icon="eos-icons:loading" className="text-sm" />
                )}
                Cargar mensajes anteriores
              </Button>
            </div>
          )}

          {/* Lista de mensajes */}
          <div className="flex-1 flex flex-col justify-end p-3 sm:p-6">
            <MessagesList
              messages={messages}
              currentUserId={authUser?.user.sub}
              isLoading={isLoading}
              renderSkeleton={renderSkeletonMessages}
            />
          </div>
        </div>
      </div>

      {/* Input */}
      <ChatInput
        message={message}
        onMessageChange={handleInputChange}
        onSubmit={handleSend}
        blockStatus={blockStatus}
        inputRef={inputRef}
      />

      {/* Botón scroll to bottom */}
      <ScrollToBottomButton show={showScrollToBottom} onClick={scrollToBottom} />

      {/* Menú de opciones */}
      <ChatOptionsMenu
        isOpen={showOptionsMenu}
        onClose={() => setShowOptionsMenu(false)}
        buttonRef={menuButtonRef}
        blockStatus={blockStatus}
        onBlock={blockUser}
        onUnblock={unblockUser}
        isBlocking={isBlocking}
        isUnblocking={isUnblocking}
      />
    </div>
  )
}

