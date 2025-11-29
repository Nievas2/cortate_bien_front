import { useLocation } from "react-router-dom"
import { useState, useEffect, useRef, useLayoutEffect } from "react"
import { Button } from "@/components/ui/button"
import { useChatRoom } from "@/hooks/chat/useChatRoom"
import { useAuthContext } from "@/contexts/authContext"
import { MessageResponseDto } from "@/interfaces/Chat"
import { Icon } from "@iconify/react/dist/iconify.js"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { renderSkeletonMessages } from "../skeletons/MessagesSkeleton"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"

interface ChatByIdPageProps {
  chatId?: string
  nombre ?: string
}

export const ChatByIdPage = ({ chatId: propChatId, nombre }: ChatByIdPageProps) => {
  const { pathname } = useLocation()
  const urlChatId = pathname.split("/")[2]
  const chatId = propChatId || urlChatId
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

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header modernizado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex-shrink-0 flex items-center justify-between pl-4 pr-4 py-4 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50 shadow-lg`}
      >
          <div className="flex items-center gap-4">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-semibold shadow-lg ring-2 ring-slate-800 ring-offset-2 ring-offset-slate-950">
                {messages[0]?.remitente.nombre?.charAt(0).toUpperCase() || "U"}
              </div>
              {isOnline && (
                <motion.div
                  className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-950"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
            
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold text-white">
                {nombre || "Usuario"}
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isOnline ? "text-green-400" : "text-gray-500"}`}>
                  {isOnline ? "En línea" : "Desconectado"}
                </span>
              </div>
            </div>
          </div>

          {/* Indicador de escritura */}
          <AnimatePresence>
            {isTyping && typingUser && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/60 backdrop-blur-sm"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Icon icon="eos-icons:typing" className="text-blue-400 text-lg" />
                </motion.div>
                <span className="text-sm text-gray-300 hidden sm:inline">
                  {typingUser} está escribiendo...
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

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
              <div className="flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                  {isLoading ? (
                    renderSkeletonMessages()
                  ) : (
                    <>
                      {messages.length > 0 ? (
                        messages.map((msg: MessageResponseDto, index: number) => {
                          const isOwnMessage = msg.remitente.id === authUser?.user.sub

                          return (
                            <motion.div
                              key={msg.id || crypto.randomUUID()}
                              className={`flex items-end gap-2 ${
                                isOwnMessage ? "flex-row-reverse" : "flex-row"
                              }`}
                              variants={messageVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              layout
                              custom={index}
                              transition={{
                                delay: index * 0.02,
                                layout: { duration: 0.3 },
                              }}
                            >
                              <motion.div
                                className={`max-w-[75%] sm:max-w-md px-4 py-3 rounded-2xl shadow-md ${
                                  isOwnMessage
                                    ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-md"
                                    : "bg-slate-800 text-gray-100 rounded-bl-md border border-slate-700/50"
                                }`}
                                whileHover={{
                                  scale: 1.01,
                                  boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                                }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <div className="text-sm font-medium leading-relaxed break-words">
                                  {msg.contenido}
                                </div>
                                <motion.div
                                  className={`flex gap-1.5 items-center text-xs mt-1.5 ${
                                    isOwnMessage
                                      ? "text-blue-100 justify-end"
                                      : "text-gray-400 justify-start"
                                  }`}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  <span>
                                    {new Date(msg.fechaEnvio).toLocaleTimeString("es-ES", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                  {isOwnMessage && (
                                    <Icon
                                      icon={msg.leido ? "mdi:check-all" : "material-symbols:check"}
                                      className={`size-4 ${
                                        msg.leido ? "text-blue-200" : "text-blue-300"
                                      }`}
                                    />
                                  )}
                                </motion.div>
                              </motion.div>
                            </motion.div>
                          )
                        })
                      ) : (
                        <motion.div
                          className="flex flex-col items-center justify-center py-16 text-gray-500"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <motion.div
                            className="w-20 h-20 rounded-full bg-slate-800/50 border-2 border-dashed border-slate-700 flex items-center justify-center mb-4"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Icon
                              icon="heroicons:chat-bubble-left-right-20-solid"
                              className="text-4xl text-gray-600"
                            />
                          </motion.div>
                          <span className="text-gray-400 font-medium">No hay mensajes aún</span>
                          <span className="text-sm text-gray-600 mt-1">
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

        {/* Input modernizado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-shrink-0 bg-slate-950/80 backdrop-blur-lg border-t border-slate-800/50 p-4"
          ref={inputRef}
        >
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={handleInputChange}
                placeholder="Escribe un mensaje..."
                className="bg-slate-800/60 border-slate-700 text-gray-100 placeholder:text-gray-500 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl text-sm min-h-[48px] transition-all duration-200"
                style={{ lineHeight: "1.5", paddingTop: 10, paddingBottom: 10 }}
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <Button
                  type="submit"
                  disabled={!message.trim()}
                  className="h-9 w-9 p-0 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-slate-700 disabled:to-slate-700 shadow-lg disabled:shadow-none transition-all duration-200"
                >
                  <motion.div
                    animate={message.trim() ? { x: [0, 2, 0] } : {}}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    <Icon icon="heroicons:paper-airplane-solid" className="text-base" />
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </form>
        </motion.div>

        {/* Botón scroll to bottom mejorado */}
        <AnimatePresence>
          {showScrollToBottom && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToBottom}
              className="fixed bottom-28 right-6 z-50 bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-full shadow-2xl p-3 transition-all cursor-pointer ring-4 ring-blue-500/20"
              aria-label="Bajar al último mensaje"
            >
              <Icon icon="heroicons:arrow-down-20-solid" className="text-xl" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
  )
}

