import { useChatsList } from "@/hooks/chat/useChatList";
import { useAuthContext } from "@/contexts/authContext";
import { ChatResponseDto } from "@/interfaces/Chat";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChatByIdPage } from "./chatById/ChatByIdPage";

const ChatsPage = () => {
  const { data: chats, isLoading, error, refetch } = useChatsList();
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInMinutes = Math.floor(
      (now.getTime() - messageDate.getTime()) / (1000 * 60)
    );
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "Ahora";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays < 7) return `${diffInDays}d`;

    return messageDate.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const getOtherUser = (chat: ChatResponseDto) => {
    const isUserClient = authUser?.user.sub === chat.cliente.id;
    return isUserClient ? chat.barbero : chat.cliente;
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  const handleChatClick = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  const displayChats = chats || [];

  const filteredChats = displayChats?.filter((chat: any) => {
    if (!searchQuery) return true;
    const otherUser = getOtherUser(chat);
    const fullName = `${otherUser.nombre} ${otherUser.apellido}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

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
      <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center pt-20">
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
    <div className="w-full h-[calc(100vh-5rem)] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex">
      {/* Sidebar de chats - Estilo Facebook Messenger */}
      <div className="w-full md:w-96 border-r border-slate-800/50 bg-slate-950/80 backdrop-blur-lg flex flex-col h-[calc(100vh-5rem)]">
        {/* Header del sidebar */}
        <div className="flex-shrink-0 p-4 border-b border-slate-800/50">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Chats</h1>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => refetch()}
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/60 border-none rounded-full pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        {/* Lista de chats */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {filteredChats && filteredChats.length > 0 ? (
            <div className="flex flex-col">
              <AnimatePresence mode="popLayout">
                {filteredChats.map((chat: any, index: number) => {
                  const otherUser = getOtherUser(chat);
                  const isActive = selectedChatId === chat.id;

                  return (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleChatClick(chat.id)}
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
                            {formatTime(chat.ultimaActividad)}
                          </span>
                        </div>

                        {/* Último mensaje */}
                        <div className="flex items-center gap-1.5">
                          {chat.ultimoMensaje && (
                            <>
                              {chat.ultimoMensaje.remitente ===
                                authUser?.user.sub && (
                                <span
                                  className={`text-xs flex-shrink-0 ${
                                    !chat.visto
                                      ? "text-white font-medium"
                                      : "text-gray-500"
                                  }`}
                                >
                                  Tú:
                                </span>
                              )}
                              <p
                                className={`text-sm truncate ${
                                  !chat.visto
                                    ? "text-white font-medium"
                                    : "text-gray-500"
                                }`}
                              >
                                {truncateMessage(
                                  chat.ultimoMensaje.contenido,
                                  35
                                )}
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
                  );
                })}
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
                {searchQuery
                  ? "No se encontraron chats"
                  : "No tienes conversaciones"}
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

      {/* Área de contenido del chat */}
      <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-slate-900/30">
        {selectedChatId ? (
          <div className="w-full h-full">
            <ChatByIdPage
              chatId={selectedChatId}
              nombre={
                (() => {
                  const chat = displayChats.find((c) => c.id === selectedChatId);
                  if (!chat) return "";
                  const otherUser = getOtherUser(chat);
                  return `${otherUser.nombre} ${otherUser.apellido}`;
                })()
              }
            />
          </div>
        ) : (
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
            <h2 className="text-2xl font-bold text-white mb-3">
              Selecciona un chat
            </h2>
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
        )}
      </div>
    </div>
  );
};

export default ChatsPage;
