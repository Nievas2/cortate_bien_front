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
        <>
          <Button
            variant="secondary"
            className="fixed top-24 left-4 z-50"
            onClick={() => setSelectBarber(undefined)}
          >
            <Icon icon="carbon:arrow-left" width={24} />
          </Button>
          <DisabledBarbersByIdPage barber={selectBarber} refetch={refetch} setSelectBarber={setSelectBarber} />
        </>
      ) : (
        <Layout>
          <div className="flex flex-col gap-4 items-center justify-center w-full min-h-screen">
            <section className="flex flex-wrap gap-2 justify-center">
              {/*  ACTIVO, INACTIVO, RECHAZADO, PENDIENTE, BANEO */}
              <Button
                variant={filter === "PENDIENTE" ? "secondary" : "simple"}
                disabled={filter === "PENDIENTE"}
                onClick={() => setFilter("PENDIENTE")}
              >
                Pendientes
              </Button>

              <Button
                variant={filter === "ACTIVO" ? "secondary" : "simple"}
                disabled={filter === "ACTIVO"}
                onClick={() => setFilter("ACTIVO")}
              >
                Aceptados
              </Button>

              <Button
                variant={filter === "INACTIVO" ? "secondary" : "simple"}
                disabled={filter === "INACTIVO"}
                onClick={() => setFilter("INACTIVO")}
              >
                Cancelados
              </Button>

              <Button
                variant={filter === "RECHAZADO" ? "secondary" : "simple"}
                disabled={filter === "RECHAZADO"}
                onClick={() => setFilter("RECHAZADO")}
              >
                Reprogramados
              </Button>

              <Button
                variant={filter === "BANEO" ? "secondary" : "simple"}
                disabled={filter === "BANEO"}
                onClick={() => setFilter("BANEO")}
              >
                Reprogramados
              </Button>
            </section>

            <section className="flex flex-col h-full">
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
          </div>
        </Layout>
      )}
    </>
  )
}
export default DisabledBarbersPage
