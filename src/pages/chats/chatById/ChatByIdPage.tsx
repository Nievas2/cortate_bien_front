import { useLocation } from "react-router-dom"
import { useState, useEffect, useRef, useLayoutEffect } from "react"
import { Button } from "@/components/ui/button"
import { useChatRoom } from "@/hooks/chat/useChatRoom"
import { useAuthContext } from "@/contexts/authContext"
import { MessageResponseDto } from "@/interfaces/Chat"
import { Icon } from "@iconify/react/dist/iconify.js"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import LayoutChat from "../components/LayoutChat"
import { renderSkeletonMessages } from "../skeletons/MessagesSkeleton"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"

const ChatByIdPage = () => {
  const { pathname } = useLocation()
  const chatId = pathname.split("/")[2]
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLDivElement>(null) // <-- Ref para el input

  // --- Refs para la lógica de scroll ---
  const scrollHeightBeforeAddRef = useRef(0)
  const userScrolledRef = useRef(false)

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
  } = useChatRoom(chatId)

  const { authUser } = useAuthContext()
  const [message, setMessage] = useState("")
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)

  // --- Animaciones GSAP restauradas ---
  useEffect(() => {
    // Animar contenedor al montar
    gsap.fromTo(
      messagesContainerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "easeOut" }
    )

    // Animar input al montar
    gsap.fromTo(
      inputRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "easeOut" }
    )
  }, [])

  const loadMoreMessages = () => {
    const container = messagesContainerRef.current
    if (hasNextPage && !isFetchingNextPage && container) {
      scrollHeightBeforeAddRef.current = container.scrollHeight
      fetchNextPage()
    }
  }

  useLayoutEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    if (scrollHeightBeforeAddRef.current > 0) {
      const newScrollHeight = container.scrollHeight
      const heightDifference =
        newScrollHeight - scrollHeightBeforeAddRef.current
      container.scrollTop += heightDifference
      scrollHeightBeforeAddRef.current = 0
    } else if (!userScrolledRef.current) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    const unreadMessageIds = messages
      .filter((msg) => !msg.leido && msg.remitente.id !== authUser?.user.sub)
      .map((msg) => msg.id)

    if (unreadMessageIds.length > 0) {
      markAsRead(unreadMessageIds)
    }
  }, [messages, authUser, markAsRead])

  const handleScroll = () => {
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
  }

  const scrollToBottom = () => {
    const container = messagesContainerRef.current
    if (container) {
      userScrolledRef.current = false
      container.scrollTop = container.scrollHeight
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    try {
      // Animar botón de envío
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
  }

  const debouncedTyping = useDebouncedCallback((value: string) => {
    handleTypingChange(value.length > 0)
  }, 200)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMessage(value)
    debouncedTyping(value)
  }

  // --- Variantes de animación restauradas ---
  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  }

  const typingVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
    exit: { opacity: 0, x: -20 },
  }

  return (
    <LayoutChat>
      <div className="flex flex-col h-screen w-full">
        {/* Header (sin cambios) */}
        <motion.div className="flex-shrink-0 flex items-center justify-between pl-20 p-2 bg-gray-main shadow-sm">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-gray-main text-sm font-medium flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {messages[0]?.remitente.nombre?.charAt(0).toUpperCase() || "U"}
            </motion.div>
            <div className="flex flex-col">
              <span className="text-sm md:text-lg font-semibold">
                {messages[0]?.remitente.nombre}{" "}
                {messages[0]?.remitente.apellido}
              </span>
              <div className="flex items-center gap-2">
                <motion.div
                  className={`w-2 h-2 rounded-full ${
                    isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                  animate={isOnline ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm text-gray-600">
                  {isOnline ? "En línea" : "Desconectado"}
                </span>
              </div>
            </div>
          </div>
          <AnimatePresence>
            {isTyping && typingUser && (
              <motion.div
                className="flex items-center gap-2 text-sm text-gray-500"
                variants={typingVariants} // <-- Variante usada
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Icon icon="eos-icons:typing" className="text-blue-500" />
                </motion.div>
                <span>{typingUser} está escribiendo...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Messages Container */}
        <div
          className="flex-1 overflow-y-auto bg-gray-700 overflow-x-hidden"
          ref={messagesContainerRef}
          onScroll={handleScroll}
          style={{ scrollBehavior: "smooth" }}
        >
          <div className="flex flex-col h-full">
            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex-shrink-0 flex justify-center p-4">
                <Button
                  onClick={loadMoreMessages}
                  disabled={isFetchingNextPage}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {isFetchingNextPage && (
                    <Icon icon="eos-icons:loading" className="text-sm" />
                  )}
                  Cargar mensajes anteriores
                </Button>
              </div>
            )}

            {/* Messages List */}
            <div className="flex-1 flex flex-col justify-end p-2 md:p-4">
              <div className="flex flex-col gap-2">
                <AnimatePresence mode="popLayout">
                  {isLoading ? (
                    renderSkeletonMessages()
                  ) : (
                    <>
                      {messages.length > 0 ? (
                        messages.map(
                          (msg: MessageResponseDto, index: number) => {
                            const isOwnMessage =
                              msg.remitente.id === authUser?.user.sub

                            return (
                              <motion.div
                                key={msg.id || crypto.randomUUID()}
                                className={`flex items-end gap-2 ${
                                  isOwnMessage ? "flex-row-reverse" : "flex-row"
                                }`}
                                variants={messageVariants} // <-- Variante usada
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                layout
                                custom={index}
                                transition={{
                                  delay: index * 0.05,
                                  layout: { duration: 0.3 },
                                }}
                              >
                                <motion.div
                                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                                    isOwnMessage
                                      ? "bg-blue-500 text-gray-main rounded-br-sm"
                                      : "bg-white text-gray-800 rounded-bl-sm border border-gray-200"
                                  }`}
                                  whileHover={{
                                    scale: 1.02,
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                  }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                  }}
                                >
                                  <div className="text-sm font-medium leading-relaxed break-all">
                                    {msg.contenido}
                                  </div>
                                  <motion.div
                                    className={`flex gap-1 items-center text-xs mt-1 text-black ${
                                      isOwnMessage
                                        ? "text-right flex-row-reverse"
                                        : "text-left"
                                    }`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                  >
                                    {isOwnMessage && (
                                      <>
                                        {msg.leido ? (
                                          <Icon
                                            icon="mdi:check-all"
                                            color="green"
                                            className="size-4"
                                          />
                                        ) : (
                                          <Icon
                                            icon="material-symbols:check"
                                            className="size-4"
                                          />
                                        )}{" "}
                                      </>
                                    )}
                                    {new Date(
                                      msg.fechaEnvio
                                    ).toLocaleTimeString("es-ES", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </motion.div>
                                </motion.div>
                              </motion.div>
                            )
                          }
                        )
                      ) : (
                        <motion.div
                          className="flex flex-col items-center justify-center py-12 text-gray-500"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Icon
                              icon="material-symbols:chat-bubble-outline"
                              className="text-4xl mb-2"
                            />
                          </motion.div>
                          <span>No hay mensajes aún.</span>
                          <span className="text-sm">
                            ¡Inicia la conversación!
                          </span>
                        </motion.div>
                      )}
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <motion.div
          className="flex-shrink-0 bg-gray-main border-t border-gray-200 p-4"
          ref={inputRef} // <-- Ref añadida
        >
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Input
                  value={message}
                  onChange={handleInputChange}
                  placeholder="Escribe un mensaje..."
                  className="pr-12 resize-none max-h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-h-[50px]"
                  style={{ lineHeight: "1.5", paddingTop: 6, paddingBottom: 6 }}
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
              >
                <Button
                  type="submit"
                  disabled={!message.trim()}
                  className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300"
                >
                  <motion.div
                    animate={message.trim() ? { x: [0, 2, 0] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <Icon
                      icon="material-symbols:send-rounded"
                      className="text-sm"
                    />
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </form>
        </motion.div>

        {/* Botón flotante para bajar al último mensaje */}
        {showScrollToBottom && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-24 right-4 z-50 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg p-3 transition-all cursor-pointer"
            aria-label="Bajar al último mensaje"
          >
            <Icon icon="mdi:arrow-down" className="text-2xl" />
          </button>
        )}
      </div>
    </LayoutChat>
  )
}

export default ChatByIdPage
