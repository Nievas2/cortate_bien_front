import { useLocation } from "react-router-dom"
import FeatureSection from "./components/FeatureSection"
import HeroSection from "./components/HeroSection"
import SubscriptionSection from "./components/SubscriptionSection"
import { useEffect } from "react"
import Cookies from "js-cookie"/* 
import { decodeJwt } from "@/utils/decodeJwt" */

const LandingPage = () => {
  const { search } = useLocation()
  document.title = "Cortate bien | Inicio"
  console.log("search", search.split("=")[1])
  useEffect(() => {
    const token = search.split("=")[1]
    if (token) {
      Cookies.set("token", token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      })
     /*  const decode = decodeJwt(token)
      if (
        decode.city_id == undefined ||
        decode.city_id == null ||
        decode.city_id == 0
      ) {
        window.location.href = "/profile?required=true"
      } */
    }
  }, [])
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <FeatureSection />
      <SubscriptionSection />
    </div>
  )
}
export default LandingPage
