import axiosInstance from "@/api/axiosInstance"
import { MessageResponseDto } from "@/interfaces/Chat"
import { IGenericPage } from "@/interfaces/GenericPage"

export const getUserChats = async () => {
  const response = await axiosInstance.get(`chat`)
  return response.data
}

export const getChatMessages = async ({
  chatId,
  pageParam = 1,
}: {
  chatId: string
  pageParam?: number
}) => {
  const response = await axiosInstance.get<IGenericPage<MessageResponseDto>>(
    `chat/${chatId}/messages?page=${pageParam}&limit=30` // Traemos 30 mensajes por página
  )
  return response.data
}

export const markMessagesAsReadApi = async (messageIds: string[]) => {
  await axiosInstance.post(`chat/messages/mark-read`, { messageIds })
}

export const createOrGetChat = async (
  barberoId: string,
  barberiaId: string
) => {
  const response = await axiosInstance.post(`chat`, { barberoId, barberiaId })
  return response.data
}
