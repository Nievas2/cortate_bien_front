import { useLocation } from "react-router-dom"
import SubscriptionSection from "../landing/components/SubscriptionSection"
import { useEffect } from "react"

const PricesPage = () => {
  const { search } = useLocation()
  const id = search.split("=")[1]
  useEffect(() => {
    if (id) {
      console.log(id);
      
    }
  },[])
  
  return (
    <section className="flex flex-col w-full py-5 bg-linear-to-t from-gray-main/20 to-gray-main">
      <SubscriptionSection />
    </section>
  )
}
export default PricesPage
