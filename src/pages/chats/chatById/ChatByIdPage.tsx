import { useLocation } from "react-router-dom"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useChatRoom } from "@/hooks/chat/useChatRoom"
import { useSocket } from "@/contexts/socketContext"

const ChatByIdPage = () => {
  const { pathname } = useLocation()
  const { sendMessage, messages } = useChatRoom(pathname.split("/")[2])
  const [message, setMessage] = useState("")
  const {isSocketConnected} = useSocket()
console.log(isSocketConnected);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para enviar el mensaje
    setMessage("")
  }
  console.log(messages)

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col bg-gray-700 p-4 min-h-[80vh]">
        {/*  {Array.isArray(data) && data.length > 0 ? (
          data.map((msg: any) => (
            <div key={crypto.randomUUID()} className="">
              <div className="inline-block text-sm font-semibold text-gray-800">
                <span>{msg.text}</span>
              </div>
            </div>
          ))
        ) : ( */}
        <div style={{ color: "#888" }}>No hay mensajes aún.</div>
        {/*  )} */}
      </div>
      <form onSubmit={handleSend} className="flex gap-2 bg-gray-700">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <Button
          type="submit"
          variant="secondary"
          onClick={() => sendMessage(message)}
        >
          Enviar
        </Button>
      </form>
    </div>
  )
}
export default ChatByIdPage
