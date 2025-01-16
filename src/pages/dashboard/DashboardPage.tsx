import { Button } from "@/components/ui/button"
import SideBar from "./components/SideBar"
import { useState } from "react"
import { Icon } from "@iconify/react/dist/iconify.js"
import AddBarberShop from "./components/AddBarberShop"

const DashboardPage = () => {
  const [open, setOpen] = useState(true)
  return (
    <div className="flex relative w-full">
      <div>
        <SideBar open={open} setOpen={setOpen} />
      </div>
      <div className="relative">
        <Button
          className={`absolute  rounded-full border border-blue-main transition-transform duration-150 size-12 hover:bg-blue-main hover:text-white ${
            open
              ? "rotate-180 -translate-x-16 translate-y-2"
              : "rotate-0 translate-y-2 translate-x-2"
          }`}
          variant="ghost"
          size="sm"
          onClick={() => setOpen(!open)}
        >
          <Icon icon="tabler:chevron-right" height={20} width={20} />
        </Button>
      </div>

      <section className="flex items-center justify-center w-full">
        <AddBarberShop />
      </section>
    </div>
  )
}
export default DashboardPage
