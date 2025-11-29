import { GoToTop } from "@/utils/toUp"
import { NavLink } from "react-router-dom"
import { Icon } from "@iconify/react/dist/iconify.js"

export function NavbarItemDestock({
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

interface NavbarItemMobileProps {
  location: string
  pathname: string
  name: string
  setOpen: Function
  icon?: string
}

export function NavbarItemMobile({
  location,
  pathname,
  name,
  setOpen,
  icon,
}: NavbarItemMobileProps) {
  const isActive = (location !== "/" && pathname.startsWith(location)) || location === pathname
  
  return (
    <NavLink
      to={location}
      className={`group relative flex items-center gap-3 rounded-xl px-4 py-3.5 text-[15px] font-medium transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-blue-600/20 to-blue-500/20 text-white shadow-lg shadow-blue-500/10"
          : "text-gray-300 hover:text-white hover:bg-slate-800/60"
      }`}
      onClick={() => {
        GoToTop()
        setOpen(false)
      }}
    >
      {icon && (
        <Icon 
          icon={icon} 
          className={`w-5 h-5 transition-all duration-300 ${
            isActive 
              ? "text-blue-400 scale-110" 
              : "text-gray-400 group-hover:text-blue-400 group-hover:scale-110"
          }`}
        />
      )}
      <span className="flex-1">{name}</span>
      {isActive && (
        <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full" />
      )}
      <Icon 
        icon="heroicons:chevron-right-20-solid" 
        className={`w-4 h-4 transition-all duration-300 ${
          isActive
            ? "text-blue-400 translate-x-0 opacity-100"
            : "text-gray-500 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
        }`}
      />
    </NavLink>
  )
}
