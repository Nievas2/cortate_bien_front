import { useLocation, useNavigate } from "react-router-dom"
import SubscriptionSection from "../landing/components/SubscriptionSection"
import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { createOrderByPlan } from "@/services/OrderService"

const PricesPage = () => {
  const navigate = useNavigate();
  const { search } = useLocation()
  const id = search.split("=")[1]
  const { mutate } = useMutation({
    mutationKey: ["create-order"],
    mutationFn: async () => {
      return await createOrderByPlan(id)
    },
    onError(error : any) {
      if(error.response.data.message == "No se puede realizar una compra gratis"){
        navigate("/dashboard")
      }
    },
  })
  useEffect(() => {
    if (id) {
      mutate()
    }
  }, [])

  return (
    <section className="flex flex-col w-full py-5 bg-linear-to-t from-gray-main/20 to-gray-main">
      <SubscriptionSection />
    </section>
  )
}
export default PricesPage
