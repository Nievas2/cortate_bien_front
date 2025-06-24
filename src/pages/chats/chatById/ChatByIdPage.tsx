import { useLocation } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useChatRoom } from "@/hooks/chat/useChatRoom"
import { useAuthContext } from "@/contexts/authContext"
import { MessageResponseDto } from "@/interfaces/Chat"
import { Icon } from "@iconify/react/dist/iconify.js"
import LayoutChat from "../components/LayoutChat"

const ChatByIdPage = () => {
  const { pathname } = useLocation()
  const chatId = pathname.split("/")[2]
  const messagesEndRef = useRef<HTMLDivElement>(null)

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

  // Mark messages as read when component mounts or messages change
  useEffect(() => {
    const unreadMessageIds = messages
      .filter((msg) => !msg.leido && msg.remitente.id !== authUser?.user.sub)
      .map((msg) => msg.id)

    if (unreadMessageIds.length > 0) {
      markAsRead(unreadMessageIds)
    }
  }, [messages, authUser, markAsRead])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    try {
      sendMessage(message.trim())
      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMessage(value)
    handleTypingChange(value.length > 0)
  }

  const loadMoreMessages = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Icon icon="eos-icons:loading" className="text-4xl text-blue-500" />
          <span className="text-gray-600">Cargando mensajes...</span>
        </div>
      </div>
    )
  }

  console.log(messages);
  return (
    <LayoutChat>
      <div className="w-full min-h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between pl-20 p-2 bg-gray-main shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-gray-main text-sm font-medium flex-shrink-0">
              {messages[0]?.remitente.nombre?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm md:text-lg font-semibold">
                {messages[0]?.remitente.nombre}{" "}
                {messages[0]?.remitente.apellido}
              </span>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <span className="text-sm text-gray-600">
                  {isOnline ? "En línea" : "Desconectado"}
                </span>
              </div>
            </div>
          </div>

          {/* Typing indicator */}
          {isTyping && typingUser && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Icon icon="eos-icons:typing" className="text-blue-500" />
              <span>{typingUser} está escribiendo...</span>
            </div>
          )}
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto bg-gray-700  overflow-x-hidden">
          {/* Load More Button */}
          {hasNextPage && (
            <div className="flex justify-center p-4">
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

          {/* Messages */}
          <div className="flex flex-col gap-2 p-4 min-h-screen">
            {messages.length > 0 ? (
              messages.reverse().map((msg: MessageResponseDto) => {
                const isOwnMessage = msg.remitente.id === authUser?.user.sub

                return (
                  <div
                    key={msg.id || crypto.randomUUID()}
                    className={`flex items-end gap-2 ${
                      isOwnMessage ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Message Bubble */}
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                        isOwnMessage
                          ? "bg-blue-500 text-gray-main rounded-br-sm"
                          : "bg-white text-gray-800 rounded-bl-sm border border-gray-200"
                      }`}
                    >
                      {/* Message content */}
                      <div className="text-sm font-medium leading-relaxed break-all">
                        {msg.contenido}
                      </div>

                      {/* Timestamp */}
                      <div
                        className={`text-xs mt-1 text-black ${
                          isOwnMessage ? "text-right" : "text-left"
                        }`}
                      >
                        {new Date(msg.fechaEnvio).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Icon
                  icon="material-symbols:chat-bubble-outline"
                  className="text-4xl mb-2"
                />
                <span>No hay mensajes aún.</span>
                <span className="text-sm">¡Inicia la conversación!</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-gray-main border-t border-gray-200 p-4">
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                type="text"
                value={message}
                onChange={handleInputChange}
                placeholder="Escribe un mensaje..."
                className="pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button
                type="submit"
                disabled={!message.trim()}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300"
              >
                <Icon
                  icon="material-symbols:send-rounded"
                  className="text-sm"
                />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </LayoutChat>
  )
}

export default ChatByIdPage
