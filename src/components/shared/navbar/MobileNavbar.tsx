import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import { AuthUser } from "@/contexts/authContext";
import { GoToTop } from "@/utils/toUp";
import { Button } from "@/components/ui/button";
import Notifications from "./Notifications";
import { NavbarItemMobile } from "./NavbarItems";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MobileNavbarProps {
  authUser: AuthUser | null;
  logOut: () => void;
  pathname: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const MobileNavbar = ({ 
  authUser, 
  logOut, 
  pathname, 
  open, 
  setOpen 
}: MobileNavbarProps) => {
  
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Efecto de fondo al hacer scroll (igual que desktop)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
    };

    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll);
    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, []);

  const closeMenu = () => {
    setOpen(false);
  };

  const toggleMenu = () => {
    setOpen(!open);
  };

  return (
    <>
      {/* Barra superior móvil con transparencia dinámica */}
      <nav className={`md:hidden sticky w-full top-0 z-[200] transition-all duration-300 ease-in-out border-b ${
        isScrolled
          ? "bg-slate-950/80 backdrop-blur-lg border-white/5 shadow-lg shadow-black/10"
          : "bg-slate-950/20 backdrop-blur-sm border-white/5"
      }`}>
        <div className="mx-auto px-4">
          <div className="relative flex h-20 items-center justify-between">
            {/* Botón Menú Móvil con animaciones */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                type="button"
                className="group inline-flex items-center justify-center rounded-lg p-3 text-gray-300 hover:bg-slate-800/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200"
                aria-controls="mobile-menu"
                aria-expanded={open}
                onClick={toggleMenu}
              >
                <span className="sr-only">
                  {open ? "Cerrar menú" : "Abrir menú principal"}
                </span>
                <Icon
                  className={`block h-6 w-6 transition-all duration-300 ease-in-out ${
                    open ? "rotate-90 scale-95" : "rotate-0 scale-100"
                  } group-hover:scale-110`}
                  icon={
                    open
                      ? "heroicons:x-mark-20-solid"
                      : "heroicons:bars-3-20-solid"
                  }
                />
              </Button>
            </div>

            {/* Logo con animación hover */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Link
                className="flex flex-shrink-0 items-center group"
                to="/"
                onClick={GoToTop}
                aria-label="Home"
              >
                <img
                  className="h-12 w-auto transition-transform duration-200 group-hover:scale-105"
                  src="/logo.png"
                  alt="Logo Cortate Bien"
                />
              </Link>
            </div>

            {/* Notificaciones con animación */}
            {authUser?.user && (
              <div className="flex items-center transform transition-transform duration-200 hover:scale-105">
                <Notifications />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Overlay y Panel del menú móvil con animaciones mejoradas */}
      <div className={`md:hidden fixed inset-0 z-[300] transition-all duration-300 ease-in-out ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}>
        {/* Overlay de fondo con animación */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 ease-in-out ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMenu}
          aria-hidden="true"
        />
        
        {/* Panel del menú deslizante con animaciones */}
        <div
          className={`absolute top-0 left-0 w-80 h-screen max-h-screen bg-slate-950 shadow-2xl transform transition-all duration-300 ease-out ${
            open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-90"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header del menú con animación */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-gradient-to-r from-slate-950 to-slate-900 flex-shrink-0">
            <div className="transform transition-all duration-200 hover:scale-105">
              <img 
                src="/logo.png" 
                alt="logo" 
                className="h-10 w-auto" 
              />
            </div>
            <Button
              variant="ghost"
              type="button"
              onClick={closeMenu}
              className="group text-gray-400 hover:text-white p-2 rounded-lg hover:bg-slate-800/70 transition-all duration-200"
              aria-label="Cerrar menú"
            >
              <Icon 
                icon="heroicons:x-mark-20-solid" 
                width="24" 
                className="transition-transform duration-200 group-hover:rotate-90"
              />
            </Button>
          </div>

          {/* Contenido del menú */}
          <div className="flex flex-col h-[calc(100%-82px)]">
            {/* Items de navegación con animaciones escalonadas */}
            <div className="flex-1 px-6 py-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
              <div className={`space-y-1 transition-all duration-500 ease-out ${
                open 
                  ? "transform translate-x-0 opacity-100" 
                  : "transform -translate-x-4 opacity-0"
              }`} style={{ transitionDelay: open ? "150ms" : "0ms" }}>
                
                {authUser === null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
                  >
                    <NavbarItemMobile
                      name="Inicio"
                      location="/"
                      pathname={pathname}
                      setOpen={setOpen}
                      icon="heroicons:home-20-solid"
                    />
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
                >
                  <NavbarItemMobile
                    name="Barberías"
                    location="/barbers"
                    pathname={pathname}
                    setOpen={setOpen}
                    icon="mdi:content-cut"
                  />
                </motion.div>

                {authUser?.user.tipo_de_cuenta === "BARBERO" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, ease: "easeOut", delay: 0.15 }}
                  >
                    <NavbarItemMobile
                      name="Precios"
                      location="/prices"
                      pathname={pathname}
                      setOpen={setOpen}
                      icon="heroicons:currency-dollar-20-solid"
                    />
                  </motion.div>
                )}

                {authUser?.user.tipo_de_cuenta === "CLIENTE" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, ease: "easeOut", delay: 0.15 }}
                  >
                    <NavbarItemMobile
                      name="Mi perfil"
                      location="/profile"
                      pathname={pathname}
                      setOpen={setOpen}
                      icon="heroicons:user-circle-20-solid"
                    />
                  </motion.div>
                )}

                {authUser?.user.tipo_de_cuenta === "BARBERO" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, ease: "easeOut", delay: 0.2 }}
                  >
                    <NavbarItemMobile
                      name="Dashboard"
                      location="/dashboard"
                      pathname={pathname}
                      setOpen={setOpen}
                      icon="heroicons:chart-bar-20-solid"
                    />
                  </motion.div>
                )}

                {authUser != null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, ease: "easeOut", delay: 0.25 }}
                  >
                    <NavbarItemMobile
                      name="Chats"
                      location="/chats"
                      pathname={pathname}
                      setOpen={setOpen}
                      icon="heroicons:chat-bubble-left-right-20-solid"
                    />
                  </motion.div>
                )}

                {authUser?.user.rol === "ADMIN" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, ease: "easeOut", delay: 0.3 }}
                  >
                    <NavbarItemMobile
                      name="Admin dashboard"
                      location="/admins/dashboard"
                      pathname={pathname}
                      setOpen={setOpen}
                      icon="heroicons:shield-check-20-solid"
                    />
                  </motion.div>
                )}

                {authUser?.user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, ease: "easeOut", delay: 0.35 }}
                  >
                    <NavbarItemMobile
                      name="Mi cuenta"
                      location="/profile"
                      pathname={pathname}
                      setOpen={setOpen}
                      icon="heroicons:cog-6-tooth-20-solid"
                    />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Footer con botones de autenticación y animaciones */}
            <div className={`p-6 border-t border-slate-800 bg-gradient-to-t from-slate-950 to-slate-900 transition-all duration-500 ease-out ${
              open 
                ? "transform translate-y-0 opacity-100" 
                : "transform translate-y-4 opacity-0"
            }`} style={{ transitionDelay: open ? "300ms" : "0ms" }}>
              
              {authUser ? (
                <Button
                  variant="simple"
                  onClick={() => {
                    logOut();
                    closeMenu();
                  }}
                  className="group w-full text-red-400 hover:bg-red-900/20 hover:text-red-300 border border-red-800/30 hover:border-red-600/50 transition-all duration-200 flex items-center justify-center gap-2 py-3 rounded-lg"
                >
                  <Icon 
                    icon="heroicons:arrow-right-on-rectangle" 
                    className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" 
                  />
                  <span className="font-medium">Cerrar sesión</span>
                </Button>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/auth/iniciar-sesion"
                    onClick={closeMenu}
                    className="w-full group"
                  >
                    <Button
                      variant="simple"
                      className="w-full border border-gray-600 hover:border-blue-400 hover:bg-blue-500/10 transition-all duration-200 flex items-center justify-center gap-2 py-3 rounded-lg group-hover:shadow-lg group-hover:shadow-blue-500/10"
                    >
                      <Icon 
                        icon="heroicons:arrow-right-on-rectangle" 
                        className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" 
                      />
                      <span className="font-medium">Iniciar sesión</span>
                    </Button>
                  </Link>
                  <Link
                    to="/auth/registrarse"
                    onClick={closeMenu}
                    className="w-full group"
                  >
                    <Button
                      variant="secondary"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-200 flex items-center justify-center gap-2 py-3 rounded-lg shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 group-hover:scale-[1.02]"
                    >
                      <Icon 
                        icon="heroicons:user-plus" 
                        className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" 
                      />
                      <span className="font-medium">Registrarse</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


    </>
  );
};