import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useState } from "react"
import SideBarAdmins from "./components/SideBarAdmins"

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(true)

  return (
    <div className="flex relative w-full">
      <SideBarAdmins open={open} />

      <div className="relative">
        <Button
          className={`z-40 transition-transform duration-300 ${
            open
              ? "rotate-180 translate-x-2  translate-y-2 fixed sm:sticky top-20"
              : "rotate-0 translate-y-2 translate-x-2 sm:translate-x-2 fixed sm:sticky top-20"
          }`}
          variant="secondary"
          size="rounded"
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
