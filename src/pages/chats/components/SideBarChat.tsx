import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/contexts/authContext"
import { useChatsList } from "@/hooks/chat/useChatList"
import { ChatResponseDto } from "@/interfaces/Chat"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"

const SideBarChat = ({ open }: { open: boolean }) => {
  const { data: chats, isLoading, error, refetch } = useChatsList()
  const { authUser } = useAuthContext()
  const navigate = useNavigate()
  const { id: activeChatId } = useParams()

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

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + "..."
  }

  const handleChatClick = (chatId: string) => {
    navigate(`/chats/${chatId}`)
  }

  return (
    <aside
      className={`bg-gradient-to-b from-slate-950 to-slate-900 h-screen transition-all duration-300 absolute top-0 z-40 sm:sticky sm:top-0 border-r border-slate-800/50 ${
        open ? "left-0 w-[280px] sm:w-[380px]" : "hidden -left-full w-0"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {error ? (
        <div className="w-full h-full flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <Icon
                icon="material-symbols:error-outline"
                className="text-4xl text-red-400"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-gray-100 font-semibold text-lg">
                Error al cargar
              </span>
              <span className="text-gray-400 text-sm max-w-xs">
                No se pudieron obtener tus conversaciones
              </span>
            </div>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="flex items-center gap-2 mt-2 border-slate-700 hover:bg-slate-800 text-gray-200"
            >
              <Icon icon="material-symbols:refresh" />
              Reintentar
            </Button>
          </motion.div>
        </div>
      ) : (
        <div className="flex flex-col h-screen">
          {/* Header mejorado */}
          <div className="flex-shrink-0 px-6 py-5 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10">
                  <Icon
                    className="text-blue-400"
                    icon="heroicons:chat-bubble-left-right-20-solid"
                    width="24"
                    height="24"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Mensajes</h2>
                  <p className="text-xs text-gray-400">
                    {chats?.length || 0} conversaciones
                  </p>
                </div>
              </div>
              <Button
                onClick={() => refetch()}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-slate-800/70 text-gray-400 hover:text-white transition-all duration-200"
              >
                <Icon icon="material-symbols:refresh" className="text-xl" />
              </Button>
            </div>

            {/* Botón volver a inicio */}
            <Link to="/" className="w-full">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-gray-400 hover:text-white hover:bg-slate-800/70 transition-all duration-200"
              >
                <Icon icon="heroicons:arrow-left-20-solid" className="w-4 h-4" />
                <span className="text-sm">Volver al inicio</span>
              </Button>
            </Link>
          </div>

          {/* Lista de chats */}
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <Icon
                  icon="eos-icons:loading"
                  className="text-5xl text-blue-500"
                />
                <span className="text-gray-400 text-sm">
                  Cargando conversaciones...
                </span>
              </motion.div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {chats && chats.length > 0 ? (
                <div className="flex flex-col p-2">
                  <AnimatePresence mode="popLayout">
                    {[...chats]
                      .sort(
                        (a, b) =>
                          new Date(b.ultimaActividad || 0).getTime() -
                          new Date(a.ultimaActividad || 0).getTime()
                      )
                      .map((chat: ChatResponseDto, index) => {
                        const otherUser = getOtherUser(chat)
                        const isActive = activeChatId === chat.id

                        return (
                          chat.ultimoMensaje && (
                            <motion.div
                              key={chat.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleChatClick(chat.id)}
                              className={`group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 mb-1 ${
                                isActive
                                  ? "bg-gradient-to-r from-blue-600/20 to-blue-500/20 shadow-lg shadow-blue-500/10"
                                  : "hover:bg-slate-800/60"
                              }`}
                            >
                              {/* Avatar mejorado */}
                              <div className="relative flex-shrink-0">
                                <div
                                  className={`size-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg transition-all duration-200 ${
                                    isActive ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-950" : "group-hover:scale-105"
                                  }`}
                                >
                                  {otherUser.nombre.charAt(0).toUpperCase()}
                                  {otherUser.apellido.charAt(0).toUpperCase()}
                                </div>

                                {/* Indicador de no leído */}
                                {!chat.visto && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 size-4 bg-gradient-to-br from-red-400 to-red-600 rounded-full border-2 border-slate-950 shadow-lg"
                                  />
                                )}
                              </div>

                              {/* Información del chat */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <h3
                                          className={`font-semibold truncate max-w-[140px] text-[15px] ${
                                            !chat.visto || isActive
                                              ? "text-white"
                                              : "text-gray-300"
                                          }`}
                                        >
                                          {otherUser.nombre} {otherUser.apellido}
                                        </h3>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{otherUser.nombre} {otherUser.apellido}</p>
                                        <p>{}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>

                                  {chat.ultimaActividad && <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                    {formatTime(chat.ultimaActividad)}
                                  </span>}
                                </div>
                                    
                                {/* Badge de rol */}
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <Icon
                                    icon="material-symbols:store"
                                    className="text-xs text-gray-500 flex-shrink-0"
                                  />
                                  <span className="text-xs text-gray-500 truncate">
                                    {chat.barberia.nombre}
                                  </span>
                                </div>

                                {/* Último mensaje */}
                                <div className="flex items-center gap-1.5">
                                  {chat.ultimoMensaje && (
                                    <>
                                      {chat.ultimoMensaje.remitente.id == authUser?.user.id && (
                                        <Icon
                                          icon={
                                            chat.ultimoMensaje.leido
                                              ? "mdi:check-all"
                                              : "material-symbols:check"
                                          }
                                          className={`size-4 flex-shrink-0 ${
                                            chat.ultimoMensaje.leido
                                              ? "text-blue-400"
                                              : "text-gray-500"
                                          }`}
                                        />
                                      )}
                                      <p
                                        className={`text-sm truncate ${
                                          !chat.visto
                                            ? "text-white font-medium"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        {truncateMessage(chat.ultimoMensaje.contenido, 40)}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Indicador visual de activo */}
                              {isActive && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-l-full" />
                              )}

                              {/* Chevron on hover */}
                              <Icon
                                icon="heroicons:chevron-right-20-solid"
                                className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                                  isActive
                                    ? "text-blue-400 opacity-100 translate-x-0"
                                    : "text-gray-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                                }`}
                              />
                            </motion.div>
                          )
                        )
                      })}
                  </AnimatePresence>
                </div>
              ) : (
                /* Estado vacío mejorado */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center p-8"
                >
                  <div className="w-20 h-20 rounded-full bg-slate-800/50 border-2 border-dashed border-slate-700 flex items-center justify-center mb-4">
                    <Icon
                      icon="heroicons:chat-bubble-left-right-20-solid"
                      className="text-3xl text-gray-500"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">
                    No tienes conversaciones
                  </h3>
                  <p className="text-gray-500 max-w-xs text-sm">
                    Cuando inicies una conversación con un barbero o cliente, aparecerá aquí.
                  </p>
                </motion.div>
              )}
            </div>
          )}
        </div>
      )}
    </aside>
  )
}
export default SideBarChat
