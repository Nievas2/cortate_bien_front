import { motion, AnimatePresence } from "framer-motion"
import { MessageResponseDto } from "@/interfaces/Chat"
import { Icon } from "@iconify/react/dist/iconify.js"

interface MessageBubbleProps {
  message: MessageResponseDto
  isOwnMessage: boolean
  index: number
}

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

export const MessageBubble = ({ message, isOwnMessage, index }: MessageBubbleProps) => {
  return (
    <motion.div
      key={message.id || crypto.randomUUID()}
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
          {message.contenido}
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
          {message.fechaEnvio && (
            <span>
              {new Date(message.fechaEnvio).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
          {isOwnMessage && (
            <Icon
              icon={message.leido ? "mdi:check-all" : "material-symbols:check"}
              className={`size-4 ${
                message.leido ? "text-blue-200" : "text-blue-300"
              }`}
            />
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export const EmptyMessages = () => {
  return (
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
      <span className="text-sm text-gray-600 mt-1">¡Inicia la conversación!</span>
    </motion.div>
  )
}

interface MessagesListProps {
  messages: MessageResponseDto[]
  currentUserId?: string
  isLoading: boolean
  renderSkeleton: () => React.ReactNode
}

export const MessagesList = ({
  messages,
  currentUserId,
  isLoading,
  renderSkeleton,
}: MessagesListProps) => {
  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {isLoading ? (
          renderSkeleton()
        ) : (
          <>
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <MessageBubble
                  key={msg.id || index}
                  message={msg}
                  isOwnMessage={msg.remitente.id === currentUserId}
                  index={index}
                />
              ))
            ) : (
              <EmptyMessages />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
