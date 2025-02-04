import { Icon } from "@iconify/react/dist/iconify.js"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

const AuthPage = () => {
  const location = useLocation()
  const search = location.search
  const email = search.split("=")[1]

  useEffect(() => {
    if (email) {
      /* navigate("/") */
    } 
  }, [])
  return (
    <div className="flex items-center justify-center h-[60vh] w-full">
      <Icon icon="codex:loader" width="40" height="40" />
    </div>
  )
}
export default AuthPage
