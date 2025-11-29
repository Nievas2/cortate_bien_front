import { useState, useMemo } from "react"
import { ChatResponseDto } from "@/interfaces/Chat"

interface UseChatFiltersProps {
  chats: ChatResponseDto[]
  getOtherUser: (chat: ChatResponseDto) => { nombre: string; apellido: string }
}

export const useChatFilters = ({ chats, getOtherUser }: UseChatFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredChats = useMemo(() => {
    if (!searchQuery) return chats

    return chats.filter((chat) => {
      const otherUser = getOtherUser(chat)
      const fullName = `${otherUser.nombre} ${otherUser.apellido}`.toLowerCase()
      return fullName.includes(searchQuery.toLowerCase())
    })
  }, [chats, searchQuery, getOtherUser])

  return {
    searchQuery,
    setSearchQuery,
    filteredChats,
  }
}
