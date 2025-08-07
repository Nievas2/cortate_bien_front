import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import { AuthUser } from "@/contexts/authContext";
import { GoToTop } from "@/utils/toUp";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavbarItemDestock } from "./NavbarItems";
import Notifications from "./Notifications";
import { Button } from "@/components/ui/button";

interface DesktopNavbarProps {
  authUser: AuthUser | null;
  logOut: () => void;
  pathname: string;
  isScrolled: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  handleDropdownClick: () => void;
}
export const DesktopNavbar = ({
  authUser,
  logOut,
  pathname,
  isScrolled,
  isDropdownOpen,
  setIsDropdownOpen,
  handleDropdownClick,
}: DesktopNavbarProps) => (
  <nav
    className={`hidden md:block sticky w-full top-0 z-[200] transition-all duration-300 ease-in-out border-b ${
      isScrolled
        ? "bg-slate-950/80 backdrop-blur-lg border-white/5 shadow-lg shadow-black/10"
        : "bg-slate-950/20 backdrop-blur-sm border-white/5"
    }`}
  >
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative flex h-20 items-center justify-between">
        {/* Logo */}
        <div className="flex flex-1 items-center justify-start">
          <Link
            className="flex flex-shrink-0 items-center"
            to="/"
            onClick={GoToTop}
            aria-label="Home"
          >
            <img
              className="h-14 w-auto"
              src="/logo.png"
              alt="Logo Cortate Bien"
            />
          </Link>

          {/* Enlaces Desktop */}
          <div className="ml-10 flex items-center space-x-4">
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
              name="Barberías"
            />
            {authUser?.user.tipo_de_cuenta === "BARBERO" && (
              <NavbarItemDestock
                location="/prices"
                pathname={pathname}
                name="Precios"
              />
            )}
            {authUser?.user.tipo_de_cuenta === "BARBERO" && (
              <NavbarItemDestock
                location="/dashboard"
                pathname={pathname}
                name="Dashboard"
              />
            )}
            {authUser !== null && (
              <NavbarItemDestock
                location="/chats"
                pathname={pathname}
                name="Chats"
              />
            )}
            {authUser?.user.rol === "ADMIN" && (
              <NavbarItemDestock
                location="/admins/dashboard"
                pathname={pathname}
                name="Admins"
              />
            )}
          </div>
        </div>

        {/* Sección Derecha */}
        <div className="flex items-center gap-4">
          {authUser?.user && <Notifications />}

          {authUser ? (
            authUser.user.tipo_de_cuenta === "CLIENTE" ? (
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >
                <DropdownMenuTrigger className="focus:outline-none rounded-full ring-2 ring-transparent hover:ring-blue-500/50 transition-all">
                  <Icon
                    className="h-10 w-10 text-gray-400 hover:text-white"
                    icon="carbon:user-avatar-filled"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-900 border border-slate-800 w-56 text-white mt-2 rounded-lg shadow-xl">
                  <DropdownMenuLabel className="text-gray-400 px-3 py-2">
                    Mi cuenta
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <Link to="/profile" onClick={handleDropdownClick}>
                    <DropdownMenuItem className="flex gap-3 items-center hover:bg-slate-800 hover:text-blue-400 cursor-pointer px-3 py-2">
                      <Icon icon="heroicons:user-circle" className="w-5 h-5" />
                      <span>Mi perfil</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    className="flex gap-3 items-center text-red-400 hover:bg-red-900/50 hover:text-red-300 cursor-pointer px-3 py-2 focus:bg-red-900/50 focus:text-red-300"
                    onClick={() => {
                      logOut();
                      handleDropdownClick();
                    }}
                  >
                    <Icon
                      icon="heroicons:arrow-left-on-rectangle"
                      className="w-5 h-5"
                    />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/profile" onClick={GoToTop}>
                  <Icon
                    className="h-10 w-10 text-gray-400 hover:text-white"
                    icon="carbon:user-avatar-filled"
                  />
                </Link>
                <Button
                  variant="simple"
                  onClick={logOut}
                  className="text-gray-300 hover:text-red-400 hover:bg-red-900/20"
                >
                  Cerrar sesión
                </Button>
              </>
            )
          ) : (
            <>
              <Link to="/auth/iniciar-sesion" onClick={GoToTop}>
                <Button
                  variant="simple"
                  className="border-2 border-gray-600 hover:border-blue-400 hover:bg-blue-400/10 text-white px-6 py-2"
                >
                  Iniciar sesión
                </Button>
              </Link>
              <Link to="/auth/registrarse" onClick={GoToTop}>
                <Button
                  variant="secondary"
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
                >
                  Registrarse
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  </nav>
);
