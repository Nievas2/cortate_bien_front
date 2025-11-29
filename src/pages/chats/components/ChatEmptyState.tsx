import { motion } from "framer-motion"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export const ChatEmptyState = () => {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center max-w-md px-6"
    >
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-dashed border-slate-700 flex items-center justify-center mb-6">
        <Icon
          icon="heroicons:chat-bubble-left-right-solid"
          className="text-6xl text-blue-500/40"
        />
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">Selecciona un chat</h2>
      <p className="text-gray-400 mb-6">
        Elige una conversación de la lista para empezar a chatear
      </p>
      <Button
        onClick={() => navigate("/barbers")}
        variant="secondary"
        className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg"
      >
        <Icon icon="mdi:content-cut" className="mr-2" />
        Buscar barberías
      </Button>
    </motion.div>
  )
}
