import { Button } from "@/components/ui/button"
import SideBar from "./components/SideBar"
import { useState } from "react"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useQuery } from "@tanstack/react-query"
import { getBarberById } from "@/services/BarberService"
import { useLocation } from "react-router-dom"

const Layout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  
  const [open, setOpen] = useState(true)
  const { search } = useLocation()
  const id = search.split("=")[1]



  const { data } = useQuery({
    queryKey: ["getbarberbyid"],
    queryFn: () => getBarberById(id),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
  })
  console.log(data?.data);
  

  return (
    <div className="flex relative w-full">
      <div>
        <SideBar open={open} setOpen={setOpen} barber={data?.data} />
      </div>
      <div className="relative">
        <Button
          className={` rounded-full border border-blue-main transition-transform duration-150 size-12 hover:bg-blue-main hover:text-white ${
            open
              ? "rotate-180 translate-x-2 sm:-translate-x-14 translate-y-2 absolute z-50 sm:absolute"
              : "rotate-0 translate-y-2 translate-x-2 sm:translate-x-2 absolute z-50 sm:sticky"
          }`}
          variant="ghost"
          size="sm"
          onClick={() => setOpen(!open)}
        >
          <Icon icon="tabler:chevron-right" height={20} width={20} />
        </Button>
      </div>

      <section className="flex items-center justify-center w-full">
        {children}
      </section>
    </div>
  )
}
export default Layout
