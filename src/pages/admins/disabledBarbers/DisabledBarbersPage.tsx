import { useQuery } from "@tanstack/react-query"
import Layout from "../Layout"
import { getBarbersDisabled } from "@/services/BarberService"
import CardBarberyDisabled from "./components/CardBarberyDisabled"
import { useState } from "react"
import { BarberGet } from "@/interfaces/Barber"
import DisabledBarbersByIdPage from "./disabledBarbersById/DisabledBarbersByIdPage"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react/dist/iconify.js"

const DisabledBarbersPage = () => {
  const [selectBarber, setSelectBarber] = useState<undefined | BarberGet>()
  const { data } = useQuery({
    queryKey: ["disabledBarbers"],
    queryFn: getBarbersDisabled,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
    retry: false,
  })

  return (
    <>
      {selectBarber && (
        <Button variant="simple" className="fixed top-4 left-4">
          <Icon
            icon="carbon:arrow-left"
            width={24}
            onClick={() => setSelectBarber(undefined)}
          />
        </Button>
      )}
      {selectBarber ? (
        <DisabledBarbersByIdPage barber={selectBarber} />
      ) : (
        <Layout>
          <section className="flex flex-col ">
            {data?.data.results.length === 0 ? (
              <span className="text-center w-full">
                No hay barberias deshabilitadas
              </span>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {data?.data.results.map((barber: any) => (
                  <CardBarberyDisabled
                    key={barber.id}
                    barber={barber}
                    setSelectBarber={(e: BarberGet) => setSelectBarber(e)}
                  />
                ))}
              </div>
            )}
          </section>
        </Layout>
      )}
    </>
  )
}
export default DisabledBarbersPage
