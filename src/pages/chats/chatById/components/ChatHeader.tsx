import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react/dist/iconify.js"
import { motion, AnimatePresence } from "framer-motion"
import { BlockStatusDto } from "@/interfaces/Chat"

interface ChatHeaderProps {
  nombre?: string
  avatarInitial: string
  isOnline: boolean
  blockStatus?: BlockStatusDto
  isTyping: boolean
  typingUser: string | null
  menuButtonRef: React.RefObject<HTMLButtonElement>
  onMenuClick: () => void
}

export const ChatHeader = ({
  nombre,
  avatarInitial,
  isOnline,
  blockStatus,
  isTyping,
  typingUser,
  menuButtonRef,
  onMenuClick,
}: ChatHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-shrink-0 flex items-center justify-between pl-4 pr-4 py-4 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50 shadow-lg"
    >
      <div className="flex items-center gap-4">
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-semibold shadow-lg ring-2 ring-slate-800 ring-offset-2 ring-offset-slate-950">
            {avatarInitial}
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
              {blockStatus?.bloqueado
                ? blockStatus.yoBloqueAlOtro
                  ? "Bloqueado"
                  : "Te ha bloqueado"
                : isOnline
                ? "En línea"
                : "Desconectado"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Botón menú de opciones */}
        <Button
          ref={menuButtonRef}
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="text-gray-400 hover:text-white hover:bg-slate-800"
        >
          <Icon icon="heroicons:ellipsis-vertical" className="text-xl" />
        </Button>

        {/* Indicador de escritura */}
        <AnimatePresence>
          {isTyping && typingUser && !blockStatus?.bloqueado && (
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
      </div>
    </motion.div>
  )
}
