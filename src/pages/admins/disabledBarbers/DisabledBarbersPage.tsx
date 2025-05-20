import { useQuery } from "@tanstack/react-query"
import Layout from "../Layout"
import { getBarbersDisabled } from "@/services/BarberService"
import CardBarberyDisabled from "./components/CardBarberyDisabled"
import { useEffect, useState } from "react"
import { BarberGet } from "@/interfaces/Barber"
import DisabledBarbersByIdPage from "./disabledBarbersById/DisabledBarbersByIdPage"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react/dist/iconify.js"
import { PaginationBarbersDisabled } from "@/components/shared/admins/PaginationBarbersDisabled"
import usePaginationBarbersDisabled from "@/hooks/admins/usePaginationBarbersDisabled"

const DisabledBarbersPage = () => {
  const [selectBarber, setSelectBarber] = useState<undefined | BarberGet>()
  const [filter, setFilter] = useState<string>("PENDIENTE")
  const { currentPage, totalPages, handlePageChange, setTotalPages } =
    usePaginationBarbersDisabled()
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["disabledBarbers"],
    queryFn: () => getBarbersDisabled(filter),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
    retry: false,
  })

  useEffect(() => {
    if (data) {
      setTotalPages(data.data.total_pages)
    }
  }, [data])

  useEffect(() => {
    refetch()
  }, [filter])
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
          <section className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={filter === "PENDIENTE" ? "secondary" : "simple"}
              disabled={filter === "PENDIENTE"}
              onClick={() => setFilter("PENDIENTE")}
            >
              Pendientes
            </Button>

            <Button
              variant={filter === "CONFIRMADO" ? "secondary" : "simple"}
              disabled={filter === "CONFIRMADO"}
              onClick={() => setFilter("CONFIRMADO")}
            >
              Aceptados
            </Button>

            <Button
              variant={filter === "CANCELADO" ? "secondary" : "simple"}
              disabled={filter === "CANCELADO"}
              onClick={() => setFilter("CANCELADO")}
            >
              Cancelados
            </Button>

            <Button
              variant={filter === "REPROGRAMADO" ? "secondary" : "simple"}
              disabled={filter === "REPROGRAMADO"}
              onClick={() => setFilter("REPROGRAMADO")}
            >
              Reprogramados
            </Button>

            <Button
              variant={filter === "COMPLETADO" ? "secondary" : "simple"}
              disabled={filter === "COMPLETADO"}
              onClick={() => setFilter("COMPLETADO")}
            >
              Reprogramados
            </Button>
          </section>

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

            {data?.data.results.length !== 0 && (
              <section className="flex items-center justify-center pb-4">
                <PaginationBarbersDisabled
                  currentPage={currentPage!}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  disabled={isLoading}
                />
              </section>
            )}
          </section>
        </Layout>
      )}
    </>
  )
}
export default DisabledBarbersPage
