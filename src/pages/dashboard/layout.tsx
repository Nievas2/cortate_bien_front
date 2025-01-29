import { Button } from "@/components/ui/button"
import SideBar from "./components/SideBar"
import { useEffect, useState } from "react"
import { Icon } from "@iconify/react/dist/iconify.js"
import { getBarberById } from "@/services/BarberService"
import { useLocation } from "react-router-dom"

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [barbery, setBarbery] = useState()
  const [open, setOpen] = useState(true)
  const { search } = useLocation()
  const id = search.split("=")[1]

  async function getBarbery() {
    try {
      const res = await getBarberById(id)
      setBarbery(res.data)
      return res
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    getBarbery()
  }, [])

  return (
    <div className="flex relative w-full">
 
        <SideBar open={open} setOpen={setOpen} barber={barbery} />
 
      <div className="relative">
        <Button
           className={` rounded-full border border-blue-main transition-transform duration-150 size-12 hover:bg-blue-main hover:text-white z-40 ${
            open
              ? "rotate-180 translate-x-2 sm:-translate-x-14 translate-y-2 fixed top-20 "
              : "rotate-0 translate-y-2 translate-x-2 sm:translate-x-2 fixed sm:sticky top-20"
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
