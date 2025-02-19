import axiosInstance from "@/api/axiosInstance"
/* import { useAuthContext } from "@/contexts/authContext" */
import { Register } from "@/services/AuthService"
import { useState } from "react"

export const useRegister = () => {
  const [loading, setLoading] = useState(false)
 /*  const { setAuthUser } = useAuthContext() || {} */

  const register = async ({
    nombre,
    apellido,
    fechaDeNacimiento,
    email,
    telefono,
    tipoDeCuenta,
    password,
    ciudad_id
  }: Register) => {
    setLoading(true)

    try {
      const res = await axiosInstance.post("auth/register", {
        nombre,
        apellido,
        fechaDeNacimiento,
        email,
        telefono,
        tipoDeCuenta,
        password,
        ciudad_id
      })
      return res
            
      const data = res.data

      if (data.error) throw new Error(data.error)
/* 
      localStorage.setItem("user", JSON.stringify(data))
      localStorage.setItem("user-token", data.accesToken)
      setAuthUser(data) */
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { loading, register }
}
