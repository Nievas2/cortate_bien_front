import { decodeJwt } from "@/utils/decodeJwt"
import Cookies from "js-cookie"
import { createContext, useContext, useState } from "react"

interface User {
  id: string
  sub: string
  name: string
  username: string
  email: string
  rol: string
  tipo_de_cuenta: "CLIENTE" | "BARBERO"
}

export interface AuthUser {
  user: User
  token: string
}

interface AuthContextType {
  authUser: AuthUser | null
  setAuthUser: (user: AuthUser | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider")
  }
  return context
}

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const token = Cookies.get("token")

  let storedUser : AuthUser | null = null
  if (token) {
    try {
      const user = decodeJwt(token) // Asegúrate de que esto devuelva una cadena JSON válida
      storedUser = {
        token,
        user,
      }
    } catch (error) {
      console.error("Error decoding token:", error)
    }
  }

  const [authUser, setAuthUser] = useState<AuthUser | null>(
    storedUser ? storedUser : null
  )

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  )
}
