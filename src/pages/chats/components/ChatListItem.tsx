import { motion } from "framer-motion"
import { ChatResponseDto } from "@/interfaces/Chat"

interface ChatListItemProps {
  chat: ChatResponseDto
  index: number
  isActive: boolean
  onClick: () => void
  otherUser: { nombre: string; apellido: string }
  formatTime: (date: Date) => string
  truncateMessage: (message: string, maxLength?: number) => string
  authUserId?: string
}

export const ChatListItem = ({
  chat,
  index,
  isActive,
  onClick,
  otherUser,
  formatTime,
  truncateMessage,
  authUserId,
}: ChatListItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.03 }}
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-3 py-3 cursor-pointer transition-all duration-200 ${
        isActive ? "bg-slate-800/70" : "hover:bg-slate-800/40"
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
          {otherUser.nombre.charAt(0).toUpperCase()}
          {otherUser.apellido.charAt(0).toUpperCase()}
        </div>

        {/* Indicador de no leído */}
        {!chat.visto && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-slate-950"
          />
        )}
      </div>

      {/* Información del chat */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between mb-0.5">
          <h3
            className={`font-semibold text-[15px] truncate ${
              !chat.visto ? "text-white" : "text-gray-300"
            }`}
          >
            {otherUser.nombre} {otherUser.apellido}
          </h3>
          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
            {chat.ultimaActividad && formatTime(chat.ultimaActividad)}
          </span>
        </div>

        {/* Último mensaje */}
        <div className="flex items-center gap-1.5">
          {chat.ultimoMensaje && (
            <>
              {chat.ultimoMensaje.remitente.id === authUserId && (
                <span
                  className={`text-xs flex-shrink-0 ${
                    !chat.visto ? "text-white font-medium" : "text-gray-500"
                  }`}
                >
                  Tú:
                </span>
              )}
              <p
                className={`text-sm truncate ${
                  !chat.visto ? "text-white font-medium" : "text-gray-500"
                }`}
              >
                {truncateMessage(chat.ultimoMensaje.contenido, 35)}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Indicador visual de activo */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-blue-500 rounded-r-full" />
      )}
    </motion.div>
  )
}
