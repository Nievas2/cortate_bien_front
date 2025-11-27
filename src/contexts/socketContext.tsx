import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "./authContext";

interface ISocketContext {
  socket: Socket | null;
  isSocketConnected: boolean;
}

const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const { authUser } = useAuthContext();
  const token = authUser?.token;

  // La URL de tu backend
  const baseUrl = import.meta.env.VITE_API_URL_SHORT.replace(/\/$/, "");
  const socketUrl = `${baseUrl}/chat`;
  useEffect(() => {
    if (token) {
      // Conectamos al namespace 'chat' como se define en el backend
      const newSocket = io(socketUrl, {
        auth: {
          token,
        },
        transports: ["websocket"],
      });
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log(`🔌 Socket connected: ${newSocket.id}`);
        setIsSocketConnected(true);
      });

      newSocket.on("disconnect", (reason: any) => {
        console.log(`🔌 Socket disconnected: ${reason}`);
        setIsSocketConnected(false);
      });

      newSocket.on("error", (error: any) => {
        console.error("Socket Error:", error.message);
      });

      return () => {
        console.log("🔌 Disconnecting socket...");
        newSocket.disconnect();
      };
    } else {
      console.log("No authUser?.token available, not connecting socket.");
      setSocket(null);
      setIsSocketConnected(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!token]); // Solo reconectar si cambia el estado de autenticación (login/logout)

  // Efecto para actualizar el token en el socket si cambia (refresh token)
  useEffect(() => {
    if (socket && token) {
      socket.auth = { token };
    }
  }, [token, socket]);

  const value = useMemo(
    () => ({ socket, isSocketConnected }),
    [socket, isSocketConnected]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
