import { useAuthContext } from "@/contexts/authContext"
import React from "react"
import { Navigate, useLocation } from "react-router-dom"

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { authUser } = useAuthContext()
  const { pathname, search } = useLocation()

  if (authUser == null) {
    return <Navigate to="/auth/iniciar-sesion" replace />
  }
  if (
    authUser.user.rol === "PENDING_REGISTER" &&
    (pathname !== "/profile" || search !== "?required=true")
  ) {
    return <Navigate to="/profile?required=true" replace />
  }

  return <>{children}</>
}
