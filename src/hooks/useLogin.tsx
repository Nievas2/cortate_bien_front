import { useState } from "react"
import axiosInstance from "@/api/axiosInstance"
import { useAuthContext } from "@/contexts/authContext"
import { decodeJwt } from "@/utils/decodeJwt"

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

      localStorage.setItem("token", data.accesToken)
      const user = decodeJwt(data.accesToken)
      localStorage.setItem("user", JSON.stringify(user))
      setAuthUser(data)

      return null
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        throw new Error("Incorrect credentials. Please try again.")
      } else {
        throw new Error("An unexpected error occurred. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return { loading, login }
}

export default useLogin
