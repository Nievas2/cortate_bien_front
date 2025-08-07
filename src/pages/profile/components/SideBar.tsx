import { Button } from "@/components/ui/button"
import { useLogout } from "@/hooks/useLogout"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Link, useLocation } from "react-router-dom"

interface SideBarProps {
  open: boolean
  isMobile?: boolean
}

const SideBar = ({ open, isMobile = false }: SideBarProps) => {
  const { pathname, search } = useLocation()
  const { logOut } = useLogout()

  const navigation = [
    {
      name: "Información personal",
      icon: "tabler:user",
      href: `/profile`,
    },
    {
      name: "Mis Turnos",
      icon: "tabler:calendar-check",
      href: `/profile/appointments`,
    },
    {
      name: "Mis reseñas",
      icon: "tabler:star",
      href: `/profile/reviews`,
    },
  ]

  return (
    <aside
      className={`
        fixed  left-0 h-screen z-40
        bg-gray-900/95 backdrop-blur-md border-r border-white/10
        transition-all duration-300 ease-in-out
        ${open ? 'translate-x-0 w-[280px]' : '-translate-x-full w-0'}
        ${isMobile ? 'shadow-2xl' : ''}
      `}
    >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
            <Icon
              className="text-white"
              icon="tabler:user-circle"
              width="24"
              height="24"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-white text-lg">Mi Perfil</span>
            <span className="text-xs text-gray-400">Gestiona tu cuenta</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
            Navegación
          </div>
          
          {navigation.map((item) => {
            const isActive = pathname + search === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium 
                  transition-all duration-200 hover:scale-[1.02]
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <div className={`
                  p-1.5 rounded-lg transition-colors
                  ${isActive ? 'bg-white/20' : 'bg-white/10'}
                `}>
                  <Icon icon={item.icon} height={18} width={18} />
                </div>
                <span className="truncate">{item.name}</span>
                
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white/80" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          <Button
            className="
              w-full justify-start gap-3 text-red-400 hover:text-red-300 
              hover:bg-red-500/10 rounded-xl transition-all duration-200
            "
            variant="ghost"
            onClick={logOut}
          >
            <div className="p-1.5 rounded-lg bg-red-500/20">
              <Icon icon="tabler:logout" width={18} height={18} />
            </div>
            <span>Cerrar sesión</span>
          </Button>
        </div>
      </div>
    </aside>
  )
}

export default SideBar