import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/authContext";
import { useLogout } from "@/hooks/useLogout";
import { DesktopNavbar } from "./navbar/DesktopNavbar";
import { MobileNavbar } from "./navbar/MobileNavbar";
// Componente principal
const Navbar = () => {
  const { logOut } = useLogout();
  const { authUser } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleDropdownClick = () => {
    setIsDropdownOpen(false);
  };

  const { pathname } = useLocation();

  // Efecto de fondo al hacer scroll (solo para desktop)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20); // Aumenté a 20px para evitar flickering
    };

    // Throttle scroll para mejor performance
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

  // Bloquear scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0px"; // Prevenir layout shift
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, [open]);

  return (
    <>
      {/* Desktop Navbar */}
      <DesktopNavbar
        authUser={authUser}
        logOut={logOut}
        pathname={pathname}
        isScrolled={isScrolled}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        handleDropdownClick={handleDropdownClick}
      />

      {/* Mobile Navbar */}
      <MobileNavbar
        authUser={authUser}
        logOut={logOut}
        pathname={pathname}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
};

export default Navbar;
