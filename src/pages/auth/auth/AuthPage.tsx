import { useAuthContext } from "@/contexts/authContext"
import { decodeJwt } from "@/utils/decodeJwt"
import { Icon } from "@iconify/react/dist/iconify.js"
import Cookies from "js-cookie"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const AuthPage = () => {
  const { setAuthUser } = useAuthContext()
  const navigate = useNavigate()
  const location = useLocation()
  const search = location.search

  useEffect(() => {
    if (search) {
      const token = search.split("=")[1]
      Cookies.set("token", token)
      const user = decodeJwt(token)
      const data = {
        user,
        token,
      }
      setAuthUser(data)
      navigate("/")
    } else {
      window.location.href = "/"
    }
  }, [])
  return (
    <div className="flex items-center justify-center h-[60vh] w-full">
      <Icon icon="codex:loader" width="40" height="40" />
    </div>
  )
}
export default AuthPage
