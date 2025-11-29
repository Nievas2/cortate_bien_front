import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

export const useSelectedChat = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Obtener el chatId de los query params
  const searchParams = new URLSearchParams(location.search)
  const chatIdFromUrl = searchParams.get("chat")
  
  const [selectedChatId, setSelectedChatId] = useState<string | null>(
    chatIdFromUrl
  )

  // Sincronizar con URL
  useEffect(() => {
    if (chatIdFromUrl && chatIdFromUrl !== selectedChatId) {
      setSelectedChatId(chatIdFromUrl)
    }
  }, [chatIdFromUrl])

  const selectChat = (chatId: string) => {
    setSelectedChatId(chatId)
    navigate(`/chats?chat=${chatId}`, { replace: true })
  }

  const clearChat = () => {
    setSelectedChatId(null)
    navigate("/chats", { replace: true })
  }

  return {
    selectedChatId,
    selectChat,
    clearChat,
  }
}
