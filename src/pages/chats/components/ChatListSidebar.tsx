import { Icon } from "@iconify/react/dist/iconify.js"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ChatResponseDto } from "@/interfaces/Chat"
import { ChatListItem } from "./ChatListItem"

interface ChatListSidebarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filteredChats: ChatResponseDto[]
  selectedChatId: string | null
  onChatClick: (chatId: string) => void
  onRefetch: () => void
  getOtherUser: (chat: ChatResponseDto) => { nombre: string; apellido: string }
  formatTime: (date: Date) => string
  truncateMessage: (message: string, maxLength?: number) => string
  authUserId?: string
  isVisible: boolean
}

export const ChatListSidebar = ({
  searchQuery,
  onSearchChange,
  filteredChats,
  selectedChatId,
  onChatClick,
  onRefetch,
  getOtherUser,
  formatTime,
  truncateMessage,
  authUserId,
  isVisible,
}: ChatListSidebarProps) => {
  return (
    <div
      className={`${
        isVisible ? "flex" : "hidden"
      } md:flex w-full md:w-96 border-r border-slate-800/50 bg-slate-950/80 backdrop-blur-lg flex-col h-full md:h-[calc(100vh-5rem)]`}
    >      {/* Header del sidebar */}
      <div className="flex-shrink-0 p-4 border-b border-slate-800/50">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Chats</h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={onRefetch}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-slate-800/70 text-gray-400 hover:text-white rounded-full"
            >
              <Icon icon="material-symbols:refresh" className="text-xl" />
            </Button>
          </div>
        </div>

        {/* Buscador */}
        <div className="relative">
          <Icon
            icon="heroicons:magnifying-glass-20-solid"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg"
          />
          <input
            type="text"
            placeholder="Buscar en Messenger"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-800/60 border-none rounded-full pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Lista de chats */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {filteredChats && filteredChats.length > 0 ? (
          <div className="flex flex-col">
            <AnimatePresence mode="popLayout">
              {filteredChats.map((chat, index) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  index={index}
                  isActive={selectedChatId === chat.id}
                  onClick={() => onChatClick(chat.id)}
                  otherUser={getOtherUser(chat)}
                  formatTime={formatTime}
                  truncateMessage={truncateMessage}
                  authUserId={authUserId}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* Estado vacío */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center p-8"
          >
            <div className="w-20 h-20 rounded-full bg-slate-800/50 border-2 border-dashed border-slate-700 flex items-center justify-center mb-4">
              <Icon
                icon="heroicons:chat-bubble-left-right-20-solid"
                className="text-4xl text-gray-600"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-200 mb-2">
              {searchQuery ? "No se encontraron chats" : "No tienes conversaciones"}
            </h3>
            <p className="text-gray-500 text-sm">
              {searchQuery
                ? "Intenta con otro término de búsqueda"
                : "Cuando inicies una conversación, aparecerá aquí"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
