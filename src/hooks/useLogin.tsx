import { useState } from "react"
import axiosInstance from "@/api/axiosInstance"
import { useAuthContext } from "@/contexts/authContext"
import { decodeJwt } from "@/utils/decodeJwt"
import Cookies from "js-cookie"

export interface LoginParams {
  email: string
  password: string
}

const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()

  const login = async ({ email, password }: LoginParams) => {
    setLoading(true)

    try {      
      const response = await axiosInstance.post("auth/login", {
        email,
        password,
      })

      const data = response.data

      Cookies.set("token", data.accesToken)

      const user = decodeJwt(data.accesToken)
      const userAuth = {
        user: user,
        token: data.accesToken,
      }
      setAuthUser(userAuth)
      window.location.href = "/"

      return null
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        throw new Error("Credenciales incorrectas.")
      } else {
        throw new Error("Un error inesperado ha ocurrido.")
      }
    } finally {
      setLoading(false)
    }
  }

  return { loading, login }
}

export default useLogin
