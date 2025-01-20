import { Button } from "@/components/ui/button"
import { useLogout } from "@/hooks/useLogout"
import { Barber } from "@/interfaces/Barber"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Link, useLocation } from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ChangeBarberShopDialog } from "./ChangeBarberShop"

const SideBar = ({
  open,
  barber,
}: {
  open: boolean
  setOpen: Function
  barber?: Barber
}) => {
  const { pathname, search } = useLocation()
  const { logOut } = useLogout()

  const navigation = [
    { name: "Todas las barberia", icon: "tabler:home", href: `/dashboard` },
    {
      name: "Panel de control",
      icon: "tabler:dashboard",
      href: `/dashboard/barber?id=${barber?.id}`,
    },
    {
      name: "Turnos",
      icon: "tabler:calendar-event",
      href: `/dashboard/barber/appointments?id=${barber?.id}`,
    },
    {
      name: "Reseñas",
      icon: "tabler:star",
      href: `/dashboard/barber/reviews?id=${barber?.id}`,
    },
  ]
  console.log(pathname)

  return (
    <aside
      className={`bg-black-main h-full flex flex-col gap-2 transition-all duration-300 absolute z-50 sm:sticky ${
        open ? "-left-0 w-[260px] border-r border-r-gray-800" : "-left-full w-0"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-end sm:justify-start gap-2 px-6 py-4 ${
          open ? "flex" : "hidden"
        }`}
      >
        <Icon
          icon="radix-icons:scissors"
          height={30}
          width={30}
          color="white"
        />
        <span className="font-semibold">Cortate bien</span>
      </div>

      <div
        className={`${
          open
            ? "flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-white after:mt-0.5 after:flex-1 after:border-t after:border-white"
            : "hidden"
        }`}
      >
        <p className="mx-1 mb-0 text-center text-xs">Páginas</p>
      </div>

      {/* Navigation */}
      <nav
        className={`${open ? "flex flex-col" : "hidden"} flex-1 space-y-1 px-3`}
      >
        {navigation.map((item) => {
          const isActive = pathname + search === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                  group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }
                `}
            >
              <Icon icon={item.icon} height={20} width={20} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
      <div
        className={`${
          open
            ? "flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-white after:mt-0.5 after:flex-1 after:border-t after:border-white"
            : "hidden"
        }`}
      >
        <p className="mx-1 mb-0 text-center text-xs">{barber?.nombre}</p>
      </div>
      {/* Footer */}
      {barber != undefined && (
        <div
          className={`${
            open ? "flex flex-col w-full gap-2" : "hidden"
          } p-2  px-3`}
        >
          <Dialog>
            <DialogTrigger>
              <Button
                className="flex justify-start px-0"
                variant="ghost"
                size="sm"
              >
                <Icon icon="tabler:edit" width={20} height={20} /> Editar
                barberia
              </Button>
            </DialogTrigger>
            <DialogContent forceMount>
              <DialogHeader>
                <DialogTitle>Agregar una barberia</DialogTitle>
              </DialogHeader>
              <ChangeBarberShopDialog barber={barber} />
            </DialogContent>
          </Dialog>

          <Button
            className="flex justify-start px-0 text-red-500"
            variant="ghost"
            size="sm"
            onClick={logOut}
          >
            <Icon icon="tabler:logout" width={20} height={20} /> Cerrar sesion
          </Button>
        </div>
      )}
    </aside>
  )
}
export default SideBar
