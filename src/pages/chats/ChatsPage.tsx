import { useChatsList } from "@/hooks/chat/useChatList"
import { Icon } from "@iconify/react/dist/iconify.js"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChatByIdPage } from "./chatById/ChatByIdPage"
import { useSelectedChat } from "@/hooks/chat/useSelectedChat"
import { useChatFilters } from "@/hooks/chat/useChatFilters"
import { useChatUtils } from "@/hooks/chat/useChatUtils"
import { ChatListSidebar } from "./components/ChatListSidebar"
import { ChatEmptyState } from "./components/ChatEmptyState"

const ChatsPage = () => {
  const { data: chats, isLoading, error, refetch } = useChatsList()
  const { selectedChatId, selectChat, clearChat } = useSelectedChat()
  const { formatTime, getOtherUser, truncateMessage, authUserId } = useChatUtils()
  const { searchQuery, setSearchQuery, filteredChats } = useChatFilters({
    chats: chats || [],
    getOtherUser,
  })

  const displayChats = chats || []

  // Obtener nombre del chat seleccionado para el header móvil
  const selectedChatName = selectedChatId
    ? (() => {
        const chat = displayChats.find((c) => c.id === selectedChatId)
        if (!chat) return ""
        const otherUser = getOtherUser(chat)
        return `${otherUser.nombre} ${otherUser.apellido}`
      })()
    : ""

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Icon icon="eos-icons:loading" className="text-6xl text-blue-500" />
          <span className="text-gray-400 text-sm">
            Cargando conversaciones...
          </span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 text-center p-6"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <Icon
              icon="material-symbols:error-outline"
              className="text-5xl text-red-400"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-gray-100 font-semibold text-lg">
              Error al cargar conversaciones
            </span>
            <span className="text-gray-400 text-sm">
              No se pudieron obtener tus mensajes
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
    );
  }

  return (
    <div className="w-full h-[calc(100vh-5rem)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col md:flex-row relative">
      {/* Botón flotante para volver en móvil */}
      {selectedChatId && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={clearChat}
          className="md:hidden fixed top-24 left-4 z-50 bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-full shadow-2xl p-3 transition-all cursor-pointer ring-4 ring-blue-500/20"
          aria-label="Volver a la lista de chats"
        >
          <Icon icon="heroicons:arrow-left-20-solid" className="text-xl" />
        </motion.button>
      )}

      {/* Sidebar de chats */}
      <ChatListSidebar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filteredChats={filteredChats}
        selectedChatId={selectedChatId}
        onChatClick={selectChat}
        onRefetch={refetch}
        getOtherUser={getOtherUser}
        formatTime={formatTime}
        truncateMessage={truncateMessage}
        authUserId={authUserId}
        isVisible={!selectedChatId}
      />

      {/* Área de contenido del chat */}
      <div
        className={`flex-1 ${
          selectedChatId ? "flex" : "hidden md:flex"
        } flex-col items-center justify-center bg-slate-900/30 h-full`}
      >
        {selectedChatId ? (
          <div className="w-full h-full">
            <ChatByIdPage chatId={selectedChatId} nombre={selectedChatName} />
          </div>
        ) : (
          <ChatEmptyState />
        )}
      </div>
    </div>
  )
}

export default ChatsPage
