import Layout from "../layout"
import { useLocation } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getBarberById } from "@/services/BarberService"

const BarberPage = () => {
  const { search } = useLocation()
  const id = search.split("=")[1]

  const { data } = useQuery({
    queryKey: ["getbarberbyid"],
    queryFn: () => getBarberById(id),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
  })
  console.log(data);
  

  return <Layout>BarberPage</Layout>
}
export default BarberPage
