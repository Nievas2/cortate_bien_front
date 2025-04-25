import { useState } from "react"
import axiosInstance from "@/api/axiosInstance"
import { useAuthContext } from "@/contexts/authContext"
import { decodeJwt } from "@/utils/decodeJwt"
import Cookies from "js-cookie"

export interface LoginParams {
  email: string
  password: string
}
export const setCookieAsync = (
  name: string,
  value: string,
  options: Cookies.CookieAttributes
): Promise<void> => {
  return new Promise((resolve) => {
    Cookies.set(name, value, options)
    resolve()
  })
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
      const user = decodeJwt(data.accesToken)
      const userAuth = {
        user: user,
        token: data.accesToken,
      }
      setAuthUser(userAuth)

      await setCookieAsync("token", data.accesToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      })

      if (userAuth.user.tipo_de_cuenta == "BARBERO") {
        window.location.href = "/dashboard"
      } else {
        window.location.href = "/"
      }

      return null
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        throw new Error("Credenciales incorrectas.")
      } else {
        throw error
      }
    } finally {
      setLoading(false)
    }
  }

  return { loading, login }
}

export default useLogin
