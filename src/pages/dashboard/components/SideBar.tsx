import { Icon } from "@iconify/react/dist/iconify.js"
import { Link, useLocation } from "react-router-dom"

const navigation = [
  { name: "Panel de control", icon: "tabler:home", href: "/dashboard" },
  {
    name: "Turnos",
    icon: "tabler:calendar-event",
    href: "/dashboard/appointments",
  },
  { name: "Reseñas", icon: "tabler:star", href: "/dashboard/reviews" },
]

const SideBar = ({ open }: { open: boolean; setOpen: Function }) => {
  const pathname = useLocation()
  return (
    <aside
      className={`bg-black-main h-full p-2 flex flex-col gap-2 transition-all duration-300 absolute z-50 sm:sticky ${
        open ? "-left-0 w-[320px] border-r border-r-gray-800" : "-left-full w-0"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-end sm:justify-start gap-2 p-4 ${
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

      {/* Navigation */}
      <nav
        className={`${open ? "flex flex-col" : "hidden"} flex-1 space-y-1 px-3`}
      >
        {navigation.map((item) => {
          const isActive = pathname.pathname === item.href
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

      {/* Footer */}
      <div className={`${open ? "flex" : "hidden"} p-4`}></div>
    </aside>
  )
}
export default SideBar
