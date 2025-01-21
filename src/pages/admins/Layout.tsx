import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useState } from "react"
import SideBarAdmins from "./components/SideBarAdmins"

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(true)

  return (
    <div className="flex relative w-full">
      <div>
        <SideBarAdmins open={open} />
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
