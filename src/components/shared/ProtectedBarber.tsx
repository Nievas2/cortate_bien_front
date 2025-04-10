import { useAuthContext } from "@/contexts/authContext"
import React from "react"
import { Navigate } from "react-router-dom"

export const ProtecteBarberRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { authUser } = useAuthContext()

  if (authUser?.user.rol == "ADMIN") {
    return <>{children}</>
  }

  if (authUser?.user.tipo_de_cuenta !== "BARBERO" || authUser == null) {
    return <Navigate to="/auth/iniciar-sesion" replace />
  }

  return <>{children}</>
}
