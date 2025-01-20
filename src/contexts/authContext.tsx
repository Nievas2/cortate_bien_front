import { createContext, useContext, useState } from "react"

interface User {
  id: string
  sub: string
  name: string
  username: string
  email: string
  rol: string
  tipo_de_cuenta: string
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
  const storedUser = localStorage.getItem("user")
  const [authUser, setAuthUser] = useState<AuthUser | null>(
    storedUser ? JSON.parse(storedUser) : null
  )

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  )
}
