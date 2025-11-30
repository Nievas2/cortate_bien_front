import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icon } from "@iconify/react/dist/iconify.js"
import { motion } from "framer-motion"
import { BlockStatusDto } from "@/interfaces/Chat"

interface ChatInputProps {
  message: string
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  blockStatus?: BlockStatusDto
  inputRef: React.RefObject<HTMLDivElement>
}

export const ChatInput = ({
  message,
  onMessageChange,
  onSubmit,
  blockStatus,
  inputRef,
}: ChatInputProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex-shrink-0 bg-slate-950/80 backdrop-blur-lg border-t border-slate-800/50 p-4"
      ref={inputRef}
    >
      {/* Mensaje de bloqueo */}
      {blockStatus?.bloqueado && (
        <div className="flex items-center justify-center gap-2 mb-3 py-2 px-4 bg-slate-800/60 rounded-lg">
          <Icon icon="heroicons:no-symbol" className="text-red-400" />
          <span className="text-sm text-gray-400">
            {blockStatus.yoBloqueAlOtro && blockStatus.elOtroMeBloqueo
              ? "Ambos se han bloqueado mutuamente"
              : blockStatus.yoBloqueAlOtro
              ? "Has bloqueado a este usuario."
              : "Este usuario te ha bloqueado."}
          </span>
        </div>
      )}
      <form onSubmit={onSubmit} className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={onMessageChange}
            placeholder={
              blockStatus?.bloqueado ? "Chat bloqueado..." : "Escribe un mensaje..."
            }
            disabled={blockStatus?.bloqueado}
            className="bg-slate-800/60 border-slate-700 text-gray-100 placeholder:text-gray-500 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-xl text-sm min-h-[48px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ lineHeight: "1.5", paddingTop: 10, paddingBottom: 10 }}
          />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <Button
              type="submit"
              disabled={!message.trim() || blockStatus?.bloqueado}
              className="h-9 w-9 p-0 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-slate-700 disabled:to-slate-700 shadow-lg disabled:shadow-none transition-all duration-200"
            >
              <motion.div
                animate={
                  message.trim() && !blockStatus?.bloqueado ? { x: [0, 2, 0] } : {}
                }
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <Icon icon="heroicons:paper-airplane-solid" className="text-base" />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  )
}
