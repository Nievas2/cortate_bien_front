import { useChatsList } from "@/hooks/chat/useChatList"

const ChatsPage = () => {
  const { data: chats, isLoading, error, refetch } = useChatsList()
  console.log(chats)

  return <div>ChatsPage</div>
}
export default ChatsPage
