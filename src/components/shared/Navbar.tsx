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

  const handleDropdownClick = () => {
    setIsDropdownOpen(false)
  }

  const { pathname } = useLocation()
  useEffect(() => {
    // Deshabilitar scroll al abrir el modal
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    // Limpiar estilo al desmontar el componente
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [open])
  return (
    <nav
      className="sticky w-full top-0 z-[200] transition-colors duration-200 bg-gray-main"
      style={{ boxShadow: "0 1px 10px #141414" }}
    >
      <div className="mx-auto max-w-8xl p-4 2xl:pl-0">
        <div className="relative flex h-10 items-center gap-10">
          <div className="flex items-center justify-between w-full relative">
            {/* mobile buttons */}
            <div className="absolute md:hidden">
              <Button
                variant="ghost"
                type="button"
                className="relative inline-flex items-center justify-center rounded-md text-white focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
              >
                <span className="sr-only">Open main menu</span>

                {/* Open */}
                <Icon
                  className={`${open ? "block" : "block ml-[-3px]"}`}
                  icon="material-symbols:menu"
                  width="24"
                  height="24"
                />
              </Button>
            </div>

            <Link
              className={`flex shrink-0 items-center md:items-start justify-center md:justify-start gap-3 w-full md:w-fit`}
              to="/"
              onClick={GoToTop}
              aria-label="Home"
            >
              <img className="size-14  md:size-16" src="/logo.png" alt="Logo" />
              {/* Logo */}
            </Link>

            {authUser?.user != null && (
              <div className="absolute right-1.5 md:hidden">
                <Notifications />
              </div>
            )}

            <div className={`items-center flex justify-end gap-6`}>
              {/* Navlinks */}
              <div className="hidden md:ml-6 md:flex md:flex-1">
                <div className="flex w-full items-center justify-end text-center flex-row gap-2 ">
                  {authUser === null && (
                    <NavbarItemDestock
                      location="/"
                      pathname={pathname}
                      name="Inicio"
                    />
                  )}

                  <NavbarItemDestock
                    location="/barbers"
                    pathname={pathname}
                    name="Barberias"
                  />

                  <NavbarItemDestock
                    location="/prices"
                    pathname={pathname}
                    name="Precios"
                  />

                  {authUser != null &&
                    authUser?.user.tipo_de_cuenta === "BARBERO" && (
                      <NavbarItemDestock
                        location="/dashboard"
                        pathname={pathname}
                        name="Dashboard"
                      />
                    )}

                  {authUser?.user.rol === "ADMIN" && (
                    <NavbarItemDestock
                      location="/admins/dashboard"
                      pathname={pathname}
                      name="Admins"
                    />
                  )}

                  {authUser?.user.tipo_de_cuenta == "BARBERO" &&
                    pathname.slice(0, 10) === "/dashboard" && <Notifications />}

                  {authUser?.user.tipo_de_cuenta == "CLIENTE" && (
                    <Notifications />
                  )}

                  {/* User session */}
                  {authUser != null ? (
                    <>
                      {authUser?.user.rol === "USER" ? (
                        <DropdownMenu
                          open={isDropdownOpen}
                          onOpenChange={setIsDropdownOpen}
                        >
                          <DropdownMenuTrigger>
                            <Icon
                              className="h-12 w-12 cursor-pointer"
                              icon="carbon:user-avatar-filled"
                            />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-black-main w-[288px]">
                            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link to="/profile" onClick={handleDropdownClick}>
                              <DropdownMenuItem className="flex gap-2 items-center hover:text-blue-main cursor-pointer">
                                <Icon icon="material-symbols:person" />
                                Mi perfil
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem
                              className="hover:text-red-500 text-base cursor-pointer"
                              onClick={logOut}
                            >
                              <button
                                className="flex items-center flex-row gap-2 w-full cursor-pointer"
                                onClick={handleDropdownClick}
                              >
                                <Icon
                                  icon="material-symbols:logout"
                                  width="24"
                                  height="24"
                                />
                                <p>Cerrar sesión</p>
                              </button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Button
                          variant="auth"
                          onClick={logOut}
                          className="relative group"
                        >
                          Cerrar sesion
                          <div className="absolute -inset-1 bg-linear-to-r from-blue-secondary to-blue-secondary rounded-lg blur-md opacity-0 group-hover:opacity-60 transition duration-200 group-hover:duration-200" />
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Link
                        to="/auth/iniciar-sesion"
                        onClick={GoToTop}
                        className="relative group"
                      >
                        <Button variant="auth">Iniciar sesion</Button>
                        <div className="absolute -inset-1 bg-linear-to-r from-blue-secondary to-blue-secondary rounded-lg blur-md opacity-0 group-hover:opacity-60 transition duration-200 group-hover:duration-200" />
                      </Link>

                      <Link
                        to="/auth/registrarse"
                        onClick={GoToTop}
                        className="relative group"
                      >
                        <Button variant="auth">Registrarse</Button>
                        <div className="absolute -inset-1 bg-linear-to-r from-blue-secondary to-blue-secondary rounded-lg blur-md opacity-0 group-hover:opacity-60 transition duration-200 group-hover:duration-200" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state. */}
        <div
          className={`fixed inset-0 bg-black/40 flex justify-start z-50 transition-all duration-300 ${
            open ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setOpen(!open)}
        >
          <div
            className={`bg-black-main w-[280px] border-r border-gray-main h-full p-6 flex flex-col gap-6 transition-all duration-300 ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-row items-center justify-end">
              <Button
                variant="ghost"
                type="button"
                onClick={() => {
                  GoToTop()
                  setOpen(false)
                }}
              >
                <Icon
                  className="text-white"
                  icon="material-symbols:close"
                  width="24"
                  height="24"
                />
              </Button>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                {authUser === null && (
                  <NavbarItemMobile
                    name="Inicio"
                    location="/"
                    pathname={pathname}
                    setOpen={setOpen}
                  />
                )}

                <NavbarItemMobile
                  name="Precios"
                  location="/prices"
                  pathname={pathname}
                  setOpen={setOpen}
                />

                {authUser?.user.rol === "USER" && (
                  <>
                    <NavbarItemMobile
                      name="Barberias"
                      location="/barbers"
                      pathname={pathname}
                      setOpen={setOpen}
                    />

                    <NavbarItemMobile
                      name="Mi perfil"
                      location="/profile"
                      pathname={pathname}
                      setOpen={setOpen}
                    />
                  </>
                )}

                {authUser?.user.tipo_de_cuenta === "BARBERO" && (
                  <NavbarItemMobile
                    name="Dashboard"
                    location="/dashboard"
                    pathname={pathname}
                    setOpen={setOpen}
                  />
                )}

                {authUser?.user.rol === "ADMIN" && (
                  <NavbarItemMobile
                    name="Admin dashboard"
                    location="/admins/dashboard"
                    pathname={pathname}
                    setOpen={setOpen}
                  />
                )}
              </div>

              {authUser ? (
                <Button variant="simple" onClick={logOut}>
                  Cerrar sesion
                </Button>
              ) : (
                <div className="flex flex-col w-full gap-4">
                  <Link
                    to="/auth/iniciar-sesion"
                    className="w-full"
                    onClick={GoToTop}
                  >
                    <Button variant="simple" className="w-full">
                      Iniciar sesion
                    </Button>
                  </Link>

                  <Link
                    to="/auth/registrarse"
                    className="w-full"
                    onClick={GoToTop}
                  >
                    <Button variant="simple" className="w-full">
                      Registrarse
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
