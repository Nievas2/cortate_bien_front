import { useAuthContext } from "@/contexts/authContext"
import { deleteTokenFirebase } from "@/services/FirebaseService"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import Cookies from "js-cookie"

export const useLogout = () => {
  const [loading, setLoading] = useState(false)
  const { authUser, setAuthUser } = useAuthContext()
  const { mutate: deleteToken } = useMutation({
    mutationKey: ["delete-token-firebase"],
    mutationFn: async (token: string) => {
      return deleteTokenFirebase(token)
    },
  })

  const logOut = () => {
    try {
      setLoading(true)
      localStorage.removeItem("active")
      if (authUser?.fcmToken) {
        deleteToken(authUser?.fcmToken)
      }
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
