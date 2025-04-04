import { GoToTop } from "@/utils/toUp"
import { NavLink } from "react-router-dom"

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

export function NavbarItemMobile({
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
  console.log("location", location);
  console.log("pathname", pathname);
  console.log(pathname.startsWith(location));

  return (
    <NavLink
      to={location}
      className={`block rounded-md px-3 py-2 text-base font-medium ${
        (location !== "/" && pathname.startsWith(location)) || location === pathname
          ? "bg-blue-secondary/50 text-white"
          : "text-white"
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
