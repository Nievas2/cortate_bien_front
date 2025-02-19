import { useQuery } from "@tanstack/react-query"
import Layout from "../Layout"
import { getBarbersDisabled } from "@/services/BarberService"
import CardBarberyDisabled from "./components/CardBarberyDisabled"

const DisabledBarbersPage = () => {
  const { data } = useQuery({
    queryKey: ["disabledBarbers"],
    queryFn: getBarbersDisabled,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
    retry: false,
  })

  return (
    <Layout>
      <section className="flex flex-col ">
        {data?.data.results.length === 0 ? (
          <span className="text-center w-full">
            No hay barberias deshabilitadas
          </span>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data?.data.results.map((barbery: any) => (
              <CardBarberyDisabled key={barbery.id} barbery={barbery} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  )
}
export default DisabledBarbersPage
