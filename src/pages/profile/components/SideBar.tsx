import { Button } from "@/components/ui/button"
import { useLogout } from "@/hooks/useLogout"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Link, useLocation } from "react-router-dom"

const SideBar = ({ open }: { open: boolean }) => {
  const { pathname, search } = useLocation()
  const { logOut } = useLogout()

  const navigation = [
    {
      name: "Información personal",
      icon: "tabler:home",
      href: `/profile`,
    },
    {
      name: "Mis Turnos",
      icon: "lsicon:work-order-appointment-filled",
      href: `/profile/appointments`,
    },
    {
      name: "Mis reseñas",
      icon: "material-symbols:star",
      href: `/profile/reviews`,
    },
  ]

  return (
    <aside
      className={`bg-gray-800/50 min-h-screen h-full transition-all duration-300 absolute top-0 z-40 sm:sticky sm:top-0  ${
        open ? "-left-0 w-[260px] sm:w-[420px]" : "-left-full w-0"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-2 sticky top-20 w-full h-full">
        {/* Header */}
        <div
          className={`flex items-center justify-end sm:justify-start gap-2 px-6 py-4 ${
            open ? "flex" : "hidden"
          }`}
        >
          <Icon
            className="text-white"
            icon="iconamoon:profile-fill"
            width="30"
            height="30"
          />
          <span className="font-semibold">Mi perfil</span>
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
          className={`${open ? "flex flex-col" : "hidden"} h-full gap-y-1 px-3`}
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
        </div>
        {/* Footer */}

        <div
          className={`${
            open ? "flex flex-col w-full gap-2" : "hidden"
          } p-2  px-3`}
        >
          <Button
            className="flex justify-start px-0 text-red-500"
            variant="ghost"
            size="sm"
            onClick={logOut}
          >
            <Icon icon="tabler:logout" width={20} height={20} /> Cerrar sesion
          </Button>
        </div>
      </div>
    </aside>
  )
}
export default SideBar
