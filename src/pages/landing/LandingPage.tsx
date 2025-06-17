import { useLocation } from "react-router-dom"
import FeatureSection from "./components/FeatureSection"
import HeroSection from "./components/HeroSection"
import SubscriptionSection from "./components/SubscriptionSection"
import { useEffect } from "react"
import Cookies from "js-cookie"
import { decodeJwt } from "@/utils/decodeJwt"
import { useAuthContext } from "@/contexts/authContext"

const LandingPage = () => {
  const { setAuthUser } = useAuthContext()
  const { search } = useLocation()
  document.title = "Cortate bien | Inicio"
  useEffect(() => {
    const params = new URLSearchParams(search)
    const token = params.get("token")
    if (token) {
      Cookies.set("token", token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      })
      const user = decodeJwt(token)
      const userAuth = {
        user: user,
        token: token,
      }
      setAuthUser(userAuth)
      window.location.href = "/"
    } else if (search) {
      window.location.href = "/"
    }
  }, [search])
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <FeatureSection />
      <SubscriptionSection />
    </div>
  )
}
export default LandingPage
