import { motion, AnimatePresence } from "framer-motion"
import { Icon } from "@iconify/react/dist/iconify.js"

interface ScrollToBottomButtonProps {
  show: boolean
  onClick: () => void
}

export const ScrollToBottomButton = ({ show, onClick }: ScrollToBottomButtonProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClick}
          className="fixed bottom-28 right-6 z-50 bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-full shadow-2xl p-3 transition-all cursor-pointer ring-4 ring-blue-500/20"
          aria-label="Bajar al último mensaje"
        >
          <Icon icon="heroicons:arrow-down-20-solid" className="text-xl" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
