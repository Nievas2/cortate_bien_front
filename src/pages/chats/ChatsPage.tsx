import { useChatsList } from "@/hooks/chat/useChatList"
import { useAuthContext } from "@/contexts/authContext"
import { ChatResponseDto } from "@/interfaces/Chat"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

const ChatsPage = () => {
  const { data: chats, isLoading, error, refetch } = useChatsList()
  const { authUser } = useAuthContext()
  const navigate = useNavigate()

  const formatTime = (date: Date) => {
    const now = new Date()
    const messageDate = new Date(date)
    const diffInMinutes = Math.floor(
      (now.getTime() - messageDate.getTime()) / (1000 * 60)
    )
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 1) return "Ahora"
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInHours < 24) return `${diffInHours}h`
    if (diffInDays < 7) return `${diffInDays}d`

    return messageDate.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
    })
  }

  const getOtherUser = (chat: ChatResponseDto) => {
    const isUserClient = authUser?.user.sub === chat.cliente.id
    return isUserClient ? chat.barbero : chat.cliente
  }

  const getUserRole = (chat: ChatResponseDto) => {
    const isUserClient = authUser?.user.sub === chat.cliente.id
    return isUserClient ? "cliente" : "barbero"
  }

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + "..."
  }

  const handleChatClick = (chatId: string) => {
    navigate(`/chats/${chatId}`)
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Icon icon="eos-icons:loading" className="text-4xl text-blue-500" />
          <span className="text-gray-600">Cargando conversaciones...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center ">
        <div className="flex flex-col items-center gap-4 text-center">
          <Icon
            icon="material-symbols:error-outline"
            className="text-4xl text-red-500"
          />
          <div className="flex flex-col gap-2">
            <span className="text-gray-800 font-medium">
              Error al cargar conversaciones
            </span>
            <span className="text-gray-600 text-sm">
              No se pudieron obtener tus mensajes
            </span>
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Icon icon="material-symbols:refresh" />
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen bg-gray-700 flex flex-col">
      {/* Header */}
      <div className="bg-black-main p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Mensajes</h1>
          <Button
            onClick={() => refetch()}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <Icon icon="material-symbols:refresh" className="text-lg" />
          </Button>
        </div>
      </div>

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto">
        {chats && chats.length > 0 ? (
          <div className="flex flex-col">
            {chats.map((chat: ChatResponseDto) => {
              const otherUser = getOtherUser(chat)
              const userRole = getUserRole(chat)

              return (
                <div
                  key={chat.id}
                  onClick={() => handleChatClick(chat.id)}
                  className="flex items-center gap-3 p-4 hover:bg-gray-900/75 cursor-pointer transition-colors"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-lg shadow-md">
                      {otherUser.nombre.charAt(0).toUpperCase()}
                      {otherUser.apellido.charAt(0).toUpperCase()}
                    </div>

                    {/* Unread indicator */}
                    {!chat.visto && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                    )}
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-medium truncate ${
                            !chat.visto ? "text-white" : "text-gray-700"
                          }`}
                        >
                          {otherUser.nombre} {otherUser.apellido}
                        </h3>

                        {/* Role badge */}
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            userRole === "cliente"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {userRole === "cliente" ? "Barbero" : "Cliente"}
                        </span>
                      </div>

                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatTime(chat.ultimaActividad)}
                      </span>
                    </div>

                    {/* Barbershop name */}
                    <div className="flex items-center gap-1 mb-1">
                      <Icon
                        icon="material-symbols:store"
                        className="text-xs text-gray-400"
                      />
                      <span className="text-xs text-gray-500 truncate">
                        {chat.barberia.nombre}
                      </span>
                    </div>

                    {/* Last message */}
                    <div className="flex items-center gap-2">
                      {chat.ultimoMensaje ? (
                        <>
                          {chat.ultimoMensaje.remitente ===
                            authUser?.user.sub && (
                            <Icon
                              icon="material-symbols:check"
                              className="text-xs text-gray-400 flex-shrink-0"
                            />
                          )}
                          <p
                            className={`text-sm truncate ${
                              !chat.visto
                                ? "text-white font-medium"
                                : "text-gray-600"
                            }`}
                          >
                            {truncateMessage(chat.ultimoMensaje.contenido)}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-400 italic">
                          No hay mensajes
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <Icon
                    icon="material-symbols:chevron-right"
                    className="text-gray-400 text-lg flex-shrink-0"
                  />
                </div>
              )
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Icon
                icon="material-symbols:chat-bubble-outline"
                className="text-3xl text-gray-400"
              />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No tienes conversaciones
            </h3>
            <p className="text-gray-600 max-w-sm">
              Cuando inicies una conversación con un barbero o cliente,
              aparecerá aquí.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatsPage
