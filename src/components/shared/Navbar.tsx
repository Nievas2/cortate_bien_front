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
    <nav className="sticky w-full top-0 z-50 transition-colors duration-200 bg-gray-main border-b border-gray-800">
      <div className="mx-auto max-w-8xl p-4 2xl:pl-0">
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
                  <NavbarItemDestock
                    location="/"
                    pathname={pathname}
                    name="Inicio"
                  />

                  {/* User session */}
                  {authUser != null ? (
                    <Button
                      variant="auth"
                      onClick={logOut}
                      className="relative group"
                    >
                      Cerrar sesion
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-secondary to-blue-secondary rounded-lg blur-md opacity-0 group-hover:opacity-60 transition duration-200 group-hover:duration-200" />
                    </Button>
                  ) : (
                    <>
                      <Link
                        to="/auth/iniciar-sesion"
                        onClick={GoToTop}
                        className="relative group"
                      >
                        <Button variant="auth">Iniciar sesion</Button>
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-secondary to-blue-secondary rounded-lg blur-md opacity-0 group-hover:opacity-60 transition duration-200 group-hover:duration-200" />
                      </Link>

                      <Link
                        to="/auth/registrarse"
                        onClick={GoToTop}
                        className="relative group"
                      >
                        <Button variant="auth">Registrarse</Button>
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-secondary to-blue-secondary rounded-lg blur-md opacity-0 group-hover:opacity-60 transition duration-200 group-hover:duration-200" />
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

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <NavbarItemMobile
                  name="Inicio"
                  location="/"
                  pathname={pathname}
                  setOpen={setOpen}
                />

                <NavbarItemMobile
                  name="test"
                  location="/test"
                  pathname={pathname}
                  setOpen={setOpen}
                />
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

function NavbarItemDestock({
  location,
  pathname,
  name,
}: {
  location: string
  pathname: string
  name: string
}) {
  return (
    <NavLink
      onClick={GoToTop}
      to={location}
      className={`rounded-md px-3 py-[6px] text-sm font-medium relative group hover:text-blue-main transition-all duration-300 text-white
  
      `}
    >
      {name}
      <span
        className={`h-[2.5px] inline-block bg-blue-secondary absolute left-1/2 -translate-x-1/2 bottom-[1px] transition-[width] ease duration-300 ${
          pathname === location ? "w-[80%]" : "w-0"
        }`}
      >
        &nbsp;
      </span>
    </NavLink>
  )
}

function NavbarItemMobile({
  location,
  pathname,
  name,
  setOpen,
}: {
  location: string
  pathname: string
  name: string
  setOpen: Function
}) {
  return (
    <NavLink
      to={location}
      className={`block rounded-md px-3 py-2 text-base font-medium ${
        location === pathname
          ? "bg-blue-secondary/50 text-white"
          : "text-white border border-gray-main"
      } transition-colors duration-300`}
      onClick={() => {
        GoToTop()
        setOpen(false)
      }}
    >
      {name}
    </NavLink>
  )
}
