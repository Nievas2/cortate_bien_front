import { BarberGet } from "@/interfaces/Barber"
import { getBarbers } from "@/services/BarberService"
import { useQuery } from "@tanstack/react-query"
import Card from "./components/Card"
import usePaginationBarbers from "@/hooks/barbers/usePaginationBarbers"
import { PaginationBarbers } from "@/components/shared/barbers/PaginationBarbers"
import { useEffect } from "react"

const BarbersPage = () => {
  const { currentPage, totalPages, handlePageChange, setTotalPages } =
    usePaginationBarbers()

  const { data, isLoading } = useQuery({
    queryKey: ["barbers"],
    queryFn: getBarbers,
  })

  useEffect(() => {
    if (data) {
      setTotalPages(data.data.total_pages)
    }
  }, [])

  console.log(data)

  return (
    <main className="flex flex-col items-center justify-center gap-4 w-full py-4">
      <section>
        <h1 className="text-3xl font-semibold text-center">Barberías</h1>
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
