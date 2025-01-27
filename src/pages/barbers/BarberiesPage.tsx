import { BarberGet } from "@/interfaces/Barber"
import { getBarbers } from "@/services/BarberService"
import { useQuery } from "@tanstack/react-query"
import Card from "./components/Card"
import usePaginationBarbers from "@/hooks/barbers/usePaginationBarbers"
import { PaginationBarbers } from "@/components/shared/barbers/PaginationBarbers"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import CitySelect from "../dashboard/components/CitySelect"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react/dist/iconify.js"
import CountrySelect from "../dashboard/components/CountrySelect"
import StateSelect from "../dashboard/components/StateSelect"
import { getCountries } from "@/services/CountryService"

const BarbersPage = () => {
  const [countryId, setCountryId] = useState<undefined | number>()
  const [stateId, setStateId] = useState<undefined | number>()
  const [city, setCity] = useState<undefined | number>()
  const [order, setOrder] = useState("ASC")
  const { currentPage, totalPages, handlePageChange, setTotalPages } =
    usePaginationBarbers()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["barbers"],
    queryFn: () => getBarbers({ page: currentPage, city: city, order: order }),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,

  })

  const { data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
  })

  useEffect(() => {
    if (data) {
      setTotalPages(data.data.total_pages)
    }
  }, [])
  useEffect(() => {
    refetch()
  }, [city])

  return (
    <main className="flex flex-col items-center justify-center gap-4 w-full h-full">
      <section className="flex flex-col w-full gap-8 p-4 bg-gray-main">
        <h1 className="text-3xl font-semibold text-center">Barberías</h1>
        <div className="flex flex-col gap-4 w-full ">
          <div className="flex flex-wrap justify-center md:justify-start items-end gap-4 w-full">
            <div className="flex flex-col  gap-2 min-w-60">
              <Label>Pais</Label>
              {countries ? (
                <CountrySelect
                  countries={countries?.data}
                  onChange={(id: number) => setCountryId(id)}
                />
              ) : (
                <span className="text-sm text-red-600">
                  Algo salio mal en la busqueda del listado de los paises
                </span>
              )}
            </div>

            {countryId && (
              <div className="flex flex-col gap-2 min-w-60">
                <Label>Estado / provincia</Label>
                <StateSelect
                  countryId={countryId}
                  onChange={(state: number) => setStateId(state)}
                />
              </div>
            )}

            {stateId && (
              <div className="flex flex-col gap-2 min-w-60">
                <Label>Ciudad</Label>
                <CitySelect
                  stateId={stateId}
                  onChange={(city: number) => setCity(city)}
                />
              </div>
            )}
            <Button
              variant="ghost"
              onClick={() => {
                if (order === "ASC") return setOrder("DESC")
                setOrder("ASC")
              }}
            >
              {order === "ASC" ? (
                <>
                  <p>Ascendente </p>
                  <Icon icon="formkit:arrowup" width="9" height="16" />
                </>
              ) : (
                <>
                  <p>Descendente </p>
                  <Icon
                    className="rotate-180"
                    icon="formkit:arrowup"
                    width="9"
                    height="16"
                  />
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 place-items-center w-full py-4">
        {data?.data.results.map((barber: BarberGet) => (
          <Card key={barber.id} barber={barber} />
        ))}
      </section>

      <section className="flex items-center justify-center">
        <PaginationBarbers
          currentPage={currentPage!}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          disabled={isLoading}
        />
      </section>
    </main>
  )
}
export default BarbersPage
