import { useQuery } from "@tanstack/react-query"
import Layout from "../Layout"
import { getbarberiesDisabled } from "@/services/BarberService"
import CardBarberyDisabled from "./components/CardBarberyDisabled"

const DisabledBarberiesPage = () => {
  const { data } = useQuery({
    queryKey: ["disabledBarberies"],
    queryFn: getbarberiesDisabled,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
  })
  console.log(data)

  return (
    <Layout>
      <section className="flex flex-wrap ">
        {data?.data.results.map((barbery: any) => (
          <CardBarberyDisabled key={barbery.id} barbery={barbery} />
        ))}
      </section>
    </Layout>
  )
}
export default DisabledBarberiesPage
