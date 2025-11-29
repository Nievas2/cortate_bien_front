import { Icon } from "@iconify/react/dist/iconify.js"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface ChatMobileHeaderProps {
  chatName: string
  onBack: () => void
}

export const ChatMobileHeader = ({ chatName, onBack }: ChatMobileHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="md:hidden flex items-center gap-3 p-4 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50 flex-shrink-0"
    >
      <Button
        onClick={onBack}
        variant="ghost"
        size="sm"
        className="p-2 hover:bg-slate-800/70 text-gray-400 hover:text-white rounded-full"
      >
        <Icon icon="heroicons:arrow-left-20-solid" className="text-xl" />
      </Button>
      <h2 className="text-lg font-semibold text-white">{chatName}</h2>
    </motion.div>
  )
}
