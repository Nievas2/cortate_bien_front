import { Icon } from "@iconify/react/dist/iconify.js"
import { Link, useLocation } from "react-router-dom"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import { useAuthContext } from "@/contexts/authContext"
import { useLogout } from "@/hooks/useLogout"
import { GoToTop } from "@/utils/toUp"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NavbarItemDestock, NavbarItemMobile } from "./navbar/NavbarItems"
import Notifications from "./navbar/Notifications"

const Navbar = () => {
  const { logOut } = useLogout()
  const { authUser } = useAuthContext()
  const [open, setOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const handleDropdownClick = () => {
    setIsDropdownOpen(false)
  }

  const { pathname } = useLocation()

  // Efecto de fondo al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Bloquear scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [open])

  return (
    <nav
      className={`sticky w-full top-0 z-[200] transition-all duration-300 ease-in-out border-b ${
        isScrolled
          ? "bg-slate-950/80 backdrop-blur-lg border-white/5 shadow-lg shadow-black/10"
          : "bg-transparent border-transparent" // Empieza transparente
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-20 items-center justify-between"> {/* Altura aumentada a 80px */}

          {/* Botón Menú Móvil (Izquierda) */}
          <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
            <Button
              variant="ghost"
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <span className="sr-only">Abrir menú principal</span>
              <Icon
                className="block h-6 w-6"
                icon={open ? "heroicons:x-mark-20-solid" : "heroicons:bars-3-20-solid"}
              />
            </Button>
          </div>

          {/* Logo (Centro en Móvil, Izquierda en Escritorio) */}
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <Link
              className="flex flex-shrink-0 items-center"
              to="/"
              onClick={GoToTop}
              aria-label="Home"
            >
              <img
                className="h-14 w-auto" // Tamaño del logo ajustado
                src="/logo.png"
                alt="Logo Cortate Bien"
              />
            </Link>

            {/* Enlaces Escritorio (Ocultos en Móvil) */}
            <div className="hidden md:ml-10 md:flex md:items-center md:space-x-4">
              {authUser === null && (
                <NavbarItemDestock location="/" pathname={pathname} name="Inicio" />
              )}
              <NavbarItemDestock location="/barbers" pathname={pathname} name="Barberías" />
              {authUser?.user.tipo_de_cuenta === "BARBERO" && (
                <NavbarItemDestock location="/prices" pathname={pathname} name="Precios" />
              )}
              {authUser?.user.tipo_de_cuenta === "BARBERO" && (
                <NavbarItemDestock location="/dashboard" pathname={pathname} name="Dashboard" />
              )}
              {authUser?.user.rol === "ADMIN" && (
                <NavbarItemDestock location="/admins/dashboard" pathname={pathname} name="Admins" />
              )}
            </div>
          </div>

          {/* Sección Derecha (Notificaciones y Auth - Oculto en Móvil) */}
          <div className="hidden md:flex items-center gap-4">
            {authUser?.user && <Notifications />}

            {authUser ? (
              // Usuario Logueado
              authUser.user.tipo_de_cuenta === "CLIENTE" ? (
                <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                  <DropdownMenuTrigger className="focus:outline-none rounded-full ring-2 ring-transparent hover:ring-blue-500/50 transition-all">
                    <Icon className="h-10 w-10 text-gray-400 hover:text-white" icon="carbon:user-avatar-filled" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-900 border border-slate-800 w-56 text-white mt-2 rounded-lg shadow-xl">
                    <DropdownMenuLabel className="text-gray-400 px-3 py-2">Mi cuenta</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <Link to="/profile" onClick={handleDropdownClick}>
                      <DropdownMenuItem className="flex gap-3 items-center hover:bg-slate-800 hover:text-blue-400 cursor-pointer px-3 py-2">
                        <Icon icon="heroicons:user-circle" className="w-5 h-5" />
                        <span>Mi perfil</span>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      className="flex gap-3 items-center text-red-400 hover:bg-red-900/50 hover:text-red-300 cursor-pointer px-3 py-2 focus:bg-red-900/50 focus:text-red-300"
                      onClick={() => { logOut(); handleDropdownClick(); }}
                    >
                      <Icon icon="heroicons:arrow-left-on-rectangle" className="w-5 h-5" />
                      <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : ( // Barbero o Admin (Botón simple de Logout)
                <Button variant="simple" onClick={logOut} className="text-gray-300 hover:text-red-400 hover:bg-red-900/20">
                  Cerrar sesión
                </Button>
              )
            ) : (
              // Usuario No Logueado
              <>
                <Link to="/auth/iniciar-sesion" onClick={GoToTop}>
                  <Button variant="simple" className="border-2 border-gray-600 hover:border-blue-400 hover:bg-blue-400/10 text-white px-6 py-2">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link to="/auth/registrarse" onClick={GoToTop}>
                  <Button variant="secondary" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Notificaciones Móvil (Derecha) */}
          {authUser?.user && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 md:hidden">
              <Notifications />
            </div>
          )}

        </div>
      </div>

      {/* Panel Menú Móvil */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 w-72 h-full bg-slate-950 shadow-2xl z-50 p-6 flex flex-col gap-6 transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <img src="/logo.png" alt="logo" className="h-10 w-auto" />
          <Button variant="ghost" type="button" onClick={() => setOpen(false)} className="text-gray-400 hover:text-white -mr-2">
            <Icon icon="heroicons:x-mark-20-solid" width="24" />
          </Button>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          {authUser === null && <NavbarItemMobile name="Inicio" location="/" pathname={pathname} setOpen={setOpen} />}
          <NavbarItemMobile name="Barberías" location="/barbers" pathname={pathname} setOpen={setOpen} />
          {authUser?.user.tipo_de_cuenta === "BARBERO" && <NavbarItemMobile name="Precios" location="/prices" pathname={pathname} setOpen={setOpen} />}
          {authUser?.user.tipo_de_cuenta === "CLIENTE" && <NavbarItemMobile name="Mi perfil" location="/profile" pathname={pathname} setOpen={setOpen} />}
          {authUser?.user.tipo_de_cuenta === "BARBERO" && <NavbarItemMobile name="Dashboard" location="/dashboard" pathname={pathname} setOpen={setOpen} />}
          {authUser?.user.rol === "ADMIN" && <NavbarItemMobile name="Admin dashboard" location="/admins/dashboard" pathname={pathname} setOpen={setOpen} />}
        </div>

        <div className="border-t border-slate-800 pt-6">
          {authUser ? (
            <Button variant="simple" onClick={() => { logOut(); setOpen(false); }} className="w-full text-red-400 hover:bg-red-900/30 justify-center">
              Cerrar sesión
            </Button>
          ) : (
            <div className="flex flex-col w-full gap-4">
              <Link to="/auth/iniciar-sesion" className="w-full" onClick={() => setOpen(false)}>
                <Button variant="simple" className="w-full border border-gray-600 hover:border-blue-400">
                  Iniciar sesión
                </Button>
              </Link>
              <Link to="/auth/registrarse" className="w-full" onClick={() => setOpen(false)}>
                <Button variant="secondary" className="w-full bg-gradient-to-r from-blue-600 to-blue-500">
                  Registrarse
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar