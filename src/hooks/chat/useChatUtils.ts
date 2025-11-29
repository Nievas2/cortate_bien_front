import { useAuthContext } from "@/contexts/authContext"
import { ChatResponseDto } from "@/interfaces/Chat"

export const useChatUtils = () => {
  const { authUser } = useAuthContext()

  const formatTime = (date: Date) => {
    const now = new Date()
    const messageDate = new Date(date)
    const diffInMinutes = Math.floor(
      (now.getTime() - messageDate.getTime()) / (1000 * 60)
    )
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 1) return "Ahora"
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInHours < 24) return `${diffInHours}h`
    if (diffInDays < 7) return `${diffInDays}d`

    return messageDate.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
    })
  }

  const getOtherUser = (chat: ChatResponseDto) => {
    const isUserClient = authUser?.user.sub === chat.cliente.id
    return isUserClient ? chat.barbero : chat.cliente
  }

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + "..."
  }

  return {
    formatTime,
    getOtherUser,
    truncateMessage,
    authUserId: authUser?.user.sub,
  }
}
