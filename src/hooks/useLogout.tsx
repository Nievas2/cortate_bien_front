import { useAuthContext } from "@/contexts/authContext"
import Cookies from "js-cookie"
import { useState } from "react"

export const useLogout = () => {
  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()

  const logOut = () => {
    try {
      setLoading(true)
      Cookies.remove("token")
      setAuthUser(null)
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    } finally {
      setLoading(false)
    }
  }

  return { loading, logOut }
}
