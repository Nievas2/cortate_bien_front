import { Icon } from "@iconify/react/dist/iconify.js"
import { Link, NavLink, useLocation } from "react-router-dom"

import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import { useAuthContext } from "@/contexts/authContext"
import { useLogout } from "@/hooks/useLogout"
import { GoToTop } from "@/utils/toUp"

const Navbar = () => {
  const { logOut } = useLogout()
  const { authUser } = useAuthContext()
  const [open, setOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const { pathname } = useLocation()
  useEffect(() => {
    // Deshabilitar scroll al abrir el modal
    if (cartOpen || open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    // Limpiar estilo al desmontar el componente
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [cartOpen, open])
  return (
    <nav
      className={`sticky w-full top-0 z-50 transition-colors duration-200 ${
        pathname == "/" ? "bg-gray-main" : "bg-white"
      }`}
    >
      <div className="mx-auto max-w-7xl p-4 2xl:pl-0">
        <div className="relative flex h-10 items-center gap-10">
          <div className="flex items-center justify-between w-full">
            {/* mobile buttons */}
            <div className="items-center md:hidden">
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md text-white hover:bg-gray-main/80 hover:text-black-main focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
              </button>
            </div>

            <Link
              className={`flex flex-shrink-0 items-end justify-end gap-3 ${
                authUser === null ? "-ml-[21px] md:ml-0" : ""
              }`}
              to="/"
              onClick={GoToTop}
              aria-label="Home"
            >
              {/* <img className="size-14 ml-6 md:size-16" src="/logo.webp" alt="Logo" /> */}
              Logo
            </Link>

            <div className={`items-center flex justify-end gap-6`}>
              {/* Navlinks */}
              <div className="hidden md:ml-6 md:flex md:flex-1">
                <div className="flex w-full items-center justify-end text-center flex-row gap-2 ">
                  <NavLink
                    onClick={GoToTop}
                    to="/"
                    className={`rounded-md px-3 py-2 text-sm font-medium relative group hover:text-yellow-main transition-all duration-300 ${
                      pathname === "/" ? "text-yellow-main" : "text-black-main"
                    }`}
                  >
                    Inicio
                    <span
                      className={`h-[2.5px] inline-block bg-yellow-main absolute left-1/2 -translate-x-1/2 bottom-[1px] transition-[width] ease duration-[400ms] ${
                        pathname === "/" ? "w-[80%]" : "w-0"
                      }`}
                    >
                      &nbsp;
                    </span>
                  </NavLink>

                  {/* Cart button desktop */}
                  {authUser != null ? (
                    <div>
                      <button
                        type="button"
                        className="px-3 py-2 inline-flex items-center justify-center rounded-md text-black-main hover:bg-gray-main/80 hover:text-black-main focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        aria-controls="mobile-menu"
                        aria-expanded={cartOpen}
                        onClick={() => setCartOpen(!cartOpen)}
                      >
                        <span className="sr-only">Open main menu</span>

                        {/* Open */}
                        <Icon icon="mdi:cart" width="24" height="24" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Link
                        to="/auth/iniciar-sesion"
                        onClick={GoToTop}
                        className="relative group"
                      >
                        <Button variant="auth" className="">
                          Iniciar sesion
                        </Button>
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-main to-blue-main rounded-lg blur-md opacity-0 group-hover:opacity-60 transition duration-200 group-hover:duration-200" />
                      </Link>

                      <Link to="/auth/registrarse" onClick={GoToTop}>
                        <Button variant="auth">Registrarse</Button>
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
          className={`fixed inset-0 bg-black bg-opacity-50 flex justify-start z-50 md:hidden transition-all duration-300 ${
            open ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setOpen(!open)}
        >
          <div
            className={`bg-black-main w-[280px] h-full p-6 flex flex-col gap-6 transition-all duration-300 ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-row items-center justify-end">
              <button
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
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-base font-medium ${
                    isActive
                      ? "bg-blue-main/50 text-white"
                      : "text-white hover:bg-gray-main/80 hover:text-white"
                  } transition-colors duration-300`
                }
                onClick={() => {
                  GoToTop()
                  setOpen(false)
                }}
              >
                Inicio
              </NavLink>

              <NavLink
                to="/test"
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-base font-medium ${
                    isActive
                      ? "bg-blue-main/50 text-white"
                      : "text-white hover:bg-gray-main/80 hover:text-white"
                  } transition-colors duration-300`
                }
                onClick={() => {
                  GoToTop()
                  setOpen(false)
                }}
              >
                test
              </NavLink>

              {authUser?.user.role == "admin" && (
                <NavLink
                  to="admin"
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2 text-base font-medium ${
                      isActive
                        ? "bg-gray-main text-black-main"
                        : "text-black-main hover:bg-gray-main/80 hover:text-black-main"
                    } transition-colors duration-300`
                  }
                  onClick={() => {
                    GoToTop()
                    setOpen(false)
                  }}
                >
                  Administracion
                </NavLink>
              )}

              {authUser ? (
                <Button variant="auth" onClick={logOut}>
                  Cerrar sesion
                </Button>
              ) : (
                <div className="flex flex-col w-full gap-4">
                  <Link
                    to="/auth/iniciar-sesion"
                    className="w-full"
                    onClick={GoToTop}
                  >
                    <Button variant="auth" className="w-full">
                      Iniciar sesion
                    </Button>
                  </Link>

                  <Link
                    to="/auth/registrarse"
                    className="w-full"
                    onClick={GoToTop}
                  >
                    <Button variant="auth" className="w-full">
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
