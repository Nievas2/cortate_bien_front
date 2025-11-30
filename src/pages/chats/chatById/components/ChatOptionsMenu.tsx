import { motion, AnimatePresence } from "framer-motion"
import { Icon } from "@iconify/react/dist/iconify.js"
import { BlockStatusDto } from "@/interfaces/Chat"
import { useEffect, useState, useCallback } from "react"

interface ChatOptionsMenuProps {
  isOpen: boolean
  onClose: () => void
  buttonRef: React.RefObject<HTMLButtonElement>
  blockStatus?: BlockStatusDto
  onBlock: () => void
  onUnblock: () => void
  isBlocking: boolean
  isUnblocking: boolean
}

export const ChatOptionsMenu = ({
  isOpen,
  onClose,
  buttonRef,
  blockStatus,
  onBlock,
  onUnblock,
  isBlocking,
  isUnblocking,
}: ChatOptionsMenuProps) => {
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })

  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const menuWidth = 200 // min-w-[200px]
      
      // Calcular left: intentar alinear el borde derecho del menú con el borde derecho del botón
      let left = rect.right - menuWidth
      
      // Si el menú se sale por la izquierda, alinearlo con el borde izquierdo del botón
      if (left < 10) {
        left = rect.left
      }
      
      // Si el menú se sale por la derecha, ajustar
      if (left + menuWidth > window.innerWidth - 10) {
        left = window.innerWidth - menuWidth - 10
      }
      
      setMenuPosition({
        top: rect.bottom + 8,
        left: left,
      })
    }
  }, [buttonRef])

  useEffect(() => {
    if (isOpen) {
      updatePosition()
      // Actualizar posición si cambia el tamaño de ventana
      window.addEventListener('resize', updatePosition)
      return () => window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen, updatePosition])

  const handleAction = (action: () => void) => {
    action()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop para cerrar el menú */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9998]"
          />
          {/* Menú flotante */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
            }}
            className="fixed z-[9999] bg-slate-900 border border-slate-700 rounded-lg shadow-xl min-w-[200px] overflow-hidden"
          >
            {blockStatus?.yoBloqueAlOtro ? (
              <button
                onClick={() => handleAction(onUnblock)}
                disabled={isUnblocking}
                className="w-full flex items-center gap-3 px-4 py-3 text-green-400 hover:text-green-300 hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                <Icon icon="heroicons:lock-open" className="text-lg" />
                <span>{isUnblocking ? "Desbloqueando..." : "Desbloquear usuario"}</span>
              </button>
            ) : (
              <button
                onClick={() => handleAction(onBlock)}
                disabled={isBlocking}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                <Icon icon="heroicons:no-symbol" className="text-lg" />
                <span>{isBlocking ? "Bloqueando..." : "Bloquear usuario"}</span>
              </button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
